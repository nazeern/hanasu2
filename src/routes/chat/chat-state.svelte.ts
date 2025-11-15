import logger from '$lib/logger';
import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime';
import { toChatMessage } from './utils';
import { langInfoList, type LangInfo } from '$lib/constants';
import type { ParsedWord } from './kuromoji-parser';

export type ChatMessage = {
	text: string;
	from: 'user' | 'agent';
	id: string;
	translatedText?: string;
	translationLoading: boolean;
	status: 'completed' | 'in_progress' | 'incomplete';
	tips?: string;
	tipsLoading: boolean;
	tokens?: ParsedWord[];
};

interface ChatInterface {
	prompt: string;
	langInfo: LangInfo;
	connected: boolean;
	messages: ChatMessage[];
	recording: boolean;
	connect(ephemeralKey?: string, initialPrompt?: string): Promise<boolean>;
	close(): void;
	translate(message: ChatMessage): Promise<void>;
	aiAssist(message: ChatMessage): Promise<void>;
	startRecording(): void;
	stopRecording(): void;
	saveSession(): Promise<void>;
}

export class Chat implements ChatInterface {
	private session: RealtimeSession;
	private sessionId: string;
	private sessionStartTime: number;
	private lastUserMessageStartTime?: number;
	private avgResponseDurationMs?: number;

	prompt: string;
	langInfo: LangInfo;
	connected = $state<boolean>(false);
	messages = $state<ChatMessage[]>([]);
	recording = $state<boolean>(false);

	constructor(langCode: string, testMode: boolean, prompt: string, sessionId: string, proficiency: string = 'advanced') {
		this.sessionId = sessionId;
		this.sessionStartTime = Date.now();
		this.prompt = prompt;
		this.langInfo = langInfoList.find((lang) => lang.code === langCode) || langInfoList[0];

		this.connected = false;

		const agent = new RealtimeAgent({
			name: 'Assistant',
			instructions: 'You are a helpful assistant.'
		});

		// Calculate speech speed based on proficiency
		const speed = proficiency === 'beginner' ? 0.75 : proficiency === 'intermediate' ? 0.95 : 1.0;

		const session = new RealtimeSession(agent, {
			model: 'gpt-realtime',
			config: {
				audio: {
					input: {
						transcription: {
							model: 'gpt-4o-transcribe'
						}
						// NO turnDetection config - this means NO automatic turn detection at all
						// We will manually commit audio and create responses
					},
					output: {
						speed: speed
					}
				}
			}
		});
		this.session = session;

		this.messages = [];
		if (testMode) {
			// Sample message if chat is disabled
			this.messages.push({
				text: 'こんにちは',
				from: 'agent',
				id: 'test-message-1',
				translationLoading: false,
				status: 'completed',
				tipsLoading: false
			});
			this.messages.push({
				text: 'よろしくお願う',
				from: 'user',
				id: 'test-message-2',
				translationLoading: false,
				status: 'completed',
				tipsLoading: false
			});

			// Tokenize test messages
			this.messages.forEach((msg) => this.tokenizeMessage(msg));
		}

		this.session.on('history_updated', (items) => {
			items
				.slice(-5)
				.filter((item) => item.type === 'message')
				.forEach((item) => {
					const incomingMessage = toChatMessage(item);
					if (!incomingMessage) return;
					let existingMessage = this.messages.findLast((msg) => msg.id === incomingMessage.id);
					if (existingMessage) {
						// Mutate the existing message object to preserve reactivity
						Object.assign(existingMessage, incomingMessage);
						this.aiAssist(existingMessage);
						this.tokenizeMessage(existingMessage);
					} else {
						// Add new message
						const newMessage: ChatMessage = {
							...incomingMessage,
							translationLoading: false,
							tipsLoading: false
						};
						this.messages.push(newMessage);
						this.aiAssist(newMessage);
						this.tokenizeMessage(newMessage);
					}
				});
		});
	}

	async connect(ephemeralKey?: string): Promise<boolean> {
		if (!ephemeralKey) {
			return false;
		}
		if (this.connected) {
			logger.warn('Chat session already connected, ignoring duplicate connect call');
			return true;
		}
		try {
			await this.session.connect({
				apiKey: ephemeralKey
			});

			this.session.sendMessage({
				type: 'message',
				role: 'user',
				content: [
					{
						type: 'input_text',
						text: `Say this in ${this.langInfo.displayName}: ${this.prompt}`
					}
				]
			});
			// Start with microphone muted to prevent automatic audio capture
			this.session.mute(true);

			this.connected = true;
			return true;
		} catch {
			logger.error('Failed to connect to OpenAI Realtime session');
			return false;
		}
	}

	close(): void {
		if (!this.connected) {
			return;
		}
		// Save session before closing
		this.saveSession();
		this.session.close();
	}

	async translate(message: ChatMessage): Promise<void> {
		if (message.translatedText) {
			return;
		}

		message.translationLoading = true;
		try {
			const response = await fetch('/chat/translate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text: message.text
				})
			});

			if (!response.ok) {
				logger.error('Translation API request failed');
				return;
			}

			const result = await response.json();
			if (result.translatedText) {
				message.translatedText = result.translatedText;
			}
		} catch (error) {
			logger.error('Translation failed');
		} finally {
			message.translationLoading = false;
		}
	}

	async aiAssist(message: ChatMessage): Promise<void> {
		if (message.from !== 'user' || message.status !== 'completed') return;
		if (message.tipsLoading || message.tips !== undefined) return;

		message.tipsLoading = true;
		try {
			const messageIndex = this.messages.findIndex((msg) => msg.id === message.id);
			const recentMessages = this.messages.slice(messageIndex - 2, messageIndex);
			const response = await fetch('/chat/assist', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text: message.text,
					langDisplayName: this.langInfo.displayName,
					recentMessages
				})
			});

			if (!response.ok) {
				logger.error('AI assist API request failed');
				return;
			}

			const result = await response.json();
			message.tips = result.tip;
		} catch (error) {
			logger.error('AI assist failed');
		} finally {
			message.tipsLoading = false;
		}
	}

	async tokenizeMessage(message: ChatMessage): Promise<void> {
		if (message.status !== 'completed') return;
		if (message.tokens !== undefined) return;

		try {
			const response = await fetch('/chat/tokenize', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text: message.text
				})
			});

			if (!response.ok) {
				logger.error('Tokenization API request failed');
				return;
			}

			const result = await response.json();
			message.tokens = result.tokens;
		} catch (error) {
			logger.error('Tokenization failed', error);
		}
	}

	startRecording(): void {
		this.recording = true;
		this.session.mute(false);
		this.lastUserMessageStartTime = Date.now();
	}

	stopRecording(): void {
		this.session.mute(true);
		this.recording = false;

		// Update average response time
		if (this.lastUserMessageStartTime) {
			const responseTime = Date.now() - this.lastUserMessageStartTime;
			const n = Math.floor(this.messages.length / 2) + 1
			this.avgResponseDurationMs = (n * (this.avgResponseDurationMs ?? responseTime) + responseTime) / (n + 1);
		}
	}

	async saveSession(useBeacon: boolean = false): Promise<void> {
		// Don't save if we never connected
		if (!this.connected) {
			return;
		}

		try {
			const duration = Date.now() - this.sessionStartTime;
			const sessionData = {
				sessionId: this.sessionId,
				lang: this.langInfo.code,
				topic: this.prompt,
				duration: duration,
				nResponses: this.messages.length,
				avgResponseDurationMs: this.avgResponseDurationMs
			};

			if (useBeacon && navigator.sendBeacon) {
				// Use sendBeacon for reliable delivery during page unload
				const blob = new Blob([JSON.stringify(sessionData)], {
					type: 'application/json'
				});
				navigator.sendBeacon('/chat/session', blob);
			} else {
				// Use fetch for normal saves
				await fetch('/chat/session', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(sessionData)
				});
			}
		} catch (error) {
			// just log error, shouldn't be user facing
			logger.error('Failed to save session', error);
		}
	}
}

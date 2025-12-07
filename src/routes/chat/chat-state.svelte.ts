import logger from '$lib/logger';
import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime';
import { toChatMessage, parseTokenUsage } from './utils';
import { langInfoList, type LangInfo } from '$lib/constants';
import type { ParsedWord } from './kuromoji-parser';
import { getAgentInstructions } from './constants';

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
	tokensLoading: boolean;
};

interface ChatInterface {
	prompt: string;
	langInfo: LangInfo;
	connected: boolean;
	messages: ChatMessage[];
	recording: boolean;
	connect(ephemeralKey?: string, initialPrompt?: string): Promise<boolean>;
	close(): void;
	translate(messageIndex: number): Promise<void>;
	aiAssist(messageIndex: number): Promise<void>;
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

	constructor(langCode: string, showSampleChat: boolean, prompt: string, sessionId: string, proficiency: string = 'advanced') {
		this.sessionId = sessionId;
		this.sessionStartTime = Date.now();
		this.prompt = prompt;
		this.langInfo = langInfoList.find((lang) => lang.code === langCode) || langInfoList[0];

		this.connected = false;

		const agent = new RealtimeAgent({
			name: 'Assistant',
			instructions: getAgentInstructions(proficiency)
		});

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
					}
				}
			}
		});
		this.session = session;

		this.messages = [];
		if (showSampleChat) {
			// Sample message if chat is disabled
			this.messages.push({
				text: 'こんにちは',
				from: 'agent',
				id: 'test-message-1',
				translationLoading: false,
				status: 'completed',
				tipsLoading: false,
				tokensLoading: false
			});
			this.messages.push({
				text: 'よろしくお願う',
				from: 'user',
				id: 'test-message-2',
				translationLoading: false,
				status: 'completed',
				tipsLoading: false,
				tokensLoading: false
			});
			this.messages.push({
				text: '今日はいい天気ですね',
				from: 'agent',
				id: 'test-message-3',
				translationLoading: false,
				status: 'completed',
				tipsLoading: false,
				tokensLoading: false
			});
			this.messages.push({
				text: '本当に！散歩に行きたいです',
				from: 'user',
				id: 'test-message-4',
				translationLoading: false,
				status: 'completed',
				tipsLoading: false,
				tokensLoading: false
			});
			this.messages.push({
				text: 'いいですね。公園に行きますか',
				from: 'agent',
				id: 'test-message-5',
				translationLoading: false,
				status: 'completed',
				tipsLoading: false,
				tokensLoading: false
			});
			this.messages.push({
				text: 'はい、行きましょう',
				from: 'user',
				id: 'test-message-6',
				translationLoading: false,
				status: 'completed',
				tipsLoading: false,
				tokensLoading: false
			});
			this.messages.push({
				text: '何時に出発しますか',
				from: 'agent',
				id: 'test-message-7',
				translationLoading: false,
				status: 'completed',
				tipsLoading: false,
				tokensLoading: false
			});
			this.messages.push({
				text: '二時はどうですか',
				from: 'user',
				id: 'test-message-8',
				translationLoading: false,
				status: 'completed',
				tipsLoading: false,
				tokensLoading: false
			});

			// Tokenize test messages
			this.messages.forEach((msg, index) => this.tokenizeMessage(index));
		}

		this.session.on('history_updated', (items) => {
			items
				.slice(-5)
				.filter((item) => item.type === 'message')
				.forEach((item) => {
					const incomingMessage = toChatMessage(item);
					if (!incomingMessage) return;
					const existingIndex = this.messages.findIndex((msg) => msg.id === incomingMessage.id);
					if (existingIndex !== -1) {
						// Mutate the existing message object to preserve reactivity
						Object.assign(this.messages[existingIndex], incomingMessage);
						this.aiAssist(existingIndex);
						this.tokenizeMessage(existingIndex);
					} else {
						// Add new message
						const newMessage: ChatMessage = {
							...incomingMessage,
							translationLoading: false,
							tipsLoading: false,
							tokensLoading: false
						};
						this.messages.push(newMessage);
						const newIndex = this.messages.length - 1;
						this.aiAssist(newIndex);
						this.tokenizeMessage(newIndex);
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

	async translate(messageIndex: number): Promise<void> {
		if (messageIndex < 0 || messageIndex >= this.messages.length) return;
		if (this.messages[messageIndex].translatedText) return;

		// Update through array reference to ensure reactivity
		this.messages[messageIndex].translationLoading = true;
		try {
			const response = await fetch('/chat/translate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text: this.messages[messageIndex].text
				})
			});

			if (!response.ok) {
				logger.error('Translation API request failed');
				this.messages[messageIndex].translationLoading = false;
				return;
			}

			const result = await response.json();
			if (result.translatedText) {
				this.messages[messageIndex].translatedText = result.translatedText;
			}
			this.messages[messageIndex].translationLoading = false;
		} catch (error) {
			logger.error('Translation failed');
			this.messages[messageIndex].translationLoading = false;
		}
	}

	async aiAssist(messageIndex: number): Promise<void> {
		if (messageIndex < 0 || messageIndex >= this.messages.length) return;
		const message = this.messages[messageIndex];
		if (message.from !== 'user' || message.status !== 'completed') return;
		if (message.tipsLoading || message.tips !== undefined) return;

		// Update through array reference to ensure reactivity
		this.messages[messageIndex].tipsLoading = true;
		try {
			const recentMessages = this.messages.slice(messageIndex - 2, messageIndex);
			const response = await fetch('/chat/assist', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text: this.messages[messageIndex].text,
					langDisplayName: this.langInfo.displayName,
					recentMessages
				})
			});

			if (!response.ok) {
				logger.error('AI assist API request failed');
				this.messages[messageIndex].tipsLoading = false;
				return;
			}

			const result = await response.json();
			this.messages[messageIndex].tips = result.tip;
			this.messages[messageIndex].tipsLoading = false;
		} catch (error) {
			logger.error('AI assist failed');
			this.messages[messageIndex].tipsLoading = false;
		}
	}

	async tokenizeMessage(messageIndex: number): Promise<void> {
		if (messageIndex < 0 || messageIndex >= this.messages.length) return;
		const message = this.messages[messageIndex];
		if (message.status !== 'completed') return;
		if (message.tokensLoading || message.tokens !== undefined) return;

		// Update through array reference to ensure reactivity
		this.messages[messageIndex].tokensLoading = true;
		try {
			const response = await fetch('/chat/tokenize', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text: this.messages[messageIndex].text
				})
			});

			if (!response.ok) {
				logger.error('Tokenization API request failed');
				this.messages[messageIndex].tokensLoading = false;
				return;
			}

			const result = await response.json();
			this.messages[messageIndex].tokens = result.tokens;
			this.messages[messageIndex].tokensLoading = false;
		} catch (error) {
			logger.error('Tokenization failed', error);
			this.messages[messageIndex].tokensLoading = false;
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

			const usage = parseTokenUsage(this.session.usage);

			const sessionData = {
				sessionId: this.sessionId,
				lang: this.langInfo.code,
				topic: this.prompt,
				duration: duration,
				nResponses: this.messages.length,
				avgResponseDurationMs: this.avgResponseDurationMs,
				usage
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

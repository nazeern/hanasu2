import logger from '$lib/logger';
import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime';
import { toChatMessage } from './utils';
import type { LangInfo } from '$lib/constants';
import langInfoList from '$lib/constants';

export type ChatMessage = {
	text: string;
	from: 'user' | 'agent';
	id: string;
	translatedText?: string;
	translationLoading: boolean;
	status: 'completed' | 'in_progress' | 'incomplete';
	tips?: string;
	tipsLoading: boolean;
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
}

export class Chat implements ChatInterface {
	private session: RealtimeSession;

	prompt: string;
	langInfo: LangInfo;
	connected = $state<boolean>(false);
	messages = $state<ChatMessage[]>([]);
	recording = $state<boolean>(false);

	constructor(langCode: string, testMode: boolean, prompt: string) {
		this.prompt = prompt;
		this.langInfo = langInfoList.find((lang) => lang.code === langCode) || langInfoList[0];

		this.connected = false;
		const agent = new RealtimeAgent({
			name: 'Assistant',
			instructions: 'You are a helpful assistant.'
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
		}

		this.session.on('history_updated', (items) => {
			items
				.slice(-5)
				.filter((item) => item.type === 'message')
				.forEach((item) => {
					const incomingMessage = toChatMessage(item);
					if (!incomingMessage) return;
					let existingMessage = this.messages.findLast((msg) => msg.id === incomingMessage.id);
					let newMessage: ChatMessage;
					if (existingMessage) {
						newMessage = {
							...existingMessage,
							...incomingMessage
						};
						existingMessage = newMessage;
					} else {
						newMessage = {
							...incomingMessage,
							translationLoading: false,
							tipsLoading: false
						};
						this.messages.push(newMessage);
					}
					this.aiAssist(newMessage);
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

	startRecording(): void {
		this.recording = true;
		this.session.mute(false);
	}

	stopRecording(): void {
		this.session.mute(true);
		this.recording = false;
	}
}

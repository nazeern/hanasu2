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
		this.prompt = prompt
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
				translationLoading: false
			});
		}

		this.session.on('history_updated', (items) => {
			items
				.slice(-5)
				.filter((item) => item.type === 'message')
				.forEach((item) => {
					const incomingMessage = toChatMessage(item);
					let existingIdx = this.messages.findLastIndex((msg) => msg.id === incomingMessage.id);
					if (existingIdx >= 0) {
						this.messages[existingIdx] = incomingMessage;
					} else {
						this.messages.push(incomingMessage);
					}
				});
		});
	}

	async connect(ephemeralKey?: string, initialPrompt?: string): Promise<boolean> {
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

	startRecording(): void {
		this.recording = true;
		this.session.mute(false);
	}

	stopRecording(): void {
		this.session.mute(true);
		this.recording = false;
	}
}

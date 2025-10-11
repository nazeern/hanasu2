import logger from '$lib/logger';
import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime';
import { toChatMessage } from './utils';

export type WordLookup = {
	loading: boolean;
	word?: string;
	baseForm?: string;
	partOfSpeech?: string;
	reading?: string;
	pronunciation?: string;
};

export type ChatMessage = {
	text: string;
	from: 'user' | 'agent';
	id: string;
	translatedText?: string;
	translationLoading: boolean;
};

interface ChatInterface {
	connected: boolean;
	messages: ChatMessage[];
	wordLookup: WordLookup | null;
	connect(ephemeralKey?: string): Promise<boolean>;
	close(): void;
	translate(message: ChatMessage): Promise<void>;
	lookupWord(message: ChatMessage, tapIndex: number): Promise<void>;
}

export class Chat implements ChatInterface {
	private session: RealtimeSession;

	connected = $state<boolean>(false);
	messages = $state<ChatMessage[]>([]);
	wordLookup = $state<WordLookup | null>(null);

	constructor(language: string, testMode: boolean) {
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
							model: 'gpt-4o-transcribe',
							language: language
						}
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

	async lookupWord(message: ChatMessage, tapIndex: number): Promise<void> {
		this.wordLookup = {
			loading: true
		};

		try {
			const response = await fetch('/chat/lookup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					sentence: message.text,
					tapIndex: tapIndex
				})
			});

			if (!response.ok) {
				throw new Error('Word lookup API request failed');
			}

			const result = await response.json();

			this.wordLookup = {
				word: result.word,
				baseForm: result.baseForm,
				partOfSpeech: result.partOfSpeech,
				reading: result.reading,
				pronunciation: result.pronunciation,
				loading: false
			};
		} catch (error) {
			logger.error('Word lookup failed', error);
			this.wordLookup = null;
		}
	}
}

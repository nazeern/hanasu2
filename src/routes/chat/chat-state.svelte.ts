import logger from '$lib/logger';
import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime';
import { toChatMessage } from './utils';

export type ChatMessage = {
	text: string;
	from: string;
	id: string;
};

interface ChatInterface {
	connected: boolean;
	messages: ChatMessage[];
	connect(ephemeralKey?: string): Promise<boolean>;
	close(): void;
}

export class Chat implements ChatInterface {
	private session: RealtimeSession;

	connected = $state<boolean>(false);
	messages = $state<ChatMessage[]>([]);

	constructor(language: string) {
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
		this.session.on('history_updated', (items) => {
			items
				.slice(-5)
				.filter((item) => item.type === 'message')
				.forEach((item) => {
					const incomingMessage = toChatMessage(item);
					let existingIdx = this.messages.findLastIndex((msg) => msg.id === incomingMessage.id);
					if (existingIdx >= 0) {
						this.messages[existingIdx] = incomingMessage
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
}

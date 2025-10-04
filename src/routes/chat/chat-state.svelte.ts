import logger from '$lib/logger';
import { RealtimeAgent, RealtimeSession, type RealtimeMessageItem } from '@openai/agents-realtime';

type ChatMessage = {
	text: string;
	from: string;
	id: string;
};

function toChatMessage(oaiMessage: RealtimeMessageItem): ChatMessage {
	const text = oaiMessage.content
		.map((segment) => {
			switch (segment.type) {
				case 'input_audio':
				case 'output_audio':
					return segment.transcript ?? '';
				default:
					return '';
			}
		})
		.filter(Boolean)
		.join(' ');

	return {
		text,
		from: oaiMessage.role,
		id: oaiMessage.itemId
	};
}

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
		// Write chat messages as AI speaks
		this.session.on('history_updated', (items) => {
			const item = items.at(-1);
			if (item?.type !== 'message') {
				return;
			}
			const thisMessage = toChatMessage(item);
			const lastMessage = this.messages.at(-1);
			if (thisMessage.id === lastMessage?.id) {
				const n = this.messages.length;
				this.messages[n - 1] = thisMessage;
			} else {
				this.messages.push(thisMessage);
			}
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

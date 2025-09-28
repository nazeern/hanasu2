import logger from '$lib/logger';
import { RealtimeAgent, RealtimeSession, } from '@openai/agents-realtime';

type ChatMessage = {
	text: string;
};

interface ChatInterface {
	connected: boolean;
	messages: ChatMessage[];
	connect(promisedEphemeralKey: Promise<string | undefined>): Promise<boolean>;
}

export class Chat implements ChatInterface {
	private session: RealtimeSession;

	connected = $state<boolean>(false);
	messages = $state<ChatMessage[]>([]);

	constructor() {
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
					}
				}
			}
		});
		this.session = session;

		this.messages = [];
		this.session.on('history_updated', (history) => {
			logger.info('recv history');
			logger.info(history);
		});
	}

	async connect(promisedEphemeralKey: Promise<string | undefined>): Promise<boolean> {
		const ephemeralKey = await promisedEphemeralKey;
		if (!ephemeralKey) {
			return false;
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
}

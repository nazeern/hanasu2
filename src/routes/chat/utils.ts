import type { RealtimeMessageItem } from '@openai/agents-realtime';
import type { ChatMessage } from './chat-state.svelte';

export function toChatMessage(oaiMessage: RealtimeMessageItem): ChatMessage {
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
		from: oaiMessage.role == 'assistant' ? 'agent' : 'user',
		id: oaiMessage.itemId,
		translationLoading: false,
		lookupLoading: false
	};
}

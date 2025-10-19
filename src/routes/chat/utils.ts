import type { RealtimeMessageItem } from '@openai/agents-realtime';

type OAIMessage = {
	text: string;
	from: 'user' | 'agent';
	id: string;
	status: 'completed' | 'in_progress' | 'incomplete';
}

export function toChatMessage(oaiMessage: RealtimeMessageItem): OAIMessage | null {
	if (oaiMessage.role !== 'user' && oaiMessage.role !== 'assistant') return null;

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
	if (!text) return null;

	return {
		text,
		from: oaiMessage.role == 'assistant' ? 'agent' : 'user',
		id: oaiMessage.itemId,
		status: oaiMessage.status,
	};
}

import type { RealtimeMessageItem } from '@openai/agents-realtime';

type OAIMessage = {
	text: string;
	from: 'user' | 'agent';
	id: string;
	status: 'completed' | 'in_progress' | 'incomplete';
}

// Type definitions for OpenAI Realtime Session usage
interface InputTokenDetails {
	text_tokens?: number;
	audio_tokens?: number;
	image_tokens?: number;
	cached_tokens?: number;
	cached_tokens_details?: {
		text_tokens?: number;
		audio_tokens?: number;
		image_tokens?: number;
	};
}

interface OutputTokenDetails {
	text_tokens?: number;
	audio_tokens?: number;
	image_tokens?: number;
}

interface Usage {
	requests?: number;
	inputTokens?: number;
	outputTokens?: number;
	totalTokens?: number;
	inputTokensDetails?: InputTokenDetails[];
	outputTokensDetails?: OutputTokenDetails[];
}

export interface ConsolidatedUsage {
	audio: { input: number; output: number; cached: number };
	text: { input: number; output: number; cached: number };
}

export function parseTokenUsage(usage: Usage): ConsolidatedUsage | null {
	if (!usage.inputTokensDetails || !usage.outputTokensDetails) {
		return null;
	}

	// Sum up all input tokens
	let textInput = 0;
	let audioInput = 0;
	let textCached = 0;
	let audioCached = 0;

	usage.inputTokensDetails.forEach((detail) => {
		textInput += detail.text_tokens ?? 0;
		audioInput += detail.audio_tokens ?? 0;
		if (detail.cached_tokens_details) {
			textCached += detail.cached_tokens_details.text_tokens ?? 0;
			audioCached += detail.cached_tokens_details.audio_tokens ?? 0;
		}
	});

	// Sum up all output tokens
	let textOutput = 0;
	let audioOutput = 0;

	usage.outputTokensDetails.forEach((detail) => {
		textOutput += detail.text_tokens ?? 0;
		audioOutput += detail.audio_tokens ?? 0;
	});

	return {
		audio: {
			input: audioInput,
			output: audioOutput,
			cached: audioCached
		},
		text: {
			input: textInput,
			output: textOutput,
			cached: textCached
		}
	};
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

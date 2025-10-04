import type { RealtimeMessageItem } from "@openai/agents-realtime";
import type { ChatMessage } from "./chat-state.svelte";
import type { SvelteFetch } from "./+page.server";
import { OPENAI_SECRET_KEY } from "$env/static/private";
import { isString } from "$lib/util";

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
		from: oaiMessage.role,
		id: oaiMessage.itemId,
		translationLoading: false,
		lookupLoading: false
	};
}

export async function generateEphemeralKey(fetch: SvelteFetch): Promise<string | undefined> {
	const sessionConfig: string = JSON.stringify({
		session: {
			type: 'realtime',
			model: 'gpt-realtime',
			audio: {
				output: {
					voice: 'marin'
				}
			}
		}
	});

	const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${OPENAI_SECRET_KEY}`,
			'Content-Type': 'application/json'
		},
		body: sessionConfig
	});

	const data = await response.json();
	const ephemeralKey = data.value;
	if (isString(ephemeralKey)) {
		return ephemeralKey;
	}

	return undefined;
}


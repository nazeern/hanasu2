import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { OPENAI_SECRET_KEY } from '$env/static/private';
import { isString } from '$lib/util';

type SvelteFetch = Parameters<PageServerLoad>[0]['fetch'];

export const load: PageServerLoad = async ({ fetch, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (!session) {
		redirect(303, '/login');
	}

	const ephemeralKey = generateEphemeralKey(fetch);

	return { ephemeralKey };
};

async function generateEphemeralKey(fetch: SvelteFetch): Promise<string | undefined> {
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

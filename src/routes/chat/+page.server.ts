import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { OPENAI_SECRET_KEY } from '$env/static/private';
import { isString } from '$lib/util';
import { dev } from '$app/environment';
import { randomUUID } from 'crypto';

export type SvelteFetch = Parameters<PageServerLoad>[0]['fetch'];

export const load: PageServerLoad = async ({
	fetch,
	url,
	locals: { safeGetSession, supabase }
}) => {
	const testMode = dev && url.searchParams.get('test') === 'true';
	const prompt = url.searchParams.get('prompt');

	const { session, user } = await safeGetSession();
	if (!session || !user) {
		redirect(303, '/login');
	}

	const getProfileStmt = supabase.from('profiles').select('lang, proficiency').eq('id', user.id).single();
	const { data: profile } = await getProfileStmt;
	const ephemeralKey = await generateEphemeralKey(fetch);

	return {
		sessionId: randomUUID(),
		ephemeralKey: testMode ? undefined : ephemeralKey,
		language: profile?.lang ?? 'ja',
		proficiency: profile?.proficiency ?? 'advanced',
		testMode: testMode,
		prompt: prompt ?? 'How was your day today?'
	};
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

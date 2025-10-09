import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { OPENAI_SECRET_KEY } from '$env/static/private';
import { isString } from '$lib/util';
import { dev } from '$app/environment';

export type SvelteFetch = Parameters<PageServerLoad>[0]['fetch'];

export const load: PageServerLoad = async ({
	fetch,
	url,
	locals: { safeGetSession, supabase }
}) => {
	const testMode = dev && url.searchParams.get('test') === 'true';

	const { session, user } = await safeGetSession();
	if (!session || !user) {
		redirect(303, '/login');
	}

	const getProfileLangStmt = supabase.from('profiles').select('lang').eq('id', user.id).single();
	const [ephemeralKey, { data: profile }] = await Promise.all([
		generateEphemeralKey(fetch),
		getProfileLangStmt
	]);

	return {
		ephemeralKey: testMode ? undefined : ephemeralKey,
		language: profile?.lang ?? 'ja',
		testMode: testMode
	};
};

export const actions: Actions = {
	lookupWord: async ({ request }) => {
		const formData = await request.formData();
		const sentence = formData.get('sentence');
		const tapIndexStr = formData.get('tapIndex');

		if (!isString(sentence) || !isString(tapIndexStr)) {
			return fail(400, { error: 'Invalid request' });
		}

		const tapIndex = parseInt(tapIndexStr, 10);
		if (isNaN(tapIndex)) {
			return fail(400, { error: 'Invalid tap index' });
		}

		try {
			const kuromoji = await import('kuromoji');

			return new Promise((resolve) => {
				kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build((err, tokenizer) => {
					if (err || !tokenizer) {
						resolve(fail(500, { error: 'Tokenizer initialization failed' }));
						return;
					}

					const tokens = tokenizer.tokenize(sentence);
					let currentIndex = 0;

					for (const token of tokens) {
						const tokenLength = token.surface_form.length;
						if (tapIndex >= currentIndex && tapIndex < currentIndex + tokenLength) {
							resolve({ word: token.surface_form });
							return;
						}
						currentIndex += tokenLength;
					}

					resolve(fail(404, { error: 'No word found at tap position' }));
				});
			});
		} catch (error) {
			console.error('Word lookup error:', error);
			return fail(500, { error: 'Word lookup failed' });
		}
	}
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

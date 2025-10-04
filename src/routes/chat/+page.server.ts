import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { GOOGLE_TRANSLATE_API_KEY } from '$env/static/private';
import { isString } from '$lib/util';
import { generateEphemeralKey } from './utils';

export type SvelteFetch = Parameters<PageServerLoad>[0]['fetch'];

export const load: PageServerLoad = async ({ fetch, locals: { safeGetSession, supabase } }) => {
	const { session, user } = await safeGetSession();
	if (!session || !user) {
		redirect(303, '/login');
	}

	const getProfileLangStmt = supabase.from('profiles').select('lang').eq('id', user.id).single();
	const [ephemeralKey, { data: profile }] = await Promise.all([
		generateEphemeralKey(fetch),
		getProfileLangStmt
	]);

	let language = 'ja';
	if (profile) {
		language = profile.lang;
	}

	return { ephemeralKey, language };
};


export const actions: Actions = {
	translate: async ({ request, fetch }) => {
		const formData = await request.formData();
		const text = formData.get('text');

		if (!isString(text)) {
			return fail(400, { error: 'Invalid request' });
		}

		if (!text.trim()) {
			return fail(400, { error: 'Text cannot be empty' });
		}

		try {
			const url = new URL('https://translation.googleapis.com/language/translate/v2');
			url.searchParams.append('key', GOOGLE_TRANSLATE_API_KEY);

			const response = await fetch(url.toString(), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					q: text,
					target: 'en',
					format: 'text'
				})
			});

			if (!response.ok) {
				return fail(500, { error: 'Translation API request failed' });
			}

			const res = await response.json();
			const translatedText = res.data?.translations?.[0]?.translatedText;

			if (!isString(translatedText)) {
				return fail(500, { error: 'Invalid translation response' });
			}

			return { translatedText };
		} catch (error) {
			console.error('Translation error:', error);
			return fail(500, { error: 'Translation failed' });
		}
	}
};

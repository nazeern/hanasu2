import logger from '$lib/logger';
import { json, error, type RequestHandler } from '@sveltejs/kit';
import { GOOGLE_TRANSLATE_API_KEY } from '$env/static/private';
import { isString } from '$lib/util';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const text = body.text;

	if (!isString(text)) {
		return error(400, { message: 'Invalid request' });
	}

	if (!text.trim()) {
		return error(400, { message: 'Text cannot be empty' });
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
				q: [text],
				target: 'en',
				format: 'text'
			})
		});

		if (!response.ok) {
			logger.error(
				{
					status: response.status,
					statusText: response.statusText,
					ok: response.ok
				},
				'Google Translate API request failed'
			);
			return error(500, { message: 'Google Translate API request failed' });
		}

		const res = await response.json();
		const translatedText = res.data?.translations?.[0]?.translatedText;

		if (!isString(translatedText)) {
			return error(500, { message: 'Invalid translation response' });
		}

		return json({ translatedText });
	} catch (err) {
		logger.error({ error: err }, 'Translation error');
		return error(500, { message: 'Translation failed' });
	}
};

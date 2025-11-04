import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { tokenizeSentence } from '../kuromoji-parser';
import { isString } from '$lib/util';
import logger from '$lib/logger';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { text } = body;

	if (!isString(text)) {
		logger.warn('Invalid request: missing text');
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	try {
		const tokens = await tokenizeSentence(text);
		return json({ tokens });
	} catch (error) {
		logger.error('Tokenization error', error);
		return json({ error: 'Tokenization failed' }, { status: 500 });
	}
};

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { parseWordAtIndex } from '../kuromoji-parser';
import { isString } from '$lib/util';
import logger from '$lib/logger';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { sentence, tapIndex } = body;

	if (!isString(sentence) || typeof tapIndex !== 'number') {
		logger.warn('Invalid request: missing sentence or tapIndex');
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	if (isNaN(tapIndex)) {
		logger.warn('Invalid tap index: not a number');
		return json({ error: 'Invalid tap index' }, { status: 400 });
	}

	try {
		const parsedWord = await parseWordAtIndex(sentence, tapIndex);

		if (!parsedWord) {
			logger.warn(`No word found at tap position ${tapIndex}`);
			return json({ error: 'No word found at tap position' }, { status: 404 });
		}

		return json({
			word: parsedWord.surfaceForm,
			baseForm: parsedWord.baseForm,
			partOfSpeech: parsedWord.partOfSpeech,
			reading: parsedWord.reading,
			pronunciation: parsedWord.pronunciation
		});
	} catch (error) {
		logger.error('Word lookup error', error);
		return json({ error: 'Word lookup failed' }, { status: 500 });
	}
};

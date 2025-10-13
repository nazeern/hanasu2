import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { parseWordAtIndex } from '../kuromoji-parser';
import { isString } from '$lib/util';
import logger from '$lib/logger';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
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
		logger.info(`Parsed word: ${parsedWord.surfaceForm} (base: ${parsedWord.baseForm})`);
		logger.info(`Searching ja_dict where readings contains: ${parsedWord.surfaceForm}`);
		const { data: dictEntries, error: dictError } = await supabase
			.from('ja_dict')
			.select('*')
			.contains('readings', [parsedWord.surfaceForm]);

		if (dictError) {
			logger.error('Dictionary query error', dictError);
		}

		// Combine kuromoji data with dictionary data
		// If multiple entries exist, use the first one for now
		const dictEntry = dictEntries && dictEntries.length > 0 ? dictEntries[0] : null;

		return json({
			word: parsedWord.surfaceForm,
			baseForm: parsedWord.baseForm,
			partOfSpeech: parsedWord.partOfSpeech,
			reading: parsedWord.reading,
			pronunciation: parsedWord.pronunciation,
			definitions: dictEntry?.definitions || null,
			examples: dictEntry?.featured || null
		});
	} catch (error) {
		logger.error('Word lookup error', error);
		return json({ error: 'Word lookup failed' }, { status: 500 });
	}
};

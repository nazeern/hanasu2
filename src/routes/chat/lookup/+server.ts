import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { parseWordAtIndex } from '../kuromoji-parser';
import { isString } from '$lib/util';
import logger from '$lib/logger';

export const POST: RequestHandler = async ({ request, locals: { safeGetSession, supabase } }) => {
	const body = await request.json();
	const { sentence, tapIndex, lang } = body;

	if (!isString(sentence) || typeof tapIndex !== 'number' || !isString(lang)) {
		logger.warn('Invalid request: missing sentence, tapIndex, or lang');
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	if (isNaN(tapIndex)) {
		logger.warn('Invalid tap index: not a number');
		return json({ error: 'Invalid tap index' }, { status: 400 });
	}

	try {
		const { user } = await safeGetSession();
		const parsedWord = await parseWordAtIndex(sentence, tapIndex);

		if (!parsedWord) {
			logger.warn(`No word found at tap position ${tapIndex}`);
			return json({ error: 'No word found at tap position' }, { status: 404 });
		}
		const { data: dictEntries, error: dictError } = await supabase
			.from('ja_dict')
			.select('*')
			.contains('readings', [parsedWord.surfaceForm]);
		if (dictError) {
			logger.error('Dictionary query error', dictError);
			return json({ error: 'Dictionary query failed' }, { status: 500 });
		}

		if (!user) {
			const entriesWithVocab = dictEntries?.map((entry) => ({ ...entry, vocabulary: null }));
			return json({ word: parsedWord.surfaceForm, definitions: entriesWithVocab });
		}

		const wordIds = dictEntries.map((entry) => entry.id);
		const { data: vocabData } = await supabase
			.from('vocabulary')
			.select('*')
			.eq('user_id', user.id)
			.eq('lang', lang)
			.in('word_id', wordIds);
		const vocabMap = new Map(vocabData?.map((v) => [v.word_id, v]));

		const entriesWithVocab = dictEntries.map((entry) => ({
			...entry,
			vocabulary: vocabMap.get(entry.id) || null
		}));

		return json({
			word: parsedWord.surfaceForm,
			definitions: entriesWithVocab
		});
	} catch (error) {
		logger.error('Word lookup error', error);
		return json({ error: 'Word lookup failed' }, { status: 500 });
	}
};

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { ParsedWord } from '../kuromoji-parser';
import { isString } from '$lib/util';
import logger from '$lib/logger';

interface LookupRequestBody {
	parsedWord: ParsedWord;
	lang: string;
}

export const POST: RequestHandler = async ({ request, locals: { safeGetSession, supabase } }) => {
	const body = await request.json();
	const { parsedWord, lang } = body as LookupRequestBody;

	if (!isString(lang)) {
		logger.warn('Invalid request: missing lang');
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	if (!parsedWord) {
		logger.warn('Invalid request: missing parsedWord');
		return json({ error: 'Invalid request: parsedWord required' }, { status: 400 });
	}

	try {
		const { user } = await safeGetSession();
		logger.info(parsedWord, 'Looking up parsed word');

		const { data: dictEntries, error: dictError } = await supabase
			.from('ja_dict')
			.select('*')
			.contains('readings', [parsedWord.baseForm]);
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

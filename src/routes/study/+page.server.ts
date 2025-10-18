import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Tables } from '../../database.types';

type StudyItem = {
	vocabulary: Tables<'vocabulary'>;
	dictEntry: Tables<'ja_dict'>;
};

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session, user } = await safeGetSession();
	if (!session || !user) {
		redirect(303, '/login');
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select('lang')
		.eq('id', user.id)
		.single();
	if (!profile) {
		throw error(500, 'Failed to fetch user profile');
	}

	const now = new Date().toISOString();

	const { data: vocabularyRecords, error: vocabError } = await supabase
		.from('vocabulary')
		.select('*')
		.eq('user_id', user.id)
		.eq('lang', profile.lang)
		.lte('due', now)
		.order('due', { ascending: true })
		.limit(20);
	if (vocabError) {
		throw error(500, 'Failed to fetch vocabulary');
	}
	if (!vocabularyRecords) {
		return { studyQueue: [], language: profile.lang };
	}
	const wordIds = vocabularyRecords.map((v) => v.word_id);

	const { data: dictEntries, error: dictError } = await supabase
		.from('ja_dict')
		.select('*')
		.in('id', wordIds);
	if (dictError) {
		throw error(500, 'Failed to fetch dictionary entries');
	}
	const wordMap = new Map(dictEntries.map((entry) => [entry.id, entry]));

	const studyQueue = vocabularyRecords
		.map((vocab) => ({
			vocabulary: vocab,
			dictEntry: wordMap.get(vocab.word_id) || null
		}))
		.filter((item): item is StudyItem => item.dictEntry !== null);

	return { studyQueue, language: profile.lang };
};

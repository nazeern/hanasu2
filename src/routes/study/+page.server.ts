import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Definition, DictEntry } from '$lib/dictionary.svelte';

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

	const studyQueue: DictEntry[] = vocabularyRecords
		.map((vocab) => {
			const word = wordMap.get(vocab.word_id);
			if (!word) return null;
			return {
				...word,
				definitions: word.definitions as Definition[],
				vocabulary: vocab
			} as DictEntry;
		})
		.filter((item): item is DictEntry => item !== null);

	return { studyQueue, language: profile.lang };
};

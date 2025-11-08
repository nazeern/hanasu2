import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Definition, DictEntry } from '$lib/dictionary.svelte';

const CONVERSATION_PROMPTS = [
	'How was your day today?',
	'What did you do this weekend?',
	'Tell me about your hobbies',
	'What are you planning to do tomorrow?',
	'Have you watched any good movies lately?',
	'What kind of music do you like?',
	'Tell me about your favorite food',
	'What do you like to do in your free time?',
	'Have you traveled anywhere interesting recently?',
	'What are you looking forward to this week?'
];

function getRandomPrompts(count: number): string[] {
	const shuffled = [...CONVERSATION_PROMPTS].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, count);
}

export const load: PageServerLoad = async ({ parent, locals: { supabase, safeGetSession } }) => {
	const { user, session } = await safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/login');
	}

	const { profile, langInfo } = await parent();
	if (!profile || !langInfo) {
		throw redirect(303, '/login');
	}

	// Redirect to onboarding if user hasn't completed it yet
	if (!profile.experienced?.includes('onboard')) {
		throw redirect(303, '/onboarding');
	}

	const { data: vocab } = await supabase
		.from('vocabulary')
		.select('*')
		.eq('user_id', user.id)
		.eq('lang', 'ja')
		.lte('due', new Date().toISOString())
		.order('due', { ascending: true })
		.limit(1)
		.maybeSingle();

	let nextVocab: DictEntry | null = null;
	if (vocab) {
		const { data: word } = await supabase
			.from('ja_dict')
			.select('*')
			.eq('id', vocab.word_id)
			.maybeSingle();

		if (word) {
			nextVocab = {
				...word,
				definitions: word.definitions as Definition[],
				vocabulary: vocab
			};
		}
	}

	return {
		email: session.user.email,
		profile: profile,
		prompts: getRandomPrompts(3),
		nextVocab
	};
};

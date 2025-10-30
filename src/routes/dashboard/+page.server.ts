import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		throw redirect(303, '/login');
	}
	const { data: profile } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.limit(1)
		.single();

	return { email: session.user.email, profile: profile, prompts: getRandomPrompts(3) };
};

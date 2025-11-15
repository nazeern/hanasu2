import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Definition, DictEntry } from '$lib/dictionary.svelte';
import logger from '$lib/logger';

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

function calculateDailyStreak(sessionDates: string[]): number {
	if (sessionDates.length === 0) return 0;

	// Extract unique dates (YYYY-MM-DD format) and sort descending
	const uniqueDates = Array.from(
		new Set(sessionDates.map((timestamp) => timestamp.split('T')[0]))
	).sort((a, b) => b.localeCompare(a));

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const todayStr = today.toISOString().split('T')[0];

	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	const yesterdayStr = yesterday.toISOString().split('T')[0];

	// If no session today or yesterday, streak is 0
	if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
		return 0;
	}

	// Count consecutive days
	let streak = 0;
	let currentDate = new Date(today);

	for (const dateStr of uniqueDates) {
		const expectedDateStr = currentDate.toISOString().split('T')[0];

		if (dateStr === expectedDateStr) {
			streak++;
			currentDate.setDate(currentDate.getDate() - 1);
		} else {
			break;
		}
	}

	return streak;
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

	// Query metrics for dashboard
	const [sessionsResult, vocabCountResult, sessionDatesResult] = await Promise.all([
		// Total conversation time
		supabase.from('sessions').select('duration').eq('user_id', user.id).not('duration', 'is', null),

		// Words saved count
		supabase.from('vocabulary').select('*', { count: 'exact', head: true }).eq('user_id', user.id),

		// Session dates for streak calculation
		supabase.from('sessions').select('created_at').eq('user_id', user.id).order('created_at', { ascending: false })
	]);

	// Calculate total conversation time (in milliseconds)
	const totalConversationTime =
		sessionsResult.data?.reduce((sum, s) => sum + (s.duration || 0), 0);

	// Get words saved count
	const wordsSaved = vocabCountResult.count || 0;

	// Calculate daily streak
	const sessionDates = sessionDatesResult.data?.map((s) => s.created_at) || [];
	const currentStreak = calculateDailyStreak(sessionDates);

	logger.info(wordsSaved)
	logger.info(currentStreak)
	logger.info(totalConversationTime)


	return {
		email: session.user.email,
		profile: profile,
		prompts: getRandomPrompts(3),
		nextVocab,
		totalConversationTime,
		wordsSaved,
		currentStreak
	};
};

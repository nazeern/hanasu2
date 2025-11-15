import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Definition, DictEntry } from '$lib/dictionary.svelte';
import { getRandomPrompts, calculateDailyStreak, calculateGoal, secondsToMinutes } from './utils';

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

	// Calculate total conversation time (in seconds)
	const totalConversationTime =
		sessionsResult.data?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0;

	// Get words saved count
	const wordsSaved = vocabCountResult.count || 0;

	// Calculate daily streak
	const sessionDates = sessionDatesResult.data?.map((s) => s.created_at) || [];
	const currentStreak = calculateDailyStreak(sessionDates);

	// Format metrics with goals for client display
	const conversationMinutes = secondsToMinutes(totalConversationTime);
	const metrics = {
		wordsSaved: {
			current: wordsSaved,
			goal: calculateGoal('words_saved', wordsSaved)
		},
		conversationTime: {
			current: conversationMinutes,
			goal: calculateGoal('conversation_minutes', conversationMinutes)
		},
		dailyStreak: {
			current: currentStreak,
			goal: calculateGoal('daily_streak', currentStreak)
		}
	};

	return {
		email: session.user.email,
		profile: profile,
		prompts: getRandomPrompts(3),
		nextVocab,
		metrics
	};
};

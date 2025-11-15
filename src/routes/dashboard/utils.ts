export const CONVERSATION_PROMPTS = [
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

export function getRandomPrompts(count: number): string[] {
	const shuffled = [...CONVERSATION_PROMPTS].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, count);
}

/**
 * Calculate daily streak based on session dates
 * A streak is maintained if there's a session today or yesterday, and counts consecutive days backward
 */
export function calculateDailyStreak(sessionDates: string[]): number {
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

/**
 * Milestone-based goals for different metrics
 * Each array represents achievable milestones in ascending order
 */
const MILESTONES = {
	words_saved: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
	conversation_minutes: [5, 15, 30, 60, 120, 300, 600, 1200],
	daily_streak: [3, 7, 14, 30, 60, 90, 180, 365, 500, 1000]
} as const;

export type MetricType = keyof typeof MILESTONES;

/**
 * Calculate the next achievable goal based on current progress
 * Returns the next milestone that is greater than the current value
 * If current exceeds all milestones, returns current + reasonable increment
 */
export function calculateGoal(metricType: MetricType, current: number): number {
	const milestones = MILESTONES[metricType];

	// Find the first milestone greater than current
	const nextMilestone = milestones.find((milestone) => milestone > current);

	if (nextMilestone !== undefined) {
		return nextMilestone;
	}

	// If current exceeds all milestones, return a reasonable next goal
	const lastMilestone = milestones[milestones.length - 1];
	const increment = Math.ceil(lastMilestone * 0.2); // 20% increment
	return current + increment;
}

/**
 * Convert seconds to minutes, rounded to nearest integer
 */
export function secondsToMinutes(seconds: number): number {
	return Math.round(seconds / 60);
}

const DEFAULT_PROMPTS = [
	'How was your day today?',
	'What did you do this weekend?',
	'Tell me about your hobbies',
	'What are you planning to do tomorrow?',
	'Have you watched any good movies lately?',
	'What kind of music do you like?',
	'Tell me about your favorite food',
	'What do you like to do in your free time?',
	'Have you traveled anywhere interesting recently?',
	'What are you looking forward to this week?',
	'What\'s your favorite season and why?',
	'Tell me about a book you read recently',
	'What did you do last night?',
	'What are your plans for the holidays?',
	'How do you usually celebrate your birthday?',
	'What makes you happy?',
	'Tell me about your best friend',
	'What\'s something new you learned recently?',
	'What do you do when you\'re bored?',
	'Tell me about your hometown',
	'What\'s your favorite memory from childhood?',
	'How do you stay healthy?',
	'What\'s something you\'re proud of?',
	'Tell me about your favorite place to visit',
	'What are you stressed about lately?',
	'How do you like to celebrate special occasions?',
	'What\'s your morning routine like?',
	'Tell me about something that made you laugh recently',
	'What are you grateful for today?',
	'What\'s your favorite way to exercise?'
];

const DAILY_LIFE_PROMPTS = [
	'How was your day today?',
	'What did you have for breakfast?',
	'Tell me about your daily routine',
	'What do you usually do on weekends?',
	'How do you commute to work or school?',
	'What chores do you need to do today?',
	'Tell me about your family',
	'What are you cooking for dinner?',
	'How do you relax after a long day?',
	'What time do you usually wake up?',
	'Tell me about your neighborhood',
	'What\'s your favorite way to spend free time?',
	'How often do you exercise?',
	'What\'s your favorite home-cooked meal?',
	'Tell me about your morning coffee or tea routine',
	'How do you do your grocery shopping?',
	'What\'s your bedtime routine like?',
	'Tell me about your pets if you have any',
	'How do you keep your home organized?',
	'What apps do you use most on your phone?',
	'Tell me about your favorite local restaurant',
	'How do you spend time with your family?',
	'What household task do you dislike the most?',
	'Tell me about a typical Tuesday for you',
	'How do you prepare for the week ahead?',
	'What\'s your favorite room in your house?',
	'Tell me about your sleep schedule',
	'How do you handle stress at home?',
	'What\'s your favorite thing about where you live?',
	'Tell me about your daily commute experience'
];

const TRAVEL_PROMPTS = [
	'Where would you like to travel in Japan?',
	'Tell me about your dream trip to Japan',
	'What Japanese cities interest you most?',
	'What kind of food do you want to try in Japan?',
	'Are you interested in visiting temples and shrines?',
	'Would you prefer staying in a hotel or ryokan?',
	'What souvenirs would you like to buy?',
	'How do you plan to get around in Japan?',
	'What season do you want to visit Japan?',
	'Tell me about Japanese places you\'ve seen in photos',
	'What activities do you want to do in Japan?',
	'Are you interested in visiting rural areas or big cities?',
	'Have you been to Japan before?',
	'What do you know about Tokyo?',
	'Would you like to visit Mount Fuji?',
	'Are you interested in Japanese hot springs (onsen)?',
	'What Japanese festivals would you like to see?',
	'Tell me about your ideal itinerary for Japan',
	'Would you travel alone or with friends?',
	'What concerns do you have about traveling to Japan?',
	'Have you tried planning a trip using Japanese websites?',
	'What do you want to know about Japanese trains?',
	'Are you interested in staying at a capsule hotel?',
	'Tell me about Japanese souvenirs you want to buy',
	'What prefecture interests you besides Tokyo?',
	'Would you like to visit Kyoto or Osaka?',
	'Are you interested in hiking in Japan?',
	'What Japanese street food do you want to try?',
	'Tell me about any Japanese friends you want to visit',
	'How long would you like to stay in Japan?',
	'What\'s your budget for a Japan trip?'
];

const WORK_PROMPTS = [
	'Tell me about your job',
	'What does your typical workday look like?',
	'How do you handle difficult clients or customers?',
	'What are your career goals?',
	'Tell me about a recent work project',
	'How do you prepare for important meetings?',
	'What\'s the most challenging part of your job?',
	'How do you stay organized at work?',
	'Tell me about your workplace culture',
	'What skills are you trying to improve professionally?',
	'How do you communicate with international colleagues?',
	'What business etiquette is important in your field?',
	'Tell me about your team at work',
	'How do you handle work deadlines?',
	'What tools or software do you use daily?',
	'Tell me about your office environment',
	'How do you balance work and personal life?',
	'What do you like most about your job?',
	'Tell me about a challenging work situation you overcame',
	'How do you handle disagreements with coworkers?',
	'What\'s your leadership style?',
	'Tell me about your professional development plans',
	'How do you give presentations at work?',
	'What industry do you work in?',
	'Tell me about your work from home experience',
	'How do you network professionally?',
	'What\'s your approach to email communication?',
	'Tell me about performance reviews at your company',
	'How do you mentor junior colleagues?',
	'What business trips have you taken?',
	'Tell me about your company\'s values'
];

const CULTURE_PROMPTS = [
	'What anime are you watching right now?',
	'Tell me about your favorite manga',
	'What Japanese music do you listen to?',
	'Are you interested in Japanese festivals?',
	'What do you know about Japanese traditional arts?',
	'Tell me about your favorite Japanese game',
	'What Japanese movies have you seen?',
	'Are you interested in Japanese fashion?',
	'What aspects of Japanese culture fascinate you?',
	'Tell me about a Japanese tradition you find interesting',
	'What Japanese food would you like to learn to make?',
	'Are you interested in learning about Japanese history?',
	'What\'s your favorite Studio Ghibli film?',
	'Tell me about Japanese video games you\'ve played',
	'Are you interested in Japanese martial arts?',
	'What do you know about Japanese tea ceremony?',
	'Tell me about your favorite anime character',
	'What Japanese bands or artists do you follow?',
	'Are you interested in cosplay?',
	'Tell me about Japanese YouTube channels you watch',
	'What do you know about Japanese calligraphy?',
	'Are you interested in Japanese pottery or ceramics?',
	'Tell me about Japanese seasonal celebrations',
	'What Japanese light novels have you read?',
	'Are you interested in kabuki or noh theater?',
	'Tell me about Japanese street fashion trends',
	'What Japanese art styles do you like?',
	'Are you interested in Japanese gardens?',
	'Tell me about your favorite Japanese voice actor',
	'What do you know about sumo wrestling?',
	'Are you interested in Japanese folklore or mythology?'
];

const PROMPTS_BY_GOAL = {
	'daily_life': DAILY_LIFE_PROMPTS,
	'travel': TRAVEL_PROMPTS,
	'work': WORK_PROMPTS,
	'culture': CULTURE_PROMPTS
} as const;

export function getRandomPrompts(count: number, learningGoal?: string | null): string[] {
	// If no learning goal, use only default prompts
	if (!learningGoal || !(learningGoal in PROMPTS_BY_GOAL)) {
		const shuffled = [...DEFAULT_PROMPTS].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, count);
	}

	// Create a weighted pool that favors the user's goal but includes variety
	const goalPrompts = PROMPTS_BY_GOAL[learningGoal as keyof typeof PROMPTS_BY_GOAL];
	const otherGoals = Object.entries(PROMPTS_BY_GOAL).filter(([key]) => key !== learningGoal);

	// Build prompt pool with weighting:
	// - 60% from user's specific goal
	// - 25% from default prompts
	// - 15% from other goal categories (5% each)
	const pool: string[] = [];

	// Add goal-specific prompts (60% - pick 12 random)
	const shuffledGoalPrompts = [...goalPrompts].sort(() => Math.random() - 0.5);
	pool.push(...shuffledGoalPrompts.slice(0, 12));

	// Add default prompts (25% - pick 5 random)
	const shuffledDefaultPrompts = [...DEFAULT_PROMPTS].sort(() => Math.random() - 0.5);
	pool.push(...shuffledDefaultPrompts.slice(0, 5));

	// Add prompts from other categories (15% - pick 1 from each other category)
	otherGoals.forEach(([_, prompts]) => {
		const shuffledOtherPrompts = [...prompts].sort(() => Math.random() - 0.5);
		pool.push(shuffledOtherPrompts[0]);
	});

	// Shuffle the combined pool and return requested count
	const finalShuffled = pool.sort(() => Math.random() - 0.5);
	return finalShuffled.slice(0, count);
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

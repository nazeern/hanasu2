/**
 * Agent instruction templates for different proficiency levels
 * These control the natural speech pacing of the AI agent
 */

export const BASE_INSTRUCTIONS = 'You are a friendly language tutor having a natural practice conversation with a learner. Chat casually like you would with a friend who is learning the language. Focus on keeping the conversation flowing naturally.';

export const BEGINNER_PACING_INSTRUCTIONS = `
Speak slowly and clearly since they're still learning. Pause naturally between sentences and phrases. Enunciate carefully without rushing, using a calm, measured pace throughout. Take your time with each word.
`;

export const INTERMEDIATE_PACING_INSTRUCTIONS = `
Speak at a moderate pace suitable for their intermediate level. Pause briefly between sentences and maintain clear pronunciation.
`;

export const RESPONSE_LENGTH_INSTRUCTIONS = `
Keep your responses to 1-2 sentences maximum. Be concise and focused in your replies so the learner gets more opportunities to practice speaking.
`;

/**
 * Get agent instructions based on user proficiency level
 */
export function getAgentInstructions(proficiency: string): string {
	let instructions = BASE_INSTRUCTIONS;

	// Add response length constraints (applies to all proficiency levels)
	instructions += RESPONSE_LENGTH_INSTRUCTIONS;

	if (proficiency === 'beginner') {
		instructions += BEGINNER_PACING_INSTRUCTIONS;
	} else if (proficiency === 'intermediate') {
		instructions += INTERMEDIATE_PACING_INSTRUCTIONS;
	}

	return instructions;
}

/**
 * Sample chat messages for testing and demo purposes
 */
export const SAMPLE_MESSAGES = [
	{
		text: 'こんにちは',
		from: 'agent' as const,
		id: 'test-message-1',
		translationLoading: false,
		status: 'completed' as const,
		tipsLoading: false,
		tokensLoading: false
	},
	{
		text: 'よろしくお願う',
		from: 'user' as const,
		id: 'test-message-2',
		translationLoading: false,
		status: 'completed' as const,
		tipsLoading: false,
		tokensLoading: false
	},
	{
		text: '今日はいい天気ですね',
		from: 'agent' as const,
		id: 'test-message-3',
		translationLoading: false,
		status: 'completed' as const,
		tipsLoading: false,
		tokensLoading: false
	},
	{
		text: '本当に！散歩に行きたいです',
		from: 'user' as const,
		id: 'test-message-4',
		translationLoading: false,
		status: 'completed' as const,
		tipsLoading: false,
		tokensLoading: false
	},
	{
		text: 'いいですね。公園に行きますか',
		from: 'agent' as const,
		id: 'test-message-5',
		translationLoading: false,
		status: 'completed' as const,
		tipsLoading: false,
		tokensLoading: false
	},
	{
		text: 'はい、行きましょう',
		from: 'user' as const,
		id: 'test-message-6',
		translationLoading: false,
		status: 'completed' as const,
		tipsLoading: false,
		tokensLoading: false
	},
	{
		text: '何時に出発しますか',
		from: 'agent' as const,
		id: 'test-message-7',
		translationLoading: false,
		status: 'completed' as const,
		tipsLoading: false,
		tokensLoading: false
	},
	{
		text: '二時はどうですか',
		from: 'user' as const,
		id: 'test-message-8',
		translationLoading: false,
		status: 'completed' as const,
		tipsLoading: false,
		tokensLoading: false
	}
];

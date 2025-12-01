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

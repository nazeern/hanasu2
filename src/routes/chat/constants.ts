/**
 * Agent instruction templates for different proficiency levels
 * These control the natural speech pacing of the AI agent
 */

export const BASE_INSTRUCTIONS = 'You are a helpful assistant.';

export const BEGINNER_PACING_INSTRUCTIONS = `

## Speech Pacing
- Speak slowly and clearly for a beginner language learner.
- Pause naturally between sentences and phrases.
- Enunciate carefully without rushing.
- Use a calm, measured pace throughout the conversation.
- Take your time with each word.`;

export const INTERMEDIATE_PACING_INSTRUCTIONS = `

## Speech Pacing
- Speak at a moderate pace suitable for an intermediate learner.
- Pause briefly between sentences.
- Maintain clear pronunciation.`;

/**
 * Get agent instructions based on user proficiency level
 */
export function getAgentInstructions(proficiency: string): string {
	let instructions = BASE_INSTRUCTIONS;

	if (proficiency === 'beginner') {
		instructions += BEGINNER_PACING_INSTRUCTIONS;
	} else if (proficiency === 'intermediate') {
		instructions += INTERMEDIATE_PACING_INSTRUCTIONS;
	}

	return instructions;
}

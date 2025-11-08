export interface GoalOption {
	id: string;
	label: string;
	description: string;
}

export interface ProficiencyLevel {
	id: string;
	label: string;
	description: string;
}

export const goals: GoalOption[] = [
	{ id: 'daily-life', label: 'Daily Life', description: 'Chat about everyday topics' },
	{ id: 'travel', label: 'Travel to Japan', description: 'Prepare for your trip' },
	{ id: 'work', label: 'Work/Business', description: 'Professional Japanese' },
	{ id: 'culture', label: 'Love Japanese Culture', description: 'Anime, manga, and more' }
];

export const proficiencyLevels: ProficiencyLevel[] = [
	{
		id: 'beginner',
		label: 'Beginner',
		description: 'I know hiragana/katakana or just starting'
	},
	{
		id: 'intermediate',
		label: 'Intermediate',
		description: 'I can have basic conversations'
	},
	{ id: 'advanced', label: 'Advanced', description: "I'm working on fluency" }
];

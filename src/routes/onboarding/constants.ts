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
	{ id: 'daily_life', label: 'Daily Life', description: 'Chat about everyday topics' },
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

export type PracticeFrequency = 'daily' | '3x_weekly' | 'weekly' | 'never';

export interface PracticeFrequencyOption {
	id: PracticeFrequency;
	label: string;
	description: string;
}

export const practiceFrequencyOptions: PracticeFrequencyOption[] = [
	{ id: 'daily', label: 'Daily', description: 'Practice every day' },
	{ id: '3x_weekly', label: '3x per week', description: 'Monday, Wednesday, Friday' },
	{ id: 'weekly', label: 'Weekly', description: 'Once a week' },
	{ id: 'never', label: 'Never', description: 'I just want to explore' }
];

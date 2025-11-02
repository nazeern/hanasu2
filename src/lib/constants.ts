export interface LangInfo {
	code: string;
	displayName: string;
	emoji: string;
}

export const langInfoList: LangInfo[] = [
	{
		code: 'ja',
		displayName: 'Japanese',
		emoji: '🇯🇵'
	},
];

export interface TagInfo {
	code: string;
	displayName: string;
	desc: string;
	color: string;
}

export const ja_tags: TagInfo[] = [
	{
		code: 'ichi1',
		displayName: 'top 10k',
		desc: 'Appears in the “Ichimango goi bunruishuu”, a collection of 10,000 common Japanese words.',
		color: 'bg-primary-600',
	},
	{
		code: 'ichi2',
		displayName: 'top 10k (less common)',
		desc: 'Appears in the “Ichimango goi bunruishuu”, a collection of 10,000 common Japanese words. This word is less common.',
		color: 'bg-neutral-600',
	},
	{
		code: 'news1',
		displayName: 'news',
		desc: 'Appears in the “Mainichi Shimbun”, a collection of 12,000 common Japanese words found within newspapers.',
		color: 'bg-primary-600',
	},
	{
		code: 'news2',
		displayName: 'news (uncommon)',
		desc: 'Appears in the “Mainichi Shimbun”, a collection of common Japanese words found within newspapers. This word is not within the 12,000 most common.',
		color: 'bg-neutral-600',
	},
	{
		code: 'spec1',
		displayName: 'common',
		desc: 'A common word not included in other lists.',
		color: 'bg-primary-600',
	},
	{
		code: 'spec2',
		displayName: 'common',
		desc: 'A common word not included in other lists.',
		color: 'bg-neutral-600',
	},
	{
		code: 'gai1',
		displayName: 'loanword',
		desc: 'A common loanword.',
		color: 'bg-primary-600',
	},
	{
		code: 'gai2',
		displayName: 'loanword',
		desc: 'A common loanword.',
		color: 'bg-primary-600',
	},
]

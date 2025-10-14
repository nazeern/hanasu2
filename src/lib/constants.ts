export interface LangInfo {
	code: string;
	displayName: string;
	emoji: string;
}

const langInfoList: LangInfo[] = [
	{
		code: 'jp',
		displayName: 'Japanese',
		emoji: '🇯🇵'
	},
	{
		code: 'zh-CN',
		displayName: 'Chinese',
		emoji: '🇨🇳'
	}
];

export default langInfoList;

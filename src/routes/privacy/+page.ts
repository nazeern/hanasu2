import { marked } from 'marked';
import type { PageLoad } from './$types';
import privacyMd from '$lib/content/privacy.md?raw';

export const load: PageLoad = async () => {
	const html = await marked(privacyMd);

	return {
		content: html
	};
};

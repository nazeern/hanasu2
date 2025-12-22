import { marked } from 'marked';
import type { PageLoad } from './$types';
import termsMd from '$lib/content/terms.md?raw';

export const load: PageLoad = async () => {
	const html = await marked(termsMd);

	return {
		content: html
	};
};

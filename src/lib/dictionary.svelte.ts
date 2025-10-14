import logger from '$lib/logger';

export type Definition = {
	tags: string[];
	meanings: string[];
	see_also: string;
	example_en: string;
	example_ja: string;
	parts_of_speech: string[];
};

export type DictEntry = {
	id: number;
	word: string;
	featured: string[];
	readings: string[];
	definitions: Definition[];
};

export type WordLookup = {
	loading: boolean;
	word?: string;
	entries?: DictEntry[];
};

export class Dictionary {

	lookup = $state<WordLookup | null>(null);

	async lookupWord(sentence: string, tapIndex: number): Promise<void> {
		// Set loading state
		this.lookup = {
			loading: true
		};

		try {
			const response = await fetch('/chat/lookup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					sentence,
					tapIndex
				})
			});

			if (!response.ok) {
				throw new Error('Word lookup API request failed');
			}

			const result = await response.json();

			// Update state with full lookup result
			this.lookup = {
				word: result.word,
				entries: result.definitions,
				loading: false
			};
		} catch (error) {
			logger.error('Word lookup failed', error);
			this.lookup = null;
		}
	}

	clear(): void {
		this.lookup = null;
	}
}

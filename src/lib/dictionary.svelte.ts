import logger from '$lib/logger';
import type { Tables } from '../database.types';

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
	vocabulary: Tables<'vocabulary'> | null;
};

export type WordLookup = {
	loading: boolean;
	word?: string;
	entries?: DictEntry[];
};

export class Dictionary {
	langCode: string;
	lookup = $state<WordLookup | null>(null);

	constructor(langCode: string) {
		this.langCode = langCode;
	}

	async lookupWord(sentence: string, tapIndex: number): Promise<void> {
		this.lookup = { loading: true };

		try {
			const response = await fetch('/chat/lookup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					sentence,
					tapIndex,
					lang: this.langCode
				})
			});

			if (!response.ok) {
				throw new Error('Word lookup API request failed');
			}

			const result = await response.json();

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

	async toggleSave(wordId: number): Promise<void> {
		const entry = this.lookup?.entries?.find((e) => e.id === wordId);
		if (!entry) return;

		const isSaved = !!entry.vocabulary;
		const response = await fetch('/vocabulary', {
			method: isSaved ? 'DELETE' : 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ word_id: wordId, lang: this.langCode })
		});

		if (!response.ok) {
			const action = isSaved ? 'unsave' : 'save';
			logger.error(`Failed to ${action} word`);
			throw new Error(`Failed to ${action} word`);
		}

		if (isSaved) {
			entry.vocabulary = null;
		} else {
			const result = await response.json();
			entry.vocabulary = result.vocabulary;
		}

		logger.info(`Word ${wordId} ${isSaved ? 'removed from' : 'saved to'} vocabulary`);
	}
}

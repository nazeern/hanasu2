import logger from '$lib/logger';
import type { Tables } from '../database.types';
import type { ParsedWord } from '../routes/chat/kuromoji-parser';

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
	jlpt_level: string | null;
	vocabulary: Tables<'vocabulary'> | null;
};

export class Dictionary {
	langCode: string;
	loading = $state<boolean>(false);
	word = $state<string>('');
	vocab = $state<DictEntry[]>([]);
	savingWordId = $state<number | null>(null);

	constructor(langCode: string) {
		this.langCode = langCode;
	}

	async lookupWord(parsedWord: ParsedWord): Promise<void> {
		this.loading = true;

		try {
			const response = await fetch('/chat/lookup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					parsedWord,
					lang: this.langCode
				})
			});

			if (!response.ok) {
				throw new Error('Word lookup API request failed');
			}

			const result = await response.json();

			this.word = result.word;
			this.vocab = result.definitions;
			this.loading = false;
		} catch (error) {
			logger.error('Word lookup failed', error);
			this.loading = false;
			this.word = '';
			this.vocab = [];
		}
	}

	clear(): void {
		this.loading = false;
		this.word = '';
		this.vocab = [];
		this.savingWordId = null;
	}

	async toggleSave(wordId: number): Promise<void> {
		const entry = this.vocab.find((e) => e.id === wordId);
		if (!entry) return;

		this.savingWordId = wordId;

		try {
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
		} finally {
			this.savingWordId = null;
		}
	}
}

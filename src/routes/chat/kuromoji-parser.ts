import kuromoji from 'kuromoji';
import type { IpadicFeatures, Tokenizer } from 'kuromoji';
import logger from '$lib/logger';
import { dev } from '$app/environment';
import { join } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';

export type ParsedWord = {
	surfaceForm: string;
	baseForm: string;
	partOfSpeech: string;
	reading: string | undefined;
	pronunciation: string | undefined;
};

let tokenizerInstance: Tokenizer<IpadicFeatures> | null = null;
let tokenizerPromise: Promise<Tokenizer<IpadicFeatures>> | null = null;

/**
 * Initializes the kuromoji tokenizer.
 * The tokenizer is cached after the first initialization.
 */
function getTokenizer(): Promise<Tokenizer<IpadicFeatures>> {
	if (tokenizerInstance) {
		return Promise.resolve(tokenizerInstance);
	}

	if (tokenizerPromise) {
		return tokenizerPromise;
	}

	tokenizerPromise = new Promise((resolve, reject) => {
		const dicPath = dev
			? 'node_modules/kuromoji/dict'
			: join(process.cwd(), 'node_modules/kuromoji/dict');

		// Signal to Node File Trace to bundle dictionary files
		if (existsSync(dicPath)) {
			const files = readdirSync(dicPath);
			files.forEach((file) => {
				const filePath = join(dicPath, file);
				statSync(filePath);
			});
		}

		logger.info(`Initializing kuromoji tokenizer with dicPath: ${dicPath}`);

		kuromoji.builder({ dicPath }).build((err, tokenizer) => {
			if (err || !tokenizer) {
				logger.error('Failed to initialize kuromoji tokenizer', err);
				tokenizerPromise = null;
				reject(err || new Error('Tokenizer initialization failed'));
				return;
			}

			tokenizerInstance = tokenizer;
			logger.info('Kuromoji tokenizer initialized successfully');
			resolve(tokenizer);
		});
	});

	return tokenizerPromise;
}

/**
 * Parses the word at the given character index in the sentence.
 * Returns detailed linguistic information about the word.
 *
 * @param sentence - The full sentence to parse
 * @param charIndex - The character index where the user tapped
 * @returns ParsedWord object with linguistic details, or null if no word found
 */
export async function parseWordAtIndex(
	sentence: string,
	charIndex: number
): Promise<ParsedWord | null> {
	try {
		const tokenizer = await getTokenizer();
		const tokens = tokenizer.tokenize(sentence);

		let currentIndex = 0;

		for (const token of tokens) {
			const tokenLength = token.surface_form.length;

			if (charIndex >= currentIndex && charIndex < currentIndex + tokenLength) {
				return {
					surfaceForm: token.surface_form,
					baseForm: token.basic_form,
					partOfSpeech: token.pos,
					reading: token.reading,
					pronunciation: token.pronunciation
				};
			}

			currentIndex += tokenLength;
		}

		return null;
	} catch (error) {
		logger.error('Error parsing word', error);
		throw error;
	}
}

/**
 * Tokenizes an entire sentence and returns all words with their linguistic information.
 *
 * @param sentence - The sentence to tokenize
 * @returns Array of ParsedWord objects for each token in the sentence
 */
export async function tokenizeSentence(sentence: string): Promise<ParsedWord[]> {
	try {
		const tokenizer = await getTokenizer();
		const tokens = tokenizer.tokenize(sentence);

		return tokens.map((token) => ({
			surfaceForm: token.surface_form,
			baseForm: token.basic_form,
			partOfSpeech: token.pos,
			reading: token.reading,
			pronunciation: token.pronunciation
		}));
	} catch (error) {
		logger.error('Error tokenizing sentence', error);
		throw error;
	}
}

/**
 * Resets the tokenizer cache. Useful for testing or if dictionary needs to be reloaded.
 */
export function resetTokenizer(): void {
	tokenizerInstance = null;
	tokenizerPromise = null;
}

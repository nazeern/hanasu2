import kuromoji from 'kuromoji';
import type { IpadicFeatures, Tokenizer } from 'kuromoji';
import logger from '$lib/logger';

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
 * Initializes the kuromoji tokenizer. This is called automatically by parseWordAtIndex.
 * The tokenizer is cached after the first initialization for performance.
 */
function getTokenizer(): Promise<Tokenizer<IpadicFeatures>> {
	if (tokenizerInstance) {
		return Promise.resolve(tokenizerInstance);
	}

	if (tokenizerPromise) {
		return tokenizerPromise;
	}

	tokenizerPromise = new Promise((resolve, reject) => {
		// In development, use node_modules path; in production, use static/dict
		const dicPath = process.env.NODE_ENV === 'production'
			? '/dict'
			: 'node_modules/kuromoji/dict';

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

		logger.info(`Tokenizing sentence: "${sentence}" at index ${charIndex}`);
		logger.info(`Found ${tokens.length} tokens`);

		let currentIndex = 0;

		for (const token of tokens) {
			const tokenLength = token.surface_form.length;

			if (charIndex >= currentIndex && charIndex < currentIndex + tokenLength) {
				const parsedWord: ParsedWord = {
					surfaceForm: token.surface_form,
					baseForm: token.basic_form,
					partOfSpeech: token.pos,
					reading: token.reading,
					pronunciation: token.pronunciation
				};

				logger.info('Found word at index', {
					charIndex,
					parsedWord
				});

				return parsedWord;
			}

			currentIndex += tokenLength;
		}

		logger.warn(`No word found at index ${charIndex} in sentence "${sentence}"`);
		return null;
	} catch (error) {
		logger.error('Error parsing word', error);
		throw error;
	}
}

/**
 * Resets the tokenizer cache. Useful for testing or if dictionary needs to be reloaded.
 */
export function resetTokenizer(): void {
	tokenizerInstance = null;
	tokenizerPromise = null;
	logger.info('Tokenizer cache reset');
}

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
		// Use absolute path to node_modules/kuromoji/dict
		// Vercel's Node File Trace will bundle these files automatically
		const dicPath = dev
			? 'node_modules/kuromoji/dict'
			: join(process.cwd(), 'node_modules/kuromoji/dict');

		// Comprehensive logging for debugging
		logger.info('=== Kuromoji Initialization Debug Info ===');
		logger.info({
			environment: dev ? 'development' : 'production',
			dicPath,
			cwd: process.cwd(),
			platform: process.platform,
			nodeVersion: process.version
		});

		// Check if path exists
		const pathExists = existsSync(dicPath);
		logger.info({ dicPath, pathExists });

		if (pathExists) {
			try {
				const files = readdirSync(dicPath);
				logger.info({ dicPath, fileCount: files.length, files });

				// Log file sizes
				const fileDetails = files.map((file) => {
					try {
						const filePath = join(dicPath, file);
						const stats = statSync(filePath);
						return { file, size: stats.size, isFile: stats.isFile() };
					} catch (err) {
						return { file, error: String(err) };
					}
				});
				logger.info({ dicPath, fileDetails });
			} catch (err) {
				logger.error('Failed to read dicPath directory', {
					dicPath,
					error: err instanceof Error ? err.message : String(err),
					stack: err instanceof Error ? err.stack : undefined
				});
			}
		} else {
			logger.error('Dictionary path does not exist', { dicPath });

			// Try to find where kuromoji might be installed
			const possiblePaths = [
				join(process.cwd(), 'node_modules', 'kuromoji', 'dict'),
				join(process.cwd(), '.svelte-kit', 'output', 'server', 'node_modules', 'kuromoji', 'dict'),
				'node_modules/kuromoji/dict',
				'/var/task/node_modules/kuromoji/dict'
			];

			logger.info('Checking possible dictionary locations:');
			possiblePaths.forEach((path) => {
				const exists = existsSync(path);
				logger.info({ path, exists });
				if (exists) {
					try {
						const files = readdirSync(path);
						logger.info({ path, fileCount: files.length });
					} catch (err) {
						logger.error({ path, error: String(err) });
					}
				}
			});
		}

		logger.info(`Attempting to build kuromoji tokenizer with dicPath: ${dicPath}`);

		kuromoji.builder({ dicPath }).build((err, tokenizer) => {
			if (err || !tokenizer) {
				logger.error('Failed to initialize kuromoji tokenizer', {
					dicPath,
					errorMessage: err instanceof Error ? err.message : String(err),
					errorStack: err instanceof Error ? err.stack : undefined,
					errorType: err ? err.constructor.name : 'unknown',
					fullError: err
				});
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
		logger.info('parseWordAtIndex called', { sentence, charIndex });
		const tokenizer = await getTokenizer();
		logger.info('Tokenizer retrieved successfully');
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
		logger.error('Error parsing word', {
			sentence,
			charIndex,
			errorMessage: error instanceof Error ? error.message : String(error),
			errorStack: error instanceof Error ? error.stack : undefined,
			errorType: error ? error.constructor.name : 'unknown'
		});
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
		logger.info('tokenizeSentence called', { sentence });
		const tokenizer = await getTokenizer();
		logger.info('Tokenizer retrieved successfully');
		const tokens = tokenizer.tokenize(sentence);

		logger.info(`Tokenizing full sentence: "${sentence}" - found ${tokens.length} tokens`);

		return tokens.map((token) => ({
			surfaceForm: token.surface_form,
			baseForm: token.basic_form,
			partOfSpeech: token.pos,
			reading: token.reading,
			pronunciation: token.pronunciation
		}));
	} catch (error) {
		logger.error('Error tokenizing sentence', {
			sentence,
			errorMessage: error instanceof Error ? error.message : String(error),
			errorStack: error instanceof Error ? error.stack : undefined,
			errorType: error ? error.constructor.name : 'unknown'
		});
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

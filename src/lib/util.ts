import { readdirSync } from 'fs';

export function isString(value: any): value is string {
	return typeof value === 'string';
}

/**
 * Signals to Node File Trace that files at the given path should be included in the bundle.
 * Uses readdirSync to provide a strong signal to the bundler's static analysis.
 *
 * @param path - The directory path to include (relative or absolute)
 */
export function ensureFilesIncluded(path: string): void {
	try {
		// Reading directory contents signals to Node File Trace that these files are needed
		readdirSync(path);
	} catch {
		// Ignore errors - this is just a bundler hint
	}
}

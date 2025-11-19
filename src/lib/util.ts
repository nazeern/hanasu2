import { existsSync } from 'fs';

export function isString(value: any): value is string {
	return typeof value === 'string';
}

/**
 * Signals to Node File Trace that files at the given path should be included in the bundle.
 * This function performs a filesystem check that the bundler's static analysis detects,
 * ensuring the specified files are included in serverless deployments.
 *
 * @param path - The path to check (relative or absolute)
 * @returns Whether the path exists
 */
export function ensureFilesIncluded(path: string): boolean {
	return existsSync(path);
}

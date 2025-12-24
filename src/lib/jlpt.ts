import type { DictEntry } from './dictionary.svelte';

/**
 * Get JLPT level priority for sorting
 * Lower number = higher priority (shown first)
 */
function getJlptPriority(jlptLevel: string | null): number {
	if (!jlptLevel) return 6; // No JLPT level = lowest priority

	const priorities: Record<string, number> = {
		'N5': 1,
		'N4': 2,
		'N3': 3,
		'N2': 4,
		'N1': 5
	};

	return priorities[jlptLevel] ?? 6;
}

/**
 * Sort dictionary entries by JLPT level
 * - Words with JLPT tags come first
 * - Among JLPT words: N5, N4, N3, N2, N1
 * - Words without JLPT tags come last
 */
export function sortByJlptLevel<T extends { jlpt_level: string | null }>(entries: T[]): T[] {
	return [...entries].sort((a, b) => {
		const priorityA = getJlptPriority(a.jlpt_level);
		const priorityB = getJlptPriority(b.jlpt_level);
		return priorityA - priorityB;
	});
}

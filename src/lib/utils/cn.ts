import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes intelligently, handling conflicts and conditionals.
 *
 * Uses clsx for conditional class names and tailwind-merge to resolve conflicts.
 * When the same Tailwind property is specified multiple times, the last one wins.
 *
 * @example
 * cn('px-4 py-2', 'px-6') // => 'py-2 px-6' (px-6 overrides px-4)
 * cn('text-red-500', condition && 'text-blue-500') // => 'text-blue-500' if condition is true
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Shared style constants and variant definitions.
 * Import these to maintain consistency across components.
 *
 * All colors reference the centralized theme in src/app.css
 */

// Button variants - using theme colors
export const buttonVariants = {
	primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-2 focus:ring-primary-500',
	secondary: 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900 focus:ring-2 focus:ring-neutral-400',
	ghost: 'hover:bg-neutral-100 text-neutral-700 focus:ring-2 focus:ring-neutral-300',
	danger: 'bg-danger-600 hover:bg-danger-700 text-white focus:ring-2 focus:ring-danger-500',
	menu: 'hover:bg-neutral-100 text-text-secondary focus:ring-2 focus:ring-primary-500'
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

// Button sizes
export const buttonSizes = {
	sm: 'px-3 py-1.5 text-sm',
	md: 'px-4 py-2 text-base',
	lg: 'px-6 py-3 text-lg'
} as const;

export type ButtonSize = keyof typeof buttonSizes;

// Badge variants - using theme colors
export const badgeVariants = {
	default: 'bg-neutral-100 text-neutral-800',
	success: 'bg-success-100 text-success-800',
	warning: 'bg-warning-100 text-warning-800',
	danger: 'bg-danger-100 text-danger-800',
	info: 'bg-primary-100 text-primary-800'
} as const;

export type BadgeVariant = keyof typeof badgeVariants;

// Common focus ring styles
export const focusRing = 'focus:outline-none focus:ring-2 focus:ring-offset-2';

// Common transition styles
export const transition = 'transition-colors duration-150';

// Input styles - using theme colors
export const inputBase =
	'w-full rounded-md border border-neutral-300 px-3 py-2 text-base focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500';
export const inputError = 'border-danger-500 focus:border-danger-500 focus:ring-danger-500';

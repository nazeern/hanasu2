/**
 * Shared style constants and variant definitions.
 * Import these to maintain consistency across components.
 *
 * All colors reference the centralized theme in src/app.css
 */

export const buttonVariants = {
	primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-2 focus:ring-primary-500',
	secondary: 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900 focus:ring-2 focus:ring-neutral-400',
	ghost: 'hover:bg-neutral-100 text-neutral-700 focus:ring-2 focus:ring-neutral-300',
	danger: 'bg-danger-600 hover:bg-danger-700 text-white focus:ring-2 focus:ring-danger-500',
	menu: 'hover:bg-neutral-100 text-text-secondary focus:ring-2 focus:ring-primary-500'
} as const;

export type ButtonVariant = keyof typeof buttonVariants;


export const messageVariants = {
	default: '',
	warning: 'text-warning-800 rounded-lg px-2 py-1 bg-warning-100',
	success: 'text-success-800 rounded-lg px-2 py-1 bg-success-100',
}

export type MessageVariant = keyof typeof messageVariants;

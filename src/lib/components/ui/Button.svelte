<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { buttonVariants, buttonSizes, transition, type ButtonVariant, type ButtonSize } from '$lib/utils/styles';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant?: ButtonVariant;
		size?: ButtonSize;
		fullWidth?: boolean;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		fullWidth = false,
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<button
	class={cn(
		'rounded-md font-medium focus:outline-none',
		transition,
		buttonVariants[variant],
		buttonSizes[size],
		fullWidth && 'w-full',
		variant === 'menu' && 'text-left',
		className
	)}
	{...rest}
>
	{@render children?.()}
</button>

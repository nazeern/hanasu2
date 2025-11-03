<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { buttonVariants, type ButtonVariant } from '$lib/utils/styles';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		class?: string;
		children?: Snippet;
		variant: ButtonVariant;
		href?: string;
	}

	let { class: className, children, variant, href, ...rest }: Props = $props();
</script>

{#if href}
	<a {href} class={cn('font-semibold px-2 py-1 rounded-lg', buttonVariants[variant], className)}>
		{@render children?.()}
	</a>
{:else}
	<button
		class={cn('font-semibold px-2 py-1 rounded-lg', buttonVariants[variant], className)}
		{...rest}
	>
		{@render children?.()}
	</button>
{/if}

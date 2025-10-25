<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { buttonVariants, type ButtonVariant } from '$lib/utils/styles';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLButtonElement> {
		class?: string;
		children?: Snippet;
		variant: ButtonVariant;
	}

	let { class: className, children, variant, ...rest }: Props = $props();
</script>

<button class={cn('font-semibold px-2 py-1 rounded-lg', buttonVariants[variant], className)} {...rest}>
	{@render children?.()}
</button>

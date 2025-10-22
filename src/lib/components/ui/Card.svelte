<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<div
	class={cn(
		'rounded-md border border-border bg-background shadow-lg',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>

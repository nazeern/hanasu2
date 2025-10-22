<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		bordered?: boolean;
		children?: Snippet;
	}

	let { bordered = false, class: className, children, ...rest }: Props = $props();
</script>

<div
	class={cn(
		'px-4 py-3',
		bordered && 'border-b border-neutral-100',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>

<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		lines?: number;
		class?: string;
	}

	let { lines = 1, class: className, ...rest }: Props = $props();
</script>

<div class={cn('flex flex-col gap-2', className)} {...rest}>
	{#each { length: lines } as _}
		<div class="h-3 w-full rounded-full bg-neutral-400 animate-pulse"></div>
	{/each}
</div>

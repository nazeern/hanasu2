<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';

	interface Props {
		text: string;
		children: Snippet;
		class?: string;
	}

	let { text, children, class: className = '' }: Props = $props();
	let showTooltip = $state(false);

	function handleClick(e: MouseEvent) {
		e.stopPropagation();
		showTooltip = !showTooltip;
	}

	function handleClickOutside() {
		showTooltip = false;
	}

	$effect(() => {
		if (showTooltip) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<div class={cn('relative', className)}>
	<button
		type="button"
		class="cursor-pointer"
		onclick={handleClick}
		onmouseenter={() => (showTooltip = true)}
		onmouseleave={() => (showTooltip = false)}
	>
		{@render children()}
	</button>

	{#if showTooltip}
		<div
			class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-lg bg-neutral-800 px-3 py-2 text-xs text-white shadow-lg z-10"
		>
			<div class="relative">
				{text}
			</div>
		</div>
	{/if}
</div>

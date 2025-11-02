<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';

	interface Props {
		number: number;
		title: string;
		description: string;
		icon?: Snippet;
		class?: string;
	}

	let { number, title, description, icon, class: className }: Props = $props();
</script>

<div class={cn('flex flex-col items-center text-center max-w-xs', className)}>
	<div class="relative mb-4">
		<div
			class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl"
		>
			{number}
		</div>
		{#if icon}
			<div class="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
				{@render icon()}
			</div>
		{/if}
	</div>
	<h3 class="text-lg font-semibold text-text-primary mb-2">{title}</h3>
	<p class="text-text-secondary text-sm">{description}</p>
</div>

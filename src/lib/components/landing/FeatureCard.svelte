<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		icon?: Snippet;
		class?: string;
	}

	let { title, description, icon, class: className }: Props = $props();
</script>

<Container class={cn('flex flex-col items-start h-full', className)}>
	{#if icon}
		<div class="mb-3 text-primary-600">
			{@render icon()}
		</div>
	{/if}
	<h3 class="text-lg font-semibold text-text-primary mb-2">{title}</h3>
	<p class="text-text-secondary text-sm leading-relaxed">{description}</p>
</Container>

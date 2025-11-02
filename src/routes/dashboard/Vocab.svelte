<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import type { DictEntry } from '$lib/dictionary.svelte';
	import type { StudyState } from '$lib/study.svelte';
	import Definition from './Definition.svelte';
	import Tag from './Tag.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		nextVocab: DictEntry;
		state?: StudyState;
	}

	let { nextVocab, state = 'idle' }: Props = $props();

	const borderClass = $derived(
		state === 'correct'
			? 'border-green-500 border-2'
			: state === 'incorrect'
				? 'border-red-500 border-2'
				: ''
	);
</script>

<Container class={cn('relative w-full flex flex-col items-center mb-4 lg:px-12', borderClass)}>
	<p class="mt-8 mb-4 text-3xl">{nextVocab.word}</p>
	<div class="flex items-center gap-1 mb-1">
		{#each nextVocab.featured as tag}
			<Tag {tag} />
		{/each}
	</div>
	<div class="flex flex-col gap-2">
		{#each nextVocab.definitions as definition, i}
			<Definition {definition} index={i} />
		{/each}
	</div>
</Container>

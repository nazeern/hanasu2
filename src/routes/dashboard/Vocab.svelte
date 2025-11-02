<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import type { DictEntry } from '$lib/dictionary.svelte';
	import Definition from './Definition.svelte';
	import Tag from './Tag.svelte';

	interface Props {
		nextVocab: DictEntry;
	}

	let { nextVocab }: Props = $props();
</script>

<Container class="relative w-full flex flex-col items-center mb-4 lg:px-12">
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

<script lang="ts">
	import type { DictEntry, Dictionary } from '$lib/dictionary.svelte';
	import Definition from '../dashboard/Definition.svelte';
	import Tag from '../dashboard/Tag.svelte';
	import SaveButton from './SaveButton.svelte';

	interface Props {
		entry: DictEntry;
		dictionary: Dictionary;
	}

	let { entry, dictionary }: Props = $props();

	const isSaving = $derived(dictionary.savingWordId === entry.id);
</script>

<div class="border-b border-gray-200 py-4 px-4">
	<div class="flex justify-between items-start mb-3">
		<div>
			<p class="text-2xl font-semibold mb-1">{entry.word}</p>
			{#if entry.readings.length}
				<p class="text-sm text-gray-600">{entry.readings.join(', ')}</p>
			{/if}
		</div>
		<SaveButton
			isSaved={!!entry.vocabulary}
			{isSaving}
			onSave={() => dictionary.toggleSave(entry.id)}
		/>
	</div>

	{#if entry.jlpt_level || entry.featured.length}
		<div class="flex items-center gap-1 mb-3">
			{#if entry.jlpt_level}
				<Tag tag={entry.jlpt_level} />
			{/if}
			{#each entry.featured as tag}
				<Tag {tag} />
			{/each}
		</div>
	{/if}

	<div class="flex flex-col gap-2">
		{#each entry.definitions as definition, i}
			<Definition {definition} index={i} />
		{/each}
	</div>
</div>

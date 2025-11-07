<script lang="ts">
	import type { Dictionary } from '$lib/dictionary.svelte';
	import VocabEntry from './VocabEntry.svelte';
	import DictionaryHeader from './DictionaryHeader.svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		dictionary: Dictionary;
	}

	let { dictionary }: Props = $props();

	const isOpen = $derived(dictionary.loading || !!dictionary.word);
	const entryCount = $derived(dictionary.vocab.length);
	const showContent = $derived(!dictionary.loading && entryCount > 0);
	const showEmpty = $derived(!dictionary.loading && entryCount == 0);
</script>

{#if isOpen}
	<div
		class="fixed inset-0 bg-black/20 z-40 transition-opacity"
		onclick={() => dictionary.clear()}
		onkeydown={(e) => e.key === 'Enter' && dictionary.clear()}
		role="button"
		tabindex="-1"
		aria-label="Close dictionary"
	></div>

	<div
		class={cn(
			'fixed top-0 left-0 right-0 bg-white shadow-lg z-50',
			'max-h-[70vh] rounded-b-2xl flex flex-col',
			isOpen ? 'translate-y-0' : '-translate-y-full'
		)}
	>
		<div class="overflow-y-auto">
			{#if dictionary.loading}
				{#each { length: 2 } as _}
					<div class="border-b border-gray-200 py-4 px-4">
						<Skeleton lines={3} />
					</div>
				{/each}
			{/if}

			{#if showContent}
				<DictionaryHeader word={dictionary.word} {entryCount} onClose={() => dictionary.clear()} />
				{#each dictionary.vocab as entry (entry.id)}
					<VocabEntry {entry} {dictionary} />
				{/each}
			{/if}

			{#if showEmpty}
				<DictionaryHeader word={dictionary.word} {entryCount} onClose={() => dictionary.clear()} />
				<div class="text-center py-12 text-gray-500">
					<p>No dictionary entries found.</p>
				</div>
			{/if}
		</div>
	</div>
{/if}

<script lang="ts">
	import { onMount } from 'svelte';
	import { Chat } from './chat-state.svelte';
	import { Dictionary } from '$lib/dictionary.svelte';
	import ChatMessages from './ChatMessages.svelte';
	import RecordButton from './RecordButton.svelte';

	let { data } = $props();

	const chat = new Chat(data.language, data.testMode, data.prompt);
	const dictionary = new Dictionary(data.language);

	onMount(() => {
		chat.connect(data.ephemeralKey);

		return () => {
			chat.close();
		};
	});
</script>

<div class="h-screen flex flex-col bg-gray-50">
	<ChatMessages {chat} {dictionary} />
	<RecordButton {chat} />
</div>

<!-- Dictionary UI - to be implemented later
{#if dictionary.loading}
	<p>Looking up word...</p>
{:else if dictionary.word}
	<div>
		<p><strong>Word:</strong> {dictionary.word}</p>

		{#if dictionary.vocab.length}
			<p><strong>Dictionary Entries ({dictionary.vocab.length}):</strong></p>
			{#each dictionary.vocab as entry}
				<div>
					<p><strong>Headword:</strong> {entry.word}</p>
					<button
						onclick={() => dictionary.toggleSave(entry.id)}
						disabled={dictionary.savingWordId === entry.id}
					>
						{#if dictionary.savingWordId === entry.id}
							{entry.vocabulary ? 'Removing...' : 'Saving...'}
						{:else}
							{entry.vocabulary ? 'Remove from Vocabulary' : 'Save to Vocabulary'}
						{/if}
					</button>
					{#if entry.readings.length}
						<p><strong>Readings:</strong> {entry.readings.join(', ')}</p>
					{/if}
					{#if entry.featured.length}
						<p><strong>Tags:</strong> {entry.featured.join(', ')}</p>
					{/if}

					{#if entry.definitions.length}
						<p><strong>Definitions:</strong></p>
						{#each entry.definitions as def, i}
							<div>
								<p><strong>{i + 1}.</strong> {def.meanings.join('; ')}</p>
								{#if def.parts_of_speech.length}
									<p>({def.parts_of_speech.join(', ')})</p>
								{/if}
								{#if def.tags.length}
									<p>{def.tags.join(', ')}</p>
								{/if}
								{#if def.example_ja}
									<p><strong>Example:</strong></p>
									<p>🇯🇵 {def.example_ja}</p>
									{#if def.example_en}
										<p>🇬🇧 {def.example_en}</p>
									{/if}
								{/if}
								{#if def.see_also}
									<p>See also: {def.see_also}</p>
								{/if}
							</div>
						{/each}
					{/if}
				</div>
			{/each}
		{:else}
			<p>No dictionary entries found.</p>
		{/if}
	</div>
{/if}
-->

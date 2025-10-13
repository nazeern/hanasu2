<script lang="ts">
	import { onMount } from 'svelte';
	import { Chat } from './chat-state.svelte';
	import type { ChatMessage } from './chat-state.svelte';
	import { Dictionary } from '$lib/dictionary.svelte';
	import { createClickHandler } from '$lib/click-handler';

	let { data } = $props()

	const chat = new Chat(data.language, data.testMode)
	const dictionary = new Dictionary()
	onMount(() => {
		chat.connect(data.ephemeralKey);

		return () => {
			chat.close();
		};
	})

	const { handleSingleClick, handleDoubleClick } = createClickHandler<ChatMessage>(
		(e, msg) => {
			const button = (e.target as HTMLElement).closest('button');
			if (!button) return;

			let textNode: Node | null = null;
			let offset = 0;

			const position = document.caretPositionFromPoint(e.clientX, e.clientY);
			if (!position) return;
			textNode = position.offsetNode;
			offset = position.offset;

			// Create a range from the start of the button to the click position
			const fullRange = document.createRange();
			fullRange.setStart(button, 0);
			fullRange.setEnd(textNode, offset);

			// The character index is simply the length of the text up to the click
			const charIndex = fullRange.toString().length;

			dictionary.lookupWord(msg.text, charIndex);
		},
		(msg) => {
			chat.translate(msg);
		}
	);
</script>

<p>CHAT PAGE</p>
<p>success {chat.connected}</p>
{#each chat.messages as msg (msg.id)}
	<div>
		<p>{msg.from}:</p>
		<button
			onclick={(e) => handleSingleClick(e, msg)}
			ondblclick={() => handleDoubleClick(msg)}
		>
			{msg.text}
		</button>
		{#if msg.translationLoading}
			<p>Translating...</p>
		{/if}
		{#if msg.translatedText}
			<p>{msg.translatedText}</p>
		{/if}
	</div>
{/each}

{#if dictionary.currentLookup}
	{#if dictionary.currentLookup.loading}
		<p>Looking up word...</p>
	{:else if dictionary.currentLookup.word}
		<div>
			<p><strong>Word:</strong> {dictionary.currentLookup.word}</p>
			<p><strong>Base Form:</strong> {dictionary.currentLookup.baseForm}</p>
			<p><strong>Part of Speech:</strong> {dictionary.currentLookup.partOfSpeech}</p>
			{#if dictionary.currentLookup.reading}
				<p><strong>Reading:</strong> {dictionary.currentLookup.reading}</p>
			{/if}
			{#if dictionary.currentLookup.pronunciation}
				<p><strong>Pronunciation:</strong> {dictionary.currentLookup.pronunciation}</p>
			{/if}
			{#if dictionary.currentLookup.definitions}
				<p><strong>Definitions:</strong></p>
				<pre>{JSON.stringify(dictionary.currentLookup.definitions, null, 2)}</pre>
			{/if}
			{#if dictionary.currentLookup.examples && dictionary.currentLookup.examples.length > 0}
				<p><strong>Examples:</strong></p>
				<ul>
					{#each dictionary.currentLookup.examples as example}
						<li>{example}</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
{/if}

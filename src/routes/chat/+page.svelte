<script lang="ts">
	import { onMount } from 'svelte';
	import { Chat } from './chat-state.svelte';
	import type { ChatMessage } from './chat-state.svelte';
	import { createClickHandler } from '$lib/click-handler';

	let { data } = $props()

	const chat = new Chat(data.language, data.testMode)
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

			chat.lookupWord(msg, charIndex);
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

{#if chat.lookupInfo}
	{#if chat.lookupInfo.loading}
		<p>Looking up word...</p>
	{:else if chat.lookupInfo.word}
		<div>
			<p><strong>Word:</strong> {chat.lookupInfo.word}</p>
			<p><strong>Base Form:</strong> {chat.lookupInfo.baseForm}</p>
			<p><strong>Part of Speech:</strong> {chat.lookupInfo.partOfSpeech}</p>
			{#if chat.lookupInfo.reading}
				<p><strong>Reading:</strong> {chat.lookupInfo.reading}</p>
			{/if}
			{#if chat.lookupInfo.pronunciation}
				<p><strong>Pronunciation:</strong> {chat.lookupInfo.pronunciation}</p>
			{/if}
		</div>
	{/if}
{/if}

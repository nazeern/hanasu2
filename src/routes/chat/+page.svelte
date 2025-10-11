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
		{#if msg.lookupLoading}
			<p>Looking up word...</p>
		{/if}
		{#if msg.lookupResult}
			<div>
				<p><strong>Word:</strong> {msg.lookupResult.word}</p>
				<p><strong>Base Form:</strong> {msg.lookupResult.baseForm}</p>
				<p><strong>Part of Speech:</strong> {msg.lookupResult.partOfSpeech}</p>
				{#if msg.lookupResult.reading}
					<p><strong>Reading:</strong> {msg.lookupResult.reading}</p>
				{/if}
				{#if msg.lookupResult.pronunciation}
					<p><strong>Pronunciation:</strong> {msg.lookupResult.pronunciation}</p>
				{/if}
			</div>
		{/if}
	</div>
{/each}

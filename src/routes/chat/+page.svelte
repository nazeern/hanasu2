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

	// Create click handlers for word lookup (single) and translation (double)
	const { handleSingleClick, handleDoubleClick } = createClickHandler<ChatMessage>(
		(e, msg) => {
			const range = document.caretRangeFromPoint(e.clientX, e.clientY);
			if (range) {
				chat.lookupWord(msg, range.startOffset);
			}
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
		{#if msg.lookupWord}
			<p>Word: {msg.lookupWord}</p>
		{/if}
	</div>
{/each}

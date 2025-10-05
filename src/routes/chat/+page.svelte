<script lang="ts">
	import { onMount } from 'svelte';
	import { Chat } from './chat-state.svelte';

	let { data } = $props()

	const chat = new Chat(data.language, data.testMode)
	onMount(() => {
		chat.connect(data.ephemeralKey);

		return () => {
			chat.close();
		};
	})
</script>

<p>CHAT PAGE</p>
<p>success {chat.connected}</p>
{#each chat.messages as msg (msg.id)}
	<div>
		<p>{msg.from}:</p>
		<button
			onclick={(e) => {
				const range = document.caretRangeFromPoint(e.clientX, e.clientY);
				if (range) {
					const offset = range.startOffset;
					chat.lookupWord(msg, offset);
				}
			}}
		>
			{msg.text}
		</button>
		<button type="button" onclick={() => chat.translate(msg)}>
			Translate
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

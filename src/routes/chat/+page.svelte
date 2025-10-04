<script lang="ts">
	import { onMount } from 'svelte';
	import { Chat } from './chat-state.svelte';

	let { data } = $props()

	const chat = new Chat(data.language)
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
		<button type="button" onclick={() => chat.translate(msg)}>
			{msg.from}: {msg.text}
		</button>
		{#if msg.translationLoading}
			<p>Translating...</p>
		{/if}
		{#if msg.translatedText}
			<p>{msg.translatedText}</p>
		{/if}
	</div>
{/each}

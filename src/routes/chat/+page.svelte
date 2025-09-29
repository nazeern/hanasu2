<script lang="ts">
	import { onMount } from 'svelte';
	import { Chat } from './chat-state.svelte';

	let { data } = $props()

	const chat = new Chat()
	onMount(() => chat.connect(data.ephemeralKey))
</script>

<p>CHAT PAGE</p>
<p>success {chat.connected}</p>
{#each chat.messages as msg (msg.id)}
	<p>{msg.from}: {msg.text}</p>
{/each}

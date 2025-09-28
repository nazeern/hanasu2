<script lang="ts">
	import { Chat } from './chat-state.svelte';

	let { data } = $props()

	const chat = new Chat()
	chat.connect(data.ephemeralKey)
</script>

<p>CHAT PAGE</p>
<p>success {chat.connected}</p>

<script lang="ts">
	import type { Chat } from './chat-state.svelte';
	import type { Dictionary } from '$lib/dictionary.svelte';
	import Message from './Message.svelte';

	interface Props {
		chat: Chat;
		dictionary: Dictionary;
	}

	let { chat, dictionary }: Props = $props();
</script>

<div class="flex-1 min-h-0 overflow-y-auto px-4 py-6">
	<div class="max-w-4xl mx-auto">
		{#each chat.messages as message, index (message.id)}
			<Message
				{message}
				onTokenClick={(token) => dictionary.lookupWord(token)}
				onDoubleClick={(msg) => chat.translate(index)}
			/>
		{/each}
	</div>
</div>

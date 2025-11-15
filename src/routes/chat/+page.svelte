<script lang="ts">
	import { onMount } from 'svelte';
	import { Chat } from './chat-state.svelte';
	import { Dictionary } from '$lib/dictionary.svelte';
	import ChatMessages from './ChatMessages.svelte';
	import RecordButton from './RecordButton.svelte';
	import DictionaryDrawer from './DictionaryDrawer.svelte';

	let { data } = $props();

	const chat = new Chat(data.language, data.testMode, data.prompt, data.sessionId);
	const dictionary = new Dictionary(data.language);

	onMount(() => {
		chat.connect(data.ephemeralKey);

		// Backup: save session if user closes browser unexpectedly
		window.addEventListener('beforeunload', chat.saveSession);

		return () => {
			// Clean up beforeunload listener
			window.removeEventListener('beforeunload', chat.saveSession);
			chat.close();
		};
	});
</script>

<div class="h-full flex flex-col bg-gray-50">
	<ChatMessages {chat} {dictionary} />
	<RecordButton {chat} />
</div>

<DictionaryDrawer {dictionary} />

<script lang="ts">
	import { onMount } from 'svelte';
	import { Chat } from './chat-state.svelte';
	import { Dictionary } from '$lib/dictionary.svelte';
	import ChatMessages from './ChatMessages.svelte';
	import RecordButton from './RecordButton.svelte';
	import DictionaryDrawer from './DictionaryDrawer.svelte';

	let { data } = $props();

	const chat = new Chat(data.language, data.testMode, data.prompt, data.sessionId, data.proficiency);
	const dictionary = new Dictionary(data.language);

	onMount(() => {
		chat.connect(data.ephemeralKey);

		// Backup: save session when page becomes hidden (tab closed, switched, etc.)
		// More reliable than beforeunload, especially on mobile
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'hidden') chat.saveSession(true);
		};
		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			chat.close();
		};
	});
</script>

<div class="h-full flex flex-col bg-gray-50">
	<ChatMessages {chat} {dictionary} />
	<RecordButton {chat} />
</div>

<DictionaryDrawer {dictionary} />

<script lang="ts">
	import { onMount } from 'svelte';
	import { Chat } from './chat-state.svelte';
	import { Dictionary } from '$lib/dictionary.svelte';
	import ChatMessages from './ChatMessages.svelte';
	import RecordButton from './RecordButton.svelte';
	import DictionaryDrawer from './DictionaryDrawer.svelte';
	import UsageIndicator from './UsageIndicator.svelte';

	let { data } = $props();

	const chat = new Chat(
		data.language,
		data.showSampleChat,
		data.prompt,
		data.sessionId,
		data.proficiency
	);
	const dictionary = new Dictionary(data.language);

	const usageCheck = data.usageCheck;

	const numMessages = $derived(chat.messages.length);
	const dailyRemaining = $derived(usageCheck.daily.remaining - numMessages);
	const monthlyRemaining = $derived(usageCheck.monthly.remaining - numMessages);
	const remaining = $derived(Math.min(dailyRemaining, monthlyRemaining));
	const limitReached = $derived(dailyRemaining <= monthlyRemaining ? 'daily' : 'monthly');

	const shouldBlock = $derived(!usageCheck.canStartConversation || remaining <= 0);
	const shouldWarn = $derived(!shouldBlock && remaining <= 5);

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

<div class="h-full flex flex-col bg-gray-50 relative">
	{#if shouldWarn}
		<UsageIndicator {usageCheck} mode="warning" {limitReached} {remaining} {numMessages} />
	{/if}

	<!-- Chat UI (always rendered) -->
	<div class="flex-1 flex flex-col">
		<ChatMessages {chat} {dictionary} />
		<RecordButton {chat} disabled={shouldBlock} />
	</div>

	<!-- Blocking overlay (positioned absolutely on top, with backdrop blur) -->
	{#if shouldBlock}
		<div class="absolute inset-0">
			<UsageIndicator {usageCheck} mode="blocking" {limitReached} {remaining} {numMessages} />
		</div>
	{/if}
</div>

<DictionaryDrawer {dictionary} />

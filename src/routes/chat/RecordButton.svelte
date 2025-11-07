<script lang="ts">
	import type { Chat } from './chat-state.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		chat: Chat;
	}

	let { chat }: Props = $props();

	const buttonClass = $derived(
		cn(
			'w-20 h-20 rounded-full flex items-center justify-center text-2xl',
			'transition-all duration-200 shadow-lg text-white font-semibold',
			!chat.connected && 'bg-gray-400 cursor-not-allowed',
			chat.recording && 'bg-red-500 hover:bg-red-600 scale-110',
			chat.connected && !chat.recording && 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
		)
	);
</script>

<div class="flex justify-center py-6">
	<button
		class={buttonClass}
		onpointerdown={() => chat.startRecording()}
		onpointerup={() => chat.stopRecording()}
		onpointerleave={() => chat.stopRecording()}
		disabled={!chat.connected}
		aria-label={chat.recording ? 'Recording' : 'Hold to record'}
	>
		🎤
	</button>
</div>

{#if !chat.connected}
	<p class="text-center text-sm text-gray-600 pb-2">Connecting...</p>
{:else if chat.recording}
	<p class="text-center text-sm text-red-600 pb-2 font-medium">Recording... Release to send</p>
{:else}
	<p class="text-center text-sm text-gray-600 pb-2">Hold to talk</p>
{/if}

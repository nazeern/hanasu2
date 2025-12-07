<script lang="ts">
	import type { Chat } from './chat-state.svelte';
	import { cn } from '$lib/utils/cn';
	import Microphone from '$lib/icons/Microphone.svelte';

	interface Props {
		chat: Chat;
		disabled?: boolean;
	}

	let { chat, disabled = false }: Props = $props();

	const isDisabled = $derived(!chat.connected || disabled);

	const buttonClass = $derived(
		cn(
			'w-16 h-16 rounded-full flex items-center justify-center',
			'transition-all duration-200 shadow-lg text-white',
			isDisabled && 'bg-gray-400 cursor-not-allowed',
			chat.recording && !disabled && 'bg-red-500 hover:bg-red-600 scale-110',
			chat.connected && !chat.recording && !disabled && 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
		)
	);
</script>

<div class="flex justify-center pb-2">
	<button
		class={buttonClass}
		onpointerdown={() => !disabled && chat.startRecording()}
		onpointerup={() => !disabled && chat.stopRecording()}
		onpointerleave={() => !disabled && chat.stopRecording()}
		oncontextmenu={(e) => e.preventDefault()}
		disabled={isDisabled}
		aria-label={chat.recording ? 'Recording' : 'Hold to record'}
		style="touch-action: manipulation; -webkit-touch-callout: none; user-select: none;"
	>
		<Microphone class="w-8 h-8" />
	</button>
</div>

{#if !chat.connected}
	<p class="text-center text-sm text-gray-600 pb-2">Connecting...</p>
{:else if chat.recording}
	<p class="text-center text-sm text-red-600 pb-2 font-medium">Recording... Release to send</p>
{:else}
	<p class="text-center text-sm text-gray-600 pb-2">Hold to talk</p>
{/if}

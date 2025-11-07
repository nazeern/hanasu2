<script lang="ts">
	import type { ChatMessage } from './chat-state.svelte';
	import type { ParsedWord } from './kuromoji-parser';
	import TokenizedText from './TokenizedText.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		message: ChatMessage;
		onTokenClick: (token: ParsedWord) => void;
		onDoubleClick: (message: ChatMessage) => void;
	}

	let { message, onTokenClick, onDoubleClick }: Props = $props();

	const isUser = message.from === 'user';
</script>

<div class={cn('flex mb-4', isUser ? 'justify-end' : 'justify-start')}>
	<div class={cn('max-w-2xl px-4 py-2 rounded-2xl', isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900')}>
		{#if message.tokens}
			<button
				class="text-left w-full"
				ondblclick={() => onDoubleClick(message)}
			>
				<TokenizedText tokens={message.tokens} onWordClick={onTokenClick} />
			</button>
		{:else}
			<p class="text-sm opacity-70 italic">Tokenizing...</p>
		{/if}

		{#if message.translationLoading}
			<p class="text-sm mt-2 opacity-70 italic">Translating...</p>
		{/if}

		{#if message.translatedText}
			<p class="text-sm mt-2 opacity-90">{message.translatedText}</p>
		{/if}

		{#if message.tips}
			<div class="mt-2 pt-2 border-t border-current border-opacity-20">
				<p class="text-xs font-semibold opacity-75">Tips:</p>
				<p class="text-sm mt-1 opacity-90">{message.tips}</p>
			</div>
		{/if}
	</div>
</div>

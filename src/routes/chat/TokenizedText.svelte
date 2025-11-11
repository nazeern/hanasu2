<script lang="ts">
	import type { ParsedWord } from './kuromoji-parser';
	import { createClickHandler } from '$lib/click-handler';
	import { cn } from '$lib/utils/cn';

	interface Props {
		tokens: ParsedWord[];
		onWordClick: (token: ParsedWord) => void;
		isUser: boolean;
	}

	let { tokens, onWordClick, isUser }: Props = $props();

	const { handleSingleClick, handleDoubleClick } = createClickHandler<ParsedWord>(
		(_e, token) => onWordClick(token),
		() => {}, // Do nothing on double-click, let event bubble to parent for translation
		200
	);
</script>

<span class="inline break-words leading-relaxed">
	{#each tokens as token}
		<button
			type="button"
			class={cn(
				'inline-block px-1 py-0.5 mx-px rounded border-b-2 border-transparent cursor-pointer transition-all duration-200',
				isUser
					? 'bg-white/25 hover:bg-white/40 hover:border-white/80'
					: 'bg-primary-100 hover:bg-primary-200 hover:border-primary-500',
				'hover:-translate-y-px active:translate-y-0'
			)}
			onclick={(e) => handleSingleClick(e, token)}
			ondblclick={() => handleDoubleClick(token)}
		>
			{token.surfaceForm}
		</button>
	{/each}
</span>

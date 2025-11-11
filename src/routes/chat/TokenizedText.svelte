<script lang="ts">
	import type { ParsedWord } from './kuromoji-parser';
	import { createClickHandler } from '$lib/click-handler';

	interface Props {
		tokens: ParsedWord[];
		onWordClick: (token: ParsedWord) => void;
	}

	let { tokens, onWordClick }: Props = $props();

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
			class="inline-block px-1 py-0.5 mx-px rounded bg-neutral-300/30 border-b-2 border-transparent cursor-pointer transition-all duration-200 hover:bg-white/40 hover:border-white/80 hover:-translate-y-px active:translate-y-0"
			onclick={(e) => handleSingleClick(e, token)}
			ondblclick={() => handleDoubleClick(token)}
		>
			{token.surfaceForm}
		</button>
	{/each}
</span>

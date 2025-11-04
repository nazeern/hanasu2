<script lang="ts">
	import type { ParsedWord } from './kuromoji-parser';

	interface Props {
		tokens: ParsedWord[];
		onWordClick: (token: ParsedWord) => void;
	}

	let { tokens, onWordClick }: Props = $props();
</script>

<span class="tokenized-text">
	{#each tokens as token}
		<button
			type="button"
			class="token"
			onclick={() => onWordClick(token)}
		>
			{token.surfaceForm}
		</button>
	{/each}
</span>

<style>
	.tokenized-text {
		display: inline;
		word-wrap: break-word;
		line-height: 1.8;
	}

	.token {
		display: inline-block;
		border: none;
		background: rgba(59, 130, 246, 0.1);
		padding: 2px 4px;
		margin: 0 1px;
		border-radius: 4px;
		font: inherit;
		color: inherit;
		text-align: inherit;
		cursor: pointer;
		transition: all 0.2s ease;
		border-bottom: 2px solid transparent;
	}

	.token:hover {
		background: rgba(59, 130, 246, 0.2);
		border-bottom-color: rgb(59, 130, 246);
		transform: translateY(-1px);
	}

	.token:active {
		transform: translateY(0);
	}
</style>

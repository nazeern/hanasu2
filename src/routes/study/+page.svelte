<script lang="ts">
	import { Study } from '$lib/study.svelte';
	import type { Definition } from '$lib/dictionary.svelte';

	let { data } = $props();

	const study = new Study(data.studyQueue);

	function formatDefinitions(defsJson: unknown): Definition[] {
		if (!defsJson || !Array.isArray(defsJson)) return [];
		return defsJson as Definition[];
	}
</script>

<h1>Study Vocabulary</h1>

{#if !study.currentItem}
	<div>
		<p>🎉 Study session complete!</p>
		<p>You've reviewed all your due words for today.</p>
		<a href="/chat">Go to Chat</a>
	</div>
{:else if study.currentItem}
	<div>
		<p><strong>Words remaining:</strong> {study.totalWords}</p>

		<div style="margin: 20px 0;">
			<p><strong>Word:</strong> {study.currentItem.dictEntry.word}</p>

			{#if study.currentItem.dictEntry.featured && study.currentItem.dictEntry.featured.length > 0}
				<p><strong>Tags:</strong> {study.currentItem.dictEntry.featured.join(', ')}</p>
			{/if}

			<p><strong>Definitions:</strong></p>
			{#each formatDefinitions(study.currentItem.dictEntry.definitions) as def, i}
				<div style="margin-left: 15px;">
					<p>{i + 1}. {def.meanings.join('; ')}</p>
					{#if def.parts_of_speech.length > 0}
						<p style="font-style: italic;">({def.parts_of_speech.join(', ')})</p>
					{/if}
				</div>
			{/each}
		</div>

		{#if study.state === 'idle'}
			<div>
				<input
					type="text"
					bind:value={study.currentAnswer}
					placeholder="Type the reading..."
					disabled={study.submitting}
					onkeydown={(e) => e.key === 'Enter' && study.submitAnswer()}
				/>
				<button
					onclick={() => study.submitAnswer()}
					disabled={study.submitting || !study.currentAnswer.trim()}
				>
					{study.submitting ? 'Submitting...' : 'Submit'}
				</button>
			</div>
		{:else}
			<div style="margin: 20px 0;">
				{#if study.state === 'correct'}
					<p style="color: green;">✓ Correct!</p>
				{:else}
					<p style="color: red;">✗ Incorrect</p>
				{/if}
				<button onclick={() => study.continue()}>Next Word</button>
			</div>
		{/if}
	</div>
{:else}
	<p>No words to study right now. Check back later or go to <a href="/chat">Chat</a>.</p>
{/if}

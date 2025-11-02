<script lang="ts">
	import { Study } from '$lib/study.svelte';
	import Vocab from '../dashboard/Vocab.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import Input from '$lib/components/Input.svelte';

	let { data } = $props();

	const study = new Study(data.studyQueue);
	const totalWords = data.studyQueue.length;
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
		<ProgressBar remaining={study.totalWords} total={totalWords} class="mb-6" />

		<Vocab nextVocab={study.currentItem} />

		{#if study.state === 'idle'}
			<div>
				<Input
					name="answer"
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

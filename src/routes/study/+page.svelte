<script lang="ts">
	import { Study } from '$lib/study.svelte';
	import Vocab from '../dashboard/Vocab.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import Button from '$lib/components/Button.svelte';
	import AnswerInput from './AnswerInput.svelte';

	let { data } = $props();

	const study = new Study(data.studyQueue);
	const totalWords = data.studyQueue.length;
</script>

<div class="w-full max-w-3xl flex flex-col items-center mx-auto py-12 px-2">
	{#if !study.currentItem}
		<p class='text-2xl font-semibold mb-3'>🎉 Study session complete!</p>
		<p class='mb-4'>You've reviewed all your due words for today.</p>
		<Button href='/chat' variant='primary'>Go to Chat</Button>
	{:else if study.currentItem}
		<ProgressBar remaining={study.totalWords} total={totalWords} class="mb-6" />

		<Vocab nextVocab={study.currentItem} state={study.state} hideWord={study.state === 'idle'} />

		<AnswerInput {study} />
	{:else}
		<p>No words to study right now. Check back later or go to <a href="/chat">Chat</a>.</p>
	{/if}
</div>

<script lang="ts">
	import Divider from '$lib/components/Divider.svelte';
	import Message from '$lib/components/Message.svelte';
	import Link from './Link.svelte';
	import Vocab from './Vocab.svelte';
	import Metrics from './Metrics.svelte';

	let { data, form } = $props();
	let { prompts, nextVocab, metrics } = $derived(data);
</script>

<div class="mx-auto w-full max-w-2xl flex flex-col items-center my-24 px-4">
	<!-- Metrics Section -->
	<Metrics {metrics} />

	<div class='my-8'></div>

	<!-- Conversation Prompts Section -->
	<Message text="START A CONVERSATION" class="mb-4 text-2xl" />
	{#each prompts as prompt}
		<Link route='/chat?prompt={encodeURIComponent(prompt)}'>
			{prompt}
		</Link>
	{/each}

	<!-- Vocab Section -->
	{#if nextVocab}
		<Divider class="m-8" />
		<Message text="STUDY VOCAB" class="mb-4 text-2xl" />
		<Vocab {nextVocab} hideVocab={true} />
		<Link route='/study'>
			Study Vocab
		</Link>
	{/if}
</div>

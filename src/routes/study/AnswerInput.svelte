<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import type { Study } from '$lib/study.svelte';

	interface Props {
		study: Study;
	}

	let { study }: Props = $props();

	$effect(() => {
		if (study.state === 'correct' || study.state === 'incorrect') {
			function handleKeydown(e: KeyboardEvent) {
				// Only continue if Enter is pressed and we're not in an input field
				if (e.key === 'Enter' && !(e.target instanceof HTMLInputElement)) {
					study.continue();
				}
			}

			document.addEventListener('keydown', handleKeydown);
			return () => document.removeEventListener('keydown', handleKeydown);
		}
	});
</script>

<div class="w-full flex justify-center items-center gap-2">
	{#if study.state === 'idle'}
		<Input
			name="answer"
			type="text"
			bind:value={study.currentAnswer}
			placeholder="Type the matching word in Japanese..."
			disabled={study.submitting}
			onkeydown={(e) => e.key === 'Enter' && study.submitAnswer()}
		/>
		<Button
			variant="primary"
			onclick={() => study.submitAnswer()}
			disabled={study.submitting || !study.currentAnswer.trim()}
		>
			{study.submitting ? 'Submitting...' : 'Submit'}
		</Button>
	{:else if study.state === 'correct'}
		<p class='text-green-600 text-xl'>✓ Correct!</p>
		<Button variant="primary" onclick={() => study.continue()}>Next Word</Button>
	{:else}
		<p class='text-red-600 text-xl'>✗ Incorrect</p>
		<Button variant="primary" onclick={() => study.continue()}>Next Word</Button>
	{/if}
</div>

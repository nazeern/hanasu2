<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Button from '$lib/components/Button.svelte';
	import { cn } from '$lib/utils/cn';

	// Demo data - simulated chat messages
	const demoMessages = [
		{
			role: 'assistant',
			content: '今日は何をしましたか？',
			translation: 'What did you do today?',
			words: [
				{ text: '今日', reading: 'きょう', meaning: 'today' },
				{ text: '何', reading: 'なに', meaning: 'what' },
				{ text: 'しました', reading: 'しました', meaning: 'did' }
			]
		},
		{
			role: 'user',
			content: '図書館で本を読みました。',
			translation: 'I read a book at the library.',
			words: [
				{ text: '図書館', reading: 'としょかん', meaning: 'library' },
				{ text: '本', reading: 'ほん', meaning: 'book' },
				{ text: '読みました', reading: 'よみました', meaning: 'read' }
			]
		}
	];

	let selectedWord = $state<{ text: string; reading: string; meaning: string } | null>(null);
	let savedWords = $state<Set<string>>(new Set());
	let showDemo = $state(true);

	function selectWord(word: { text: string; reading: string; meaning: string }) {
		selectedWord = word;
	}

	function saveWord() {
		if (selectedWord) {
			savedWords.add(selectedWord.text);
			savedWords = savedWords; // Trigger reactivity
		}
	}

	function closeWord() {
		selectedWord = null;
	}
</script>

<div class="w-full max-w-2xl mx-auto">
	<div class="mb-3 flex items-center justify-between">
		<div class="text-sm font-medium text-primary-600">Interactive Demo</div>
		<div class="text-xs text-text-muted">Try clicking on Japanese words below</div>
	</div>

	<Container class="relative min-h-[400px] flex flex-col">
		{#if showDemo}
			<!-- Chat messages -->
			<div class="flex-1 space-y-4 mb-4">
				{#each demoMessages as message}
					<div
						class={cn(
							'flex flex-col gap-1',
							message.role === 'user' ? 'items-end' : 'items-start'
						)}
					>
						<div
							class={cn(
								'px-4 py-3 rounded-lg max-w-[80%]',
								message.role === 'user'
									? 'bg-primary-600 text-white'
									: 'bg-neutral-100 text-text-primary'
							)}
						>
							<div class="font-medium mb-1 flex flex-wrap gap-1">
								{#each message.words as word}
									<button
										type="button"
										onclick={() => selectWord(word)}
										class={cn(
											'hover:bg-primary-100 hover:text-primary-700 px-1 rounded transition-colors cursor-pointer',
											message.role === 'user' && 'hover:bg-primary-500',
											savedWords.has(word.text) && 'underline decoration-2 decoration-success-500'
										)}
									>
										{word.text}
									</button>
								{/each}
							</div>
							<div class="text-sm opacity-75">{message.translation}</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Word detail popup -->
			{#if selectedWord}
				<div class="absolute inset-0 bg-black/50 flex items-center justify-center p-4 rounded-lg">
					<Container class="w-full max-w-sm bg-white">
						<div class="flex justify-between items-start mb-3">
							<h3 class="text-2xl font-bold text-text-primary">{selectedWord.text}</h3>
							<button
								type="button"
								onclick={closeWord}
								class="text-neutral-500 hover:text-neutral-700"
								aria-label="Close word details"
							>
								<svg
									class="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
						<div class="mb-4">
							<div class="text-text-secondary mb-2">Reading: {selectedWord.reading}</div>
							<div class="text-text-primary">Meaning: {selectedWord.meaning}</div>
						</div>
						<div class="flex gap-2">
							<Button
								variant="primary"
								onclick={saveWord}
								disabled={savedWords.has(selectedWord.text)}
								class="flex-1"
							>
								{savedWords.has(selectedWord.text) ? '✓ Saved' : 'Add to Vocabulary'}
							</Button>
							<Button variant="secondary" onclick={closeWord}>Close</Button>
						</div>
						{#if savedWords.has(selectedWord.text)}
							<div class="mt-3 text-sm text-success-600 text-center">
								Word saved! You'll review this later with spaced repetition.
							</div>
						{/if}
					</Container>
				</div>
			{/if}
		{/if}
	</Container>

	<div class="mt-3 text-center text-sm text-text-muted">
		This is a simulated demo. Sign up to start real conversations!
	</div>
</div>

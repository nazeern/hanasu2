<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Message from '$lib/components/Message.svelte';
	import { practiceFrequencyOptions, type PracticeFrequency } from './constants';

	interface Props {
		onnext: () => void;
		selectedFrequency: PracticeFrequency | '';
	}

	let { onnext, selectedFrequency = $bindable() }: Props = $props();

	function selectFrequency(frequency: PracticeFrequency) {
		selectedFrequency = frequency;
		// Auto-advance after selection
		setTimeout(onnext, 300);
	}
</script>

<div class="text-center mb-4 md:mb-12">
	<Message text="How often can you practice?" class="mb-4 text-3xl" />
	<p class="text-lg text-text-secondary">Choose what works best for you</p>
</div>

<div class="grid grid-cols-1 gap-4">
	{#each practiceFrequencyOptions as option}
		<button
			type="button"
			onclick={() => selectFrequency(option.id)}
			class="text-left transition-all hover:scale-105 cursor-pointer"
		>
			<Container
				class="h-full transition-all {selectedFrequency === option.id
					? 'border-primary-500 shadow-lg bg-primary-50'
					: 'hover:border-primary-300 hover:shadow-md'}"
			>
				<h3 class="text-xl font-semibold text-text-primary mb-2">{option.label}</h3>
				<p class="text-text-secondary text-sm">{option.description}</p>
			</Container>
		</button>
	{/each}
</div>

<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Message from '$lib/components/Message.svelte';
	import { proficiencyLevels } from './constants';

	interface Props {
		onnext: () => void;
		selectedProficiency: string;
	}

	let { onnext, selectedProficiency = $bindable() }: Props = $props();

	function selectProficiency(proficiencyId: string) {
		selectedProficiency = proficiencyId;
		// Auto-advance after selection
		setTimeout(onnext, 300);
	}
</script>

<div class="text-center mb-4 md:mb-12">
	<Message text="What's your level?" class="mb-4 text-3xl" />
	<p class="text-lg text-text-secondary">Help us personalize your experience</p>
</div>

<div class="grid grid-cols-1 gap-4">
	{#each proficiencyLevels as level}
		<button
			type="button"
			onclick={() => selectProficiency(level.id)}
			class="text-left transition-all hover:scale-105 cursor-pointer"
		>
			<Container
				class="h-full transition-all {selectedProficiency === level.id
					? 'border-primary-500 shadow-lg bg-primary-50'
					: 'hover:border-primary-300 hover:shadow-md'}"
			>
				<h3 class="text-xl font-semibold text-text-primary mb-2">{level.label}</h3>
				<p class="text-text-secondary text-sm">{level.description}</p>
			</Container>
		</button>
	{/each}
</div>

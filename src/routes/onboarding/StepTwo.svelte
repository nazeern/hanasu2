<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Container from '$lib/components/Container.svelte';
	import Message from '$lib/components/Message.svelte';
	import { proficiencyLevels } from './constants';

	interface Props {
		onback: () => void;
		onnext: () => void;
		selectedProficiency: string;
	}

	let { onback, onnext, selectedProficiency = $bindable() }: Props = $props();
</script>

<div class="text-center mb-12">
	<Message text="What's your level?" class="mb-4 font-light text-3xl" />
	<p class="text-lg text-text-secondary">Help us personalize your experience</p>
</div>

<div class="grid grid-cols-1 gap-4 mb-8">
	{#each proficiencyLevels as level}
		<button
			type="button"
			onclick={() => (selectedProficiency = level.id)}
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

<div class="flex gap-4 justify-center">
	<Button type="button" variant="secondary" onclick={onback}>
		Back
	</Button>
	<Button
		type="button"
		variant="primary"
		class="px-8"
		disabled={!selectedProficiency}
		onclick={onnext}
	>
		Next
	</Button>
</div>

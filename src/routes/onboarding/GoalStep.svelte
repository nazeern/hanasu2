<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Message from '$lib/components/Message.svelte';
	import { goals } from './constants';

	interface Props {
		onnext: () => void;
		selectedGoal: string;
	}

	let { onnext, selectedGoal = $bindable() }: Props = $props();

	function selectGoal(goalId: string) {
		selectedGoal = goalId;
		// Auto-advance after selection
		setTimeout(onnext, 300);
	}
</script>

<div class="text-center mb-4 md:mb-12">
	<Message text="What brings you here?" class="mb-4 text-3xl" />
	<p class="text-lg text-text-secondary">Choose what interests you most</p>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
	{#each goals as goal}
		<button
			type="button"
			onclick={() => selectGoal(goal.id)}
			class="text-left transition-all hover:scale-105 cursor-pointer"
		>
			<Container
				class="h-full transition-all {selectedGoal === goal.id
					? 'border-primary-500 shadow-lg bg-primary-50'
					: 'hover:border-primary-300 hover:shadow-md'}"
			>
				<h3 class="text-xl font-semibold text-text-primary mb-2">{goal.label}</h3>
				<p class="text-text-secondary text-sm">{goal.description}</p>
			</Container>
		</button>
	{/each}
</div>

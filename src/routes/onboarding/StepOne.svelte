<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Message from '$lib/components/Message.svelte';
	import { goals } from './constants';

	interface Props {
		onnext: () => void;
	}

	let { onnext }: Props = $props();
</script>

<div class="text-center mb-12">
	<Message text="What brings you here?" class="mb-4 font-light text-3xl" />
	<p class="text-lg text-text-secondary">Choose what interests you most</p>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
	{#each goals as goal}
		<button onclick={onnext} class="text-left transition-all hover:scale-105 cursor-pointer">
			<Container class="h-full hover:border-primary-500 hover:shadow-lg transition-all">
				<h3 class="text-xl font-semibold text-text-primary mb-2">{goal.label}</h3>
				<p class="text-text-secondary text-sm">{goal.description}</p>
			</Container>
		</button>
	{/each}
</div>

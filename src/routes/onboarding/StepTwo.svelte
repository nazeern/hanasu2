<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Container from '$lib/components/Container.svelte';
	import Message from '$lib/components/Message.svelte';
	import Spinner from '$lib/icons/Spinner.svelte';
	import { enhance } from '$app/forms';
	import { proficiencyLevels } from './constants';

	interface Props {
		onback: () => void;
	}

	let { onback }: Props = $props();
	let selectedProficiency = $state<string>(proficiencyLevels[0].id);
	let isSubmitting = $state(false);
</script>

<div class="text-center mb-12">
	<Message text="What's your level?" class="mb-4 font-light text-3xl" />
	<p class="text-lg text-text-secondary">Help us personalize your experience</p>
</div>

<form
	id="onboarding-form"
	method="POST"
	use:enhance={() => {
		isSubmitting = true;
		return async ({ update }) => {
			await update();
			isSubmitting = false;
		};
	}}
>
	<input type="hidden" name="proficiency" value={selectedProficiency || ''} />

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
		<Button type="button" variant="secondary" onclick={onback} disabled={isSubmitting}>
			Back
		</Button>
		<Button
			type="submit"
			variant="primary"
			class="px-8"
			disabled={!selectedProficiency || isSubmitting}
		>
			{#if isSubmitting}
				<span class="flex items-center gap-2">
					<Spinner class="w-5 h-5" />
					Starting...
				</span>
			{:else}
				Let's Go!
			{/if}
		</Button>
	</div>
</form>

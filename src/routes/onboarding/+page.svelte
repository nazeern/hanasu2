<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Container from '$lib/components/Container.svelte';
	import Message from '$lib/components/Message.svelte';
	import Spinner from '$lib/icons/Spinner.svelte';
	import { enhance } from '$app/forms';
	import { goals, proficiencyLevels } from './constants';

	let step = $state<1 | 2>(1);
	let selectedProficiency = $state<string>(proficiencyLevels[0].id);
	let isSubmitting = $state(false);

	function next() {
		step++;
	}

	function back() {
		step--;
	}

	function handleSkip() {
		// Submit form with null proficiency
		const form = document.getElementById('onboarding-form') as HTMLFormElement;
		form?.requestSubmit();
	}
</script>

<div class="min-h-screen bg-gradient-to-b from-primary-50 to-white py-16 px-4">
	<div class="mx-auto w-full max-w-2xl">
		<!-- Skip button -->
		<div class="flex justify-end mb-8">
			<button
				onclick={handleSkip}
				disabled={isSubmitting}
				class="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
			>
				Skip
			</button>
		</div>

		<!-- Progress indicator -->
		<div class="text-center mb-8">
			<p class="text-sm text-text-secondary">Step {step} of 2</p>
		</div>

		{#if step === 1}
			<!-- Step 1: Goal Selection -->
			<div class="text-center mb-12">
				<Message text="What brings you here?" class="mb-4 font-light text-3xl" />
				<p class="text-lg text-text-secondary">Choose what interests you most</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each goals as goal}
					<button onclick={next} class="text-left transition-all hover:scale-105 cursor-pointer">
						<Container class="h-full hover:border-primary-500 hover:shadow-lg transition-all">
							<h3 class="text-xl font-semibold text-text-primary mb-2">{goal.label}</h3>
							<p class="text-text-secondary text-sm">{goal.description}</p>
						</Container>
					</button>
				{/each}
			</div>
		{:else}
			<!-- Step 2: Proficiency Level -->
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
					<Button type="button" variant="secondary" onclick={back} disabled={isSubmitting}>
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
		{/if}
	</div>
</div>

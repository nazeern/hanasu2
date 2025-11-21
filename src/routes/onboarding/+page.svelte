<script lang="ts">
	import { enhance } from '$app/forms';
	import StepOne from './StepOne.svelte';
	import StepTwo from './StepTwo.svelte';
	import StepThree from './StepThree.svelte';
	import { proficiencyLevels } from './constants';

	let step = $state<1 | 2 | 3>(1);
	let selectedProficiency = $state<string>(proficiencyLevels[0].id);
	let skipping = $state(false);

	function next() {
		step++;
	}

	function back() {
		step--;
	}

	function handleSkip() {
		skipping = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			skipping = false;
		};
	}
</script>

<div class="h-full bg-gradient-to-b from-primary-50 to-white py-16 px-4">
	<div class="mx-auto w-full max-w-2xl">
		<!-- Skip button -->
		<div class="flex justify-end mb-8">
			<form method="POST" action="?/skip" use:enhance={handleSkip}>
				<button
					type="submit"
					disabled={skipping}
					class="text-text-secondary hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{skipping ? 'Skipping...' : 'Skip'}
				</button>
			</form>
		</div>

		<!-- Progress indicator -->
		<div class="text-center mb-8">
			<p class="text-sm text-text-secondary">Step {step} of 3</p>
		</div>

		{#if step === 1}
			<StepOne onnext={next} />
		{:else if step === 2}
			<StepTwo onback={back} onnext={next} bind:selectedProficiency />
		{:else}
			<StepThree onback={back} {selectedProficiency} />
		{/if}
	</div>
</div>

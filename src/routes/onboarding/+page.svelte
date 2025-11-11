<script lang="ts">
	import { goto } from '$app/navigation';
	import StepOne from './StepOne.svelte';
	import StepTwo from './StepTwo.svelte';
	import StepThree from './StepThree.svelte';
	import { proficiencyLevels } from './constants';

	let step = $state<1 | 2 | 3>(1);
	let selectedProficiency = $state<string>(proficiencyLevels[0].id);

	function next() {
		step++;
	}

	function back() {
		step--;
	}

	function handleSkip() {
		goto('/dashboard');
	}
</script>

<div class="h-full bg-gradient-to-b from-primary-50 to-white py-16 px-4">
	<div class="mx-auto w-full max-w-2xl">
		<!-- Skip button -->
		<div class="flex justify-end mb-8">
			<button
				onclick={handleSkip}
				class="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
			>
				Skip
			</button>
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

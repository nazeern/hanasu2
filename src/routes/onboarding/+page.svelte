<script lang="ts">
	import { goto } from '$app/navigation';
	import StepOne from './StepOne.svelte';
	import StepTwo from './StepTwo.svelte';

	let step = $state<1 | 2>(1);

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

<div class="min-h-screen bg-gradient-to-b from-primary-50 to-white py-16 px-4">
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
			<p class="text-sm text-text-secondary">Step {step} of 2</p>
		</div>

		{#if step === 1}
			<StepOne onnext={next} />
		{:else}
			<StepTwo onback={back} />
		{/if}
	</div>
</div>

<script lang="ts">
	import { enhance } from '$app/forms';
	import GoalStep from './GoalStep.svelte';
	import PracticeStep from './PracticeStep.svelte';
	import ProficiencyStep from './ProficiencyStep.svelte';
	import DemoStep from './DemoStep.svelte';
	import { proficiencyLevels, type PracticeFrequency } from './constants';

	let step = $state<1 | 2 | 3 | 4>(1);
	let selectedGoal = $state<string>('');
	let selectedFrequency = $state<PracticeFrequency | ''>('');
	let selectedProficiency = $state<string>('');
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

<div class="h-full bg-gradient-to-b from-primary-50 to-white py-2 md:py-16 px-4">
	<div class="mx-auto w-full max-w-2xl">
		<!-- Header: Back + Progress + Skip -->
		<div class="flex justify-between items-center mb-4 md:mb-8">
			<div class="w-16">
				{#if step > 1}
					<button
						type="button"
						onclick={back}
						class="text-text-secondary hover:text-text-primary transition-colors"
					>
						← Back
					</button>
				{/if}
			</div>

			<p class="text-sm text-text-secondary">Step {step} of 4</p>

			<form method="POST" action="?/skip" use:enhance={handleSkip} class="w-16 text-right">
				<button
					type="submit"
					disabled={skipping}
					class="text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
				>
					{skipping ? 'Skipping...' : 'Skip'}
				</button>
			</form>
		</div>

		{#if step === 1}
			<GoalStep onnext={next} bind:selectedGoal />
		{:else if step === 2}
			<PracticeStep onnext={next} bind:selectedFrequency />
		{:else if step === 3}
			<ProficiencyStep onnext={next} bind:selectedProficiency />
		{:else}
			<DemoStep onback={back} {selectedGoal} {selectedProficiency} {selectedFrequency} />
		{/if}
	</div>
</div>

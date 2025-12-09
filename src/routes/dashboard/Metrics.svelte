<script lang="ts">
	import MetricCard from './MetricCard.svelte';
	import ChevronDown from '$lib/icons/ChevronDown.svelte';
	import ChevronUp from '$lib/icons/ChevronUp.svelte';

	interface MetricData {
		current: number;
		goal: number;
	}

	interface Props {
		metrics: {
			wordsSaved: MetricData;
			conversationTime: MetricData;
			dailyStreak: MetricData;
		};
	}

	let { metrics }: Props = $props();
	let expanded = $state(false);
</script>

<div class="w-full">
	<!-- Collapsible Header -->
	<button
		onclick={() => (expanded = !expanded)}
		class="mb-6 font-medium text-2xl flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
		aria-expanded={expanded}
		aria-controls="metrics-section"
	>
		<span>YOUR PROGRESS</span>
		<div class="w-6 h-6">
			{#if expanded}
				<ChevronUp />
			{:else}
				<ChevronDown />
			{/if}
		</div>
	</button>

	<!-- Metrics Cards -->
	<div id="metrics-section" class="w-full flex flex-col gap-4">
		<MetricCard
			label="Conversation Time"
			current={metrics.conversationTime.current}
			goal={metrics.conversationTime.goal}
			unit="min"
		/>
		{#if expanded}
			<MetricCard
				label="Words Saved"
				current={metrics.wordsSaved.current}
				goal={metrics.wordsSaved.goal}
				unit="words"
			/>
			<MetricCard
				label="Daily Streak"
				current={metrics.dailyStreak.current}
				goal={metrics.dailyStreak.goal}
				unit="days"
			/>
		{/if}
	</div>
</div>

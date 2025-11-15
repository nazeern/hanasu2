<script lang="ts">
	import Container from '$lib/components/Container.svelte';

	interface Props {
		label: string;
		current: number;
		goal: number;
		unit: string;
	}

	let { label, current, goal, unit }: Props = $props();

	// Calculate progress percentage, capped at 100%
	const progress = $derived(Math.min((current / goal) * 100, 100));
	const progressRounded = $derived(Math.round(progress));
</script>

<Container class="w-full flex flex-col gap-3">
	<!-- Metric label and values -->
	<div class="flex justify-between items-baseline">
		<h3 class="text-lg font-medium text-gray-900">{label}</h3>
		<p class="text-sm text-gray-600">
			<span class="font-semibold text-gray-900">{current}</span>
			<span class="mx-1">/</span>
			<span>{goal}</span>
			<span class="ml-1">{unit}</span>
		</p>
	</div>

	<!-- Progress bar -->
	<div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
		<div
			class="bg-primary-500 h-full rounded-full transition-all duration-500 ease-out"
			style="width: {progress}%"
		></div>
	</div>

	<!-- Percentage display -->
	<p class="text-xs text-gray-500 text-right">{progressRounded}% complete</p>
</Container>

<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		remaining: number;
		total: number;
		class?: string;
	}

	let { remaining, total, class: className }: Props = $props();

	const completed = $derived(total - remaining);
	const percentage = $derived(total > 0 ? (completed / total) * 100 : 0);
</script>

<div class={cn('w-full', className)}>
	<div class="flex justify-between items-center mb-2">
		<span class="text-sm font-medium text-neutral-700">
			{completed} / {total} completed
		</span>
		<span class="text-sm text-neutral-500">{remaining} remaining</span>
	</div>
	<div class="w-full bg-neutral-200 rounded-full h-2.5">
		<div
			class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
			style="width: {percentage}%"
		></div>
	</div>
</div>

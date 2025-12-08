<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
	}
	let { class: className }: Props = $props();
</script>

<a href="/dashboard" aria-label="Hanasu Logo">
	<p class={cn('text-2xl font-bold tracking-wide', className)}>Hanasu</p>
</a>

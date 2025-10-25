<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
	}
	let { class: className }: Props = $props();
</script>

<a href="/dashboard" aria-label="Hanasu Logo">
	<p class={cn('text-xl font-semibold', className)}>Hanasu</p>
</a>

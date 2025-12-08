<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
	}
	let { class: className }: Props = $props();
</script>

<a href="/dashboard" aria-label="Hanasu Logo" class="flex items-center gap-2">
	<img
		src="/images/HanasuMascotSimple.png"
		alt="Hanasu Mascot"
		class="h-8 w-8 object-contain"
	/>
	<p class={cn('text-2xl font-bold tracking-wide', className)}>Hanasu</p>
</a>

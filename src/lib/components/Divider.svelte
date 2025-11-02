<script lang="ts">
	import { cn } from "$lib/utils/cn";

	interface Props {
		text?: string;
		class?: string;
	}

	let { text = 'or', class: className }: Props = $props();
</script>

<div class={cn("flex items-center gap-4 w-full", className)}>
	<div class="flex-1 border-t border-border"></div>
	<span class="text-text-muted text-sm">{text}</span>
	<div class="flex-1 border-t border-border"></div>
</div>

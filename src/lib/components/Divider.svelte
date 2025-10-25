<script lang="ts">
	interface Props {
		text?: string;
	}

	let { text = 'or' }: Props = $props();
</script>

<div class="flex items-center gap-4 w-full">
	<div class="flex-1 border-t border-border"></div>
	<span class="text-text-muted text-sm">{text}</span>
	<div class="flex-1 border-t border-border"></div>
</div>

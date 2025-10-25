<script lang="ts">
	import { cn } from "$lib/utils/cn";
	import { messageVariants, type MessageVariant } from "$lib/utils/styles";

	interface Props {
		text: string;
		variant?: MessageVariant;
	}

	let { text, variant = "default" }: Props = $props();
</script>

<p class={cn(messageVariants[variant])}>{text}</p>

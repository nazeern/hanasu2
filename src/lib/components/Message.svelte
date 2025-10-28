<script lang="ts">
	import { cn } from "$lib/utils/cn";
	import { messageVariants, type MessageVariant } from "$lib/utils/styles";

	interface Props {
		class?: string;
		text: string;
		variant?: MessageVariant;
	}

	let { class: className, text, variant = "default" }: Props = $props();
</script>

<p class={cn(messageVariants[variant], className)}>{text}</p>

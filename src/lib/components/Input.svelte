<script lang="ts">
	import type { HTMLInputTypeAttribute } from "svelte/elements";

	interface Props {
		name: string;
		type: HTMLInputTypeAttribute;
		label: string;
	}

	let { name, type, label }: Props = $props();

	const id = `${name}-input`;
</script>

<div class="w-full flex flex-col gap-1">
	<label for={id}>{label}</label>
	<input class='p-1 border border-border rounded-lg bg-neutral-100' {name} {id} {type} />
</div>

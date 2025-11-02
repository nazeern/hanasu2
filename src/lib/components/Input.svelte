<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";

	interface Props extends HTMLInputAttributes {
		name: string;
		type: HTMLInputAttributes['type'];
		label?: string;
		value?: string;
	}

	let { name, type, label, value = $bindable(''), ...rest }: Props = $props();

	const id = `${name}-input`;
</script>

{#if label}
	<div class="w-full flex flex-col gap-1">
		<label for={id}>{label}</label>
		<input
			class='p-1 border border-border rounded-lg bg-neutral-100'
			bind:value
			{name}
			{id}
			{type}
			{...rest}
		/>
	</div>
{:else}
	<input
		class='p-1 border border-border rounded-lg bg-neutral-100'
		bind:value
		{name}
		{id}
		{type}
		{...rest}
	/>
{/if}

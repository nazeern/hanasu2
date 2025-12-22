<script lang="ts">
	import type { Definition } from '$lib/dictionary.svelte';

	interface Props {
		definition: Definition;
		index: number;
		hideWord?: boolean;
	}

	let { definition, index, hideWord = false }: Props = $props();
</script>

<div class="w-full">
	<p class="text-xl mb-1 break-all">
		<span class="font-semibold text-neutral-600">{index + 1}.</span>
		{definition.meanings}
	</p>
	<p class="w-fit bg-neutral-300 text-sm px-2 rounded-full mb-1 break-all max-w-full">
		{definition.tags}
	</p>
	{#if !hideWord}
		<div class="ml-4 font-semibold italic text-neutral-600">
			<p class="break-all">{definition.example_en}</p>
			<p class="break-all">{definition.example_ja}</p>
		</div>
	{/if}
</div>

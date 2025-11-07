<script lang="ts">
	import Skeleton from '$lib/components/Skeleton.svelte';
	import XMark from '$lib/icons/XMark.svelte';

	interface Props {
		word: string;
		entryCount: number;
		onClose: () => void;
	}

	let { word, entryCount, onClose }: Props = $props();
</script>

<div class="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
	{#if word}
		<p class="text-lg font-semibold">
			{word}
			{#if entryCount}
				<span class="text-sm text-gray-500 font-normal">
					({entryCount} {entryCount === 1 ? 'entry' : 'entries'})
				</span>
			{/if}
		</p>
	{:else}
		<div class="w-48">
			<Skeleton lines={1} />
		</div>
	{/if}

	<button
		class="text-gray-500 hover:text-gray-700 transition-colors"
		onclick={onClose}
		aria-label="Close"
	>
		<XMark class="w-6 h-6" />
	</button>
</div>

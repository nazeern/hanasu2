<script lang="ts">
	import { ja_tags, type TagInfo } from '$lib/constants';
	import InformationCircle from '$lib/icons/InformationCircle.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		tag: string;
	}

	let { tag }: Props = $props();

	const tagInfo = ja_tags.find((info: TagInfo) => info.code === tag);
</script>

{#if tagInfo}
	<div class={cn('flex items-center gap-1 rounded-full px-2', tagInfo.color)}>
		<p class="text-white text-sm">{tagInfo.displayName}</p>
		<Tooltip class='flex justify-center items-center' text={tagInfo.desc}>
			<InformationCircle class="size-4 text-white"/>
		</Tooltip>
	</div>
{/if}

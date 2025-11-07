<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		isSaved: boolean;
		isSaving: boolean;
		onSave: () => void;
	}

	let { isSaved, isSaving, onSave }: Props = $props();
</script>

<button
	class={cn(
		'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
		'disabled:opacity-50 disabled:cursor-not-allowed',
		isSaved ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-blue-500 text-white hover:bg-blue-600'
	)}
	onclick={onSave}
	disabled={isSaving}
>
	{#if isSaving}
		{isSaved ? 'Removing...' : 'Saving...'}
	{:else}
		{isSaved ? 'Remove' : 'Save'}
	{/if}
</button>

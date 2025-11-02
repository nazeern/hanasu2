<script lang="ts">
	import { langInfoList, type LangInfo } from '$lib/constants';
	import { onMount } from 'svelte';
	import Message from './Message.svelte';
	import Container from './Container.svelte';
	import ChevronUp from '$lib/icons/ChevronUp.svelte';
	import ChevronDown from '$lib/icons/ChevronDown.svelte';
	import Button from './Button.svelte';
	import { enhance } from '$app/forms';
	import { cn } from '$lib/utils/cn';
	import Skeleton from './Skeleton.svelte';

	interface Props {
		langInfo?: LangInfo;
	}

	let { langInfo }: Props = $props();
	let dropdownOpen = $state(false);
	let loading = $state(false);

	function handleSubmit() {
		loading = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			loading = false;
			dropdownOpen = false;
		};
	}

	let buttonRef: HTMLButtonElement;
	function handleClickOutside(event: MouseEvent) {
		if (buttonRef && !buttonRef.contains(event.target as Node)) {
			dropdownOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<button class="relative" bind:this={buttonRef} onclick={() => (dropdownOpen = !dropdownOpen)}>
	{#if loading}
		<Skeleton class='w-8' />
	{:else}
		<div class="pointer-events-none flex items-center gap-1">
			<Message class="text-2xl" text={langInfo?.emoji ?? ''} />
			{#if dropdownOpen}
				<ChevronUp />
			{:else}
				<ChevronDown />
			{/if}
		</div>
	{/if}
	{#if dropdownOpen}
		<Container class="absolute top-13 -right-3" onclick={(e) => e.stopPropagation()}>
			<form method="POST" action="/?/updateLanguage" use:enhance={handleSubmit}>
				{#each langInfoList as lang}
					<Button
						variant="menu"
						type="submit"
						name="lang"
						value={lang.code}
						class={cn('w-full flex gap-1', langInfo?.code === lang.code && 'bg-neutral-50')}
					>
						<Message class="text-xl" text={lang.emoji} />
						{lang.displayName}
					</Button>
				{/each}
			</form>
		</Container>
	{/if}
</button>

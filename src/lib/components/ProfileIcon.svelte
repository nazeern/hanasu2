<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import Button from './Button.svelte';
	import Container from './Container.svelte';
	import { onMount } from 'svelte';

	interface Props {
		class?: string;
		userInitial: string;
		userEmail: string;
		isPremium?: boolean;
	}
	let { class: className, userInitial, userEmail, isPremium = false }: Props = $props();

	let dropdownOpen = $state(false);

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

<button
	bind:this={buttonRef}
	onclick={() => (dropdownOpen = !dropdownOpen)}
	class={cn(
		'relative flex items-center justify-center size-8 bg-primary-600 rounded-full',
		className
	)}
>
	<p class="text-white">{userInitial}</p>
	{#if dropdownOpen}
		<Container class="absolute top-13 -right-3" onclick={(e)=>e.stopPropagation()}>
			<div class="px-4 py-3 text-left border-b border-border">
				<div class="text-text-secondary mb-2">{userEmail}</div>
				<span
					class={cn(
						'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
						isPremium
							? 'bg-primary-100 text-primary-700'
							: 'bg-neutral-100 text-neutral-700'
					)}
				>
					{isPremium ? 'PREMIUM' : 'FREE'}
				</span>
			</div>
			<a href="/api/portal" class="block">
				<Button class='w-48 text-left' variant="menu">Subscriptions</Button>
			</a>
			<form method="POST" action="/logout">
				<Button class='w-48 text-left' variant="menu">Logout</Button>
			</form>
		</Container>
	{/if}
</button>

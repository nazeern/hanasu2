<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import Button from './Button.svelte';
	import Container from './Container.svelte';
	import { onMount } from 'svelte';

	interface Props {
		class?: string;
		userInitial: string;
	}
	let { class: className, userInitial }: Props = $props();

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

			<form method="POST" action="/logout">
				<Button class='w-48 text-left' variant="menu">Logout</Button>
			</form>
		</Container>
	{/if}
</button>

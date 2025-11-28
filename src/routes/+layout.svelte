<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import UnauthNavbar from '$lib/components/UnauthNavbar.svelte';
	import { ProgressBar } from '@prgm/sveltekit-progress-bar';

	let { data, children } = $props();
	let { supabase, user } = $derived(data);

	onMount(() => {
		const { data: authData } = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => authData.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ProgressBar
	color="#2563eb"
	zIndex={100}
	minimum={0.16}
	maximum={0.95}
	intervalTime={300}
	settleTime={800}
/>

<div class="h-screen flex flex-col">
	{#if user}
		<Navbar {...data} />
	{:else}
		<UnauthNavbar />
	{/if}
	<div class="flex-1">
		{@render children?.()}
	</div>
</div>

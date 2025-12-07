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
	<!-- Canny SDK -->
	<script>
		!function(w,d,i,s){function l(){if(!d.getElementById(i)){var f=d.getElementsByTagName(s)[0],e=d.createElement(s);e.type="text/javascript",e.async=!0,e.src="https://canny.io/sdk.js",f.parentNode.insertBefore(e,f)}}if("function"!=typeof w.Canny){var c=function(){c.q.push(arguments)};c.q=[],w.Canny=c,"complete"===d.readyState?l():w.attachEvent?w.attachEvent("onload",l):w.addEventListener("load",l,!1)}}(window,document,"canny-jssdk","script");
	</script>
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

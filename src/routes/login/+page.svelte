<script lang="ts">
	import Welcome from './Welcome.svelte';
	import LoginForm from './LoginForm.svelte';
	import OAuth from './OAuth.svelte';
	import Divider from '$lib/components/Divider.svelte';

	let { form } = $props();
</script>

<svelte:head>
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<div class='flex items-center justify-center w-full h-screen'>
	<div class="flex flex-col items-center gap-4">
		<Welcome />
		<OAuth />
		<Divider />
		<LoginForm {form} />
		<p>Need an account? <a href="/signup" aria-label="Link to Signup Page">Sign up here</a></p>
	</div>
</div>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_TURNSTILE_SITEKEY } from '$env/static/public';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { form } = $props();
	let loading = $state(false)
	const handleSubmit: SubmitFunction = () => {
		loading = true
		return async ({ update }) => {
			update()
			loading = false
		}
	}
</script>

<svelte:head>
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<form use:enhance={handleSubmit} method="POST" action="?/signup" class="row flex flex-center">
	<div class="col-6 form-widget">
		<h1>LOGIN PAGE</h1>
		<div>
			<label for="email-input">Email</label>
			<input name="email" id="email-input" type="email" />
		</div>
		<div>
			<label for="password-input">Password</label>
			<input name="password" id="password-input" type="password" />
		</div>
		<div class="cf-turnstile" data-sitekey={PUBLIC_TURNSTILE_SITEKEY}></div>
		<button>{loading ? 'Loading...' : 'Log In'}</button>
		{#if form?.error}
			<p>{form.error}</p>
		{/if}
	</div>
</form>

<form method="POST" action="?/googleSignIn" class="row flex flex-center">
	<div class="col-6 form-widget">
		<button>Continue with Google</button>
	</div>
</form>

<p>Need an account? <a href="/signup" aria-label="Link to Signup Page">Sign up here</a></p>

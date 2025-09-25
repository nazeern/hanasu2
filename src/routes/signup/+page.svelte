<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_TURNSTILE_SITEKEY } from '$env/static/public';
	import type { SubmitFunction } from '@sveltejs/kit';
	import langInfoList from '$lib/constants';

	let { form } = $props();
	let loading = $state(false);
	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			update();
			loading = false;
		};
	};
</script>

<svelte:head>
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<form use:enhance={handleSubmit} method="POST" action="?/signup" class="row flex flex-center">
	<div class="col-6 form-widget">
		<h1>SIGN UP PAGE</h1>
		{#if form?.message}
			<p>{form.message}</p>
		{/if}
		<div>
			<label for="email-input">Email</label>
			<input name="email" id="email-input" type="email" />
		</div>
		<div>
			<label for="password-input">Password</label>
			<input name="password" id="password-input" type="password" />
		</div>
		<div>
			<select name="lang" id="lang-input">
				{#each langInfoList as langInfo}
					<option value={langInfo.code}>{langInfo.displayName} {langInfo.emoji}</option>
				{/each}
			</select>
		</div>
		<div>
			<label for="name-input">Preferred Name</label><input
				name="name"
				id="name-input"
				type="text"
			/>
		</div>
		<div class="cf-turnstile" data-sitekey={PUBLIC_TURNSTILE_SITEKEY}></div>
		<button>{loading ? 'Loading...' : 'Sign Up'}</button>
		{#if form?.error}
			<p>{form.error}</p>
		{/if}
	</div>
</form>

<p>Already have an account? <a href="/login" aria-label="Link to Login Page">Login here</a></p>

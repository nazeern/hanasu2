<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_TURNSTILE_SITEKEY } from '$env/static/public';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { langInfoList } from '$lib/constants';
	import Welcome from './Welcome.svelte';
	import OAuth from './OAuth.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import SignupForm from './SignupForm.svelte';

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

<div class="flex items-center justify-center w-full h-screen">
	<div class="w-96 flex flex-col items-center gap-4">
		<Welcome />
		<OAuth />
		<Divider />
		<SignupForm {form} />
		<p class="w-full text-left">
			Already have an account? <a
				href="/login"
				aria-label="Link to Login Page"
				class="font-bold text-primary-600">Log in here</a
			>
		</p>
	</div>
</div>

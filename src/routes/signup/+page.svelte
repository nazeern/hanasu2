<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
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

<div class="flex items-start justify-center w-full min-h-full overflow-y-auto py-4">
	<div class="w-96 p-4 flex flex-col items-center gap-4">
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
		<p class="mt-8 text-xs text-text-secondary text-center">
			By signing up, you agree to our
			<a href="/terms" class="text-primary-600 hover:text-primary-700 underline" target="_blank"
				>Terms</a
			>
			and
			<a href="/privacy" class="text-primary-600 hover:text-primary-700 underline" target="_blank"
				>Privacy Policy</a
			>.
		</p>
	</div>
</div>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_TURNSTILE_SITEKEY } from '$env/static/public';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Message from '$lib/components/Message.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	interface Props {
		form?: { error?: string } | null;
	}

	let { form }: Props = $props();

	let loading = $state(false);
	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			update();
			loading = false;
		};
	};
</script>

<form use:enhance={handleSubmit} method="POST" action="?/signup" class="row flex flex-center">
	<div class="flex flex-col gap-4">
		<Input name="email" type="email" label="Email" />
		<Input name="password" type="password" label="Password" />
		<div class="cf-turnstile" data-sitekey={PUBLIC_TURNSTILE_SITEKEY}></div>
		<Button class="w-full" variant="primary">
			{loading ? 'Loading...' : 'Log In'}
		</Button>
		{#if form?.error}
			<Message text={form.error} variant="warning" />
		{/if}
	</div>
</form>

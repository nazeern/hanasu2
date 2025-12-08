<script lang="ts">
	import { onMount } from 'svelte';
	import { Chat } from '../../routes/chat/chat-state.svelte';
	import { Dictionary } from '$lib/dictionary.svelte';
	import ChatMessages from '../../routes/chat/ChatMessages.svelte';
	import DictionaryDrawer from '../../routes/chat/DictionaryDrawer.svelte';
	import Button from '$lib/components/Button.svelte';
	import Container from '$lib/components/Container.svelte';
	import Message from '$lib/components/Message.svelte';
	import Spinner from '$lib/icons/Spinner.svelte';
	import { enhance } from '$app/forms';

	interface Props {
		onback: () => void;
		selectedProficiency: string;
		selectedFrequency: string;
	}

	let { onback, selectedProficiency, selectedFrequency }: Props = $props();

	// Generate temporary session ID for onboarding demo
	const tempSessionId = crypto.randomUUID();
	const chat = new Chat('ja', true, '', tempSessionId);
	const dictionary = new Dictionary('ja');
	let showHint = $state(true);
	let isSubmitting = $state(false);

	onMount(() => {
		chat.connect();
		return () => {
			chat.close();
		};
	});
</script>

<div class="text-center mb-4 md:mb-8">
	<Message text="Try it out!" class="mb-4 text-3xl" />
	<p class="text-lg text-text-secondary">Experience the features</p>
</div>

{#if showHint}
	<Container class="mb-4 bg-blue-50 border-blue-200">
		<div class="flex justify-between items-start gap-4">
			<div class="flex-1">
				<h4 class="font-semibold text-text-primary mb-2">Quick Tips:</h4>
				<ul class="text-text-secondary space-y-1">
					<li>• Tap any word to look it up in the dictionary</li>
					<li>• Double-tap a message to see the translation</li>
					<li>• Try saving a word to your vocabulary</li>
				</ul>
			</div>
			<button
				onclick={() => (showHint = false)}
				class="text-text-secondary hover:text-text-primary"
			>
				Dismiss
			</button>
		</div>
	</Container>
{/if}

<div class="bg-white rounded-2xl border border-primary-200 shadow-lg mb-4 overflow-hidden h-[320px]">
	<div class="h-full flex flex-col">
		<ChatMessages {chat} {dictionary} />
	</div>
</div>

<form
	id="onboarding-form"
	method="POST"
	action="?/complete"
	use:enhance={() => {
		isSubmitting = true;
		return async ({ update }) => {
			await update();
			isSubmitting = false;
		};
	}}
>
	<input type="hidden" name="proficiency" value={selectedProficiency} />
	<input type="hidden" name="practice_frequency" value={selectedFrequency} />

	<div class="flex gap-4 justify-center pb-2">
		<Button type="button" variant="secondary" onclick={onback} disabled={isSubmitting}>
			Back
		</Button>
		<Button type="submit" variant="primary" class="px-8" disabled={isSubmitting}>
			{#if isSubmitting}
				<span class="flex items-center gap-2">
					<Spinner class="w-5 h-5" />
					Starting...
				</span>
			{:else}
				Start Learning
			{/if}
		</Button>
	</div>
</form>

<DictionaryDrawer {dictionary} />

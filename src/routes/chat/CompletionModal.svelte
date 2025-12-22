<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import type { Chat } from './chat-state.svelte';

	interface Props {
		chat: Chat;
	}

	let { chat }: Props = $props();

	const messageCount = $derived(chat.messages.length);

	const formattedDuration = $derived(() => {
		const seconds = Math.floor(chat.sessionDuration / 1000);
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		if (minutes > 0) {
			return `${minutes}m ${remainingSeconds}s`;
		}
		return `${seconds}s`;
	});

	const formattedAvgResponse = $derived(() => {
		if (!chat.avgResponseDurationMs) return 'N/A';
		const ms = Math.round(chat.avgResponseDurationMs);
		if (ms < 1000) return `${ms}ms`;
		const seconds = (ms / 1000).toFixed(1);
		return `${seconds}s`;
	});

	const handleReturnToDashboard = () => {
		goto('/dashboard');
	};
</script>

<div
	class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
	onclick={handleReturnToDashboard}
	onkeydown={(e) => e.key === 'Enter' && handleReturnToDashboard()}
	role="button"
	tabindex="-1"
	aria-label="Complete session"
>
	<div
		class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		role="dialog"
		tabindex="-1"
	>
		<div class="mb-6">
			<h2 class="text-3xl font-bold text-gray-800 mb-2">Great Work!</h2>
			<p class="text-gray-600 mb-1">You completed a conversation session</p>
			<p class="text-sm text-gray-500 italic break-all">"{chat.prompt}"</p>
		</div>

		<div class="space-y-4 mb-8">
			<div class="bg-gray-50 rounded-lg p-4">
				<p class="text-sm text-gray-600 mb-1">Session Duration</p>
				<p class="text-3xl font-bold text-purple-600">{formattedDuration()}</p>
			</div>

			<div class="bg-gray-50 rounded-lg p-4">
				<p class="text-sm text-gray-600 mb-1">Total Responses</p>
				<p class="text-3xl font-bold text-blue-600">{messageCount}</p>
			</div>

			<div class="bg-gray-50 rounded-lg p-4">
				<p class="text-sm text-gray-600 mb-1">Avg Response Time</p>
				<p class="text-3xl font-bold text-green-600">{formattedAvgResponse()}</p>
			</div>
		</div>

		<Button onclick={handleReturnToDashboard} variant="primary" class="w-full">
			Return to Dashboard
		</Button>
	</div>
</div>

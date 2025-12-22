<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { Chat } from './chat-state.svelte';

	interface Props {
		chat: Chat;
	}

	let { chat }: Props = $props();
</script>

{#if chat.state === 'connected'}
	<div class="absolute bottom-4 right-4">
		<Button onclick={() => chat.close()} variant="primary" class="shadow-lg">
			Complete
		</Button>
	</div>
{/if}

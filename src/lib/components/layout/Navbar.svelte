<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Content from '$lib/components/ui/Content.svelte';
	import type { LayoutData } from '../../../routes/$types';

	let { data }: { data: LayoutData } = $props();
	let { session, userInitial } = $derived(data);

	let dropdownOpen = $state(false);
</script>

<nav class="border-b border-border bg-background shadow-sm">
	<div class="mx-auto flex max-w-7xl items-center justify-end px-4 py-3">
		<div class="relative">
			<!-- User avatar button -->
			<button
				onclick={() => (dropdownOpen = !dropdownOpen)}
				class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-base font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
				aria-expanded={dropdownOpen}
				aria-haspopup="true"
			>
				{userInitial}
			</button>

			{#if dropdownOpen}
				<!-- Backdrop -->
				<button
					onclick={() => (dropdownOpen = false)}
					class="fixed inset-0 z-10"
					aria-label="Close dropdown"
					tabindex="-1"
				></button>

				<!-- Dropdown menu -->
				<Card class="absolute right-0 z-20 mt-2 w-56">
					<!-- User email -->
					<Content bordered>
						<p class="truncate text-sm text-text-secondary">{session?.user?.email}</p>
					</Content>

					<!-- Logout button -->
					<Content class="p-2">
						<form method="POST" action="/logout">
							<Button type="submit" variant="menu" size="sm" fullWidth>
								Log out
							</Button>
						</form>
					</Content>
				</Card>
			{/if}
		</div>
	</div>
</nav>

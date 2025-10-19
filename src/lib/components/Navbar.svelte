<script lang="ts">
	import { goto } from '$app/navigation';
	import type { LayoutData } from '../../routes/$types';

	let { data }: { data: LayoutData } = $props();
	let { supabase, session, userInitial } = $derived(data);

	let dropdownOpen = $state(false);

	async function signOut() {
		await supabase.auth.signOut();
		goto('/login');
	}
</script>

<nav>
	<button onclick={() => (dropdownOpen = !dropdownOpen)}>
		{userInitial}
	</button>

	{#if dropdownOpen}
		<button onclick={() => (dropdownOpen = false)} aria-label="Close dropdown"></button>
		<div>
			<p>{session?.user?.email}</p>
			<button onclick={signOut}>Log out</button>
		</div>
	{/if}
</nav>

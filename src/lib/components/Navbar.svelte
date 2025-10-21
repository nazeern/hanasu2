<script lang="ts">
	import type { LayoutData } from '../../routes/$types';

	let { data }: { data: LayoutData } = $props();
	let { supabase, session, userInitial } = $derived(data);

	let dropdownOpen = $state(false);
</script>

<nav>
	<button onclick={() => (dropdownOpen = !dropdownOpen)}>
		{userInitial}
	</button>

	{#if dropdownOpen}
		<button onclick={() => (dropdownOpen = false)} aria-label="Close dropdown"></button>
		<div>
			<p>{session?.user?.email}</p>
			<form method="POST" action="/logout">
				<button type="submit">Log out</button>
			</form>
		</div>
	{/if}
</nav>

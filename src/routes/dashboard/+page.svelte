<script lang="ts">
	let { data, form } = $props()
	let { email, profile } = $derived(data)
</script>

{#if profile && email}
	<p>{email}</p>
	<p>{profile.lang}</p>
	<p>{profile.name}</p>
{:else}
	<p>Failed to load user profile</p>
{/if}

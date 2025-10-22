<script lang="ts">
	let { data, form } = $props()
	let { email, profile, prompts } = $derived(data)
</script>

{#if profile && email}
	<p>{email}</p>
	<p>{profile.lang}</p>
	<p>{profile.name}</p>

	<h2>Start a conversation</h2>
	{#each prompts as prompt}
		<a href="/chat?prompt={encodeURIComponent(prompt)}">
			<button>{prompt}</button>
		</a>
	{/each}
{:else}
	<p>Failed to load user profile</p>
{/if}

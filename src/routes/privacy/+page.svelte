<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Privacy Policy - Hanasu</title>
	<meta name="description" content="Privacy policy for Hanasu language learning platform" />
</svelte:head>

<div class="mx-auto max-w-4xl px-6 py-12">
	<article class="markdown-content">
		{@html data.content}
	</article>
</div>

<style>
	.markdown-content {
		color: var(--color-text-primary);
		line-height: 1.75;
	}

	.markdown-content :global(h1) {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 2rem;
		margin-top: 0;
		color: var(--color-text-primary);
		line-height: 1.2;
	}

	.markdown-content :global(h2) {
		font-size: 2rem;
		font-weight: 600;
		margin-top: 3rem;
		margin-bottom: 1rem;
		color: var(--color-text-primary);
		line-height: 1.3;
	}

	.markdown-content :global(h3) {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 0.75rem;
		color: var(--color-text-primary);
		line-height: 1.4;
	}

	.markdown-content :global(p) {
		margin-bottom: 1rem;
		color: var(--color-text-primary);
	}

	.markdown-content :global(ul) {
		margin-bottom: 1rem;
		margin-left: 1.5rem;
		list-style-type: disc;
	}

	.markdown-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.markdown-content :global(strong) {
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.markdown-content :global(a) {
		color: var(--color-primary-600);
		text-decoration: underline;
	}

	.markdown-content :global(a:hover) {
		color: var(--color-primary-700);
	}
</style>

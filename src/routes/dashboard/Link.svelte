<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		route: string;
		children?: Snippet;
	}

	let { route, children }: Props = $props();
</script>

<a
	href={route}
	class="font-semibold w-92 bg-primary-400 hover:bg-primary-500 active:bg-primary-600 rounded-full px-6 py-3 mb-8 no-underline text-white text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
>
	{@render children?.()}
</a>

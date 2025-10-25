<script lang="ts">
	import type { LayoutData } from '../../routes/$types';
	import Logo from './Logo.svelte';
	import ProfileIcon from './ProfileIcon.svelte';

	interface Props {
		data: LayoutData;
	}

	let { data }: Props = $props();
</script>

<nav class="w-full bg-background border-b border-border">
	<div class="flex justify-between max-w-7xl mx-auto p-4">
		<Logo />
		<ProfileIcon userInitial={data.userInitial} />
	</div>
</nav>

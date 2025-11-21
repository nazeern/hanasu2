<script lang="ts">
	import type { LangInfo } from '$lib/constants';
	import LanguageIcon from './LanguageIcon.svelte';
	import Logo from './Logo.svelte';
	import ProfileIcon from './ProfileIcon.svelte';

	interface Props {
		userInitial: string;
		userEmail: string;
		langInfo?: LangInfo;
	}

	let { userInitial, userEmail, langInfo }: Props = $props();
</script>

<nav class="w-full bg-background border-b border-border">
	<div class="flex justify-between max-w-7xl mx-auto p-4">
		<Logo />
		<div class="flex items-center gap-4">
			<LanguageIcon {langInfo} />
			<ProfileIcon {userInitial} {userEmail} />
		</div>
	</div>
</nav>

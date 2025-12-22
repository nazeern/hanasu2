<script lang="ts">
	import type { LangInfo } from '$lib/constants';
	import LanguageIcon from './LanguageIcon.svelte';
	import Logo from './Logo.svelte';
	import ProfileIcon from './ProfileIcon.svelte';
	import FeedbackButton from './FeedbackButton.svelte';

	interface Props {
		userInitial: string;
		userEmail: string;
		langInfo?: LangInfo;
		subscriptionStatus?: {
			isPremium: boolean;
			subscription: any;
			subscriptions: any[];
			customer: any;
		};
	}

	let { userInitial, userEmail, langInfo, subscriptionStatus }: Props = $props();
	let isPremium = $derived(subscriptionStatus?.isPremium ?? false);
</script>

<nav class="w-full bg-background border-b border-border">
	<div class="flex justify-between max-w-7xl mx-auto p-4">
		<Logo />
		<div class="flex items-center gap-4">
			<FeedbackButton />
			<ProfileIcon {userInitial} {userEmail} {isPremium} />
		</div>
	</div>
</nav>

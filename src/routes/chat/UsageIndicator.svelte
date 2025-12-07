<script lang="ts">
	import type { UsageStats } from '$lib/server/usage';
	import Container from '$lib/components/Container.svelte';
	import Button from '$lib/components/Button.svelte';

	interface Props {
		usageCheck: UsageStats;
		mode: 'warning' | 'blocking';
		limitReached: 'daily' | 'monthly';
		remaining: number;
		numMessages: number;
	}

	let { usageCheck, mode, limitReached, remaining, numMessages }: Props = $props();

	// Warning banner can be dismissed
	let dismissed = $state(false);

	// Determine which usage stats to display
	const relevantUsage = $derived(
		limitReached === 'daily' ? usageCheck.daily : usageCheck.monthly
	);
	const period = $derived(limitReached === 'daily' ? 'today' : 'this month');
</script>

{#if mode === 'warning' && !dismissed}
	<!-- Warning Banner (80-99% usage) -->
	<div class="w-full bg-primary-100 border-b border-primary-300 py-3">
		<div class="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
			<div class="flex items-center gap-3 flex-1 min-w-0">
				<span class="text-2xl flex-shrink-0">✨</span>
				<div class="flex-1 min-w-0">
					<p class="text-sm font-medium text-primary-900">
						You're on a roll! Only <span class="font-bold">{remaining}</span> messages
						left {period}.
					</p>
					<p class="text-xs text-primary-800 mt-0.5">
						<a href="/pricing" class="underline hover:no-underline font-medium"
							>Try Premium free for 14 days</a
						> for unlimited conversations + AI grammar tips
					</p>
				</div>
			</div>
			<button
				onclick={() => (dismissed = true)}
				class="flex-shrink-0 text-primary-700 hover:text-primary-900 transition-colors p-1"
				aria-label="Dismiss"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	</div>
{:else if mode === 'blocking'}
	<!-- Blocking Overlay (100% usage) -->
	<div class="h-full flex items-center justify-center p-8 bg-gray-50/50 backdrop-blur-[2px]">
		<Container class="max-w-md text-center shadow-lg">
			<h2 class="text-xl font-bold text-text-primary mb-2">
				You've reached your {limitReached === 'daily' ? 'daily' : 'monthly'} limit ✨
			</h2>
			<p class="text-text-secondary mb-4">
				You've practiced with <span class="font-semibold">{relevantUsage.used + numMessages}</span> conversation exchanges {period}
				— great progress! Keep the momentum going with unlimited practice.
			</p>

			<!-- Premium Features -->
			<div class="bg-primary-50 rounded-lg p-4 mb-6 text-left">
				<p class="text-sm font-semibold text-primary-900 mb-3">With Premium, you can:</p>
				<ul class="space-y-2 text-sm text-primary-800">
					<li class="flex items-start gap-2">
						<span class="text-primary-600 mt-0.5">✓</span>
						<span>Practice conversations anytime, without limits</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-primary-600 mt-0.5">✓</span>
						<span>Get AI-powered grammar tips for every message</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-primary-600 mt-0.5">✓</span>
						<span>Track your progress with detailed analytics</span>
					</li>
				</ul>
			</div>

			<!-- Social Proof -->
			<p class="text-xs text-text-secondary mb-6">
				Join 1,000+ learners mastering Japanese with unlimited practice
			</p>

			<!-- CTA -->
			<div class="space-y-3">
				<a href="/pricing" class="block">
					<Button variant="primary" class="w-full text-lg py-3">
						Start My Free Trial
					</Button>
				</a>
				<p class="text-xs text-text-muted">
					14 days free • Only $0.23/day after • Cancel anytime
				</p>
			</div>
		</Container>
	</div>
{/if}

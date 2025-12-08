<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		planName: string;
		price: string;
		billingPeriod: string;
		features: string[];
		ctaText: string;
		ctaHref: string;
		highlighted?: boolean;
		badge?: string;
		badgeColor?: 'primary' | 'success';
		savingsText?: string;
		class?: string;
	}

	let {
		planName,
		price,
		billingPeriod,
		features,
		ctaText,
		ctaHref,
		highlighted = false,
		badge,
		badgeColor = 'primary',
		savingsText,
		class: className
	}: Props = $props();

	const badgeColorClasses = {
		primary: 'bg-primary-600 text-white',
		success: 'bg-success-600 text-white'
	};
</script>

<div
	class={cn(
		'relative flex flex-col h-full rounded-2xl p-8 transition-all duration-300',
		highlighted
			? 'bg-primary-50 border-2 border-primary-600 md:scale-105 md:-translate-y-2 shadow-xl'
			: 'bg-white border border-border shadow-lg hover:shadow-xl',
		className
	)}
>
	<!-- Badge -->
	{#if badge}
		<div
			class={cn(
				'absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap',
				badgeColorClasses[badgeColor]
			)}
		>
			{badge}
		</div>
	{/if}

	<!-- Plan Name -->
	<h3 class="text-2xl font-bold font-system text-text-primary mb-2 text-center">{planName}</h3>

	<!-- Price -->
	<div class="mb-6 text-center">
		<div class="flex items-baseline justify-center gap-1">
			<span class="text-5xl font-bold font-system text-primary-600">{price}</span>
		</div>
		<p class="text-sm text-text-secondary mt-1">{billingPeriod}</p>
		{#if savingsText}
			<p class="text-sm font-semibold text-success-600 mt-2">{savingsText}</p>
		{/if}
	</div>

	<!-- CTA Button -->
	<div class="mb-6">
		<a href={ctaHref} class="block">
			<Button
				variant={highlighted ? 'primary' : 'secondary'}
				class="w-full text-center py-3 text-base font-semibold"
			>
				{ctaText}
			</Button>
		</a>
	</div>

	<!-- Features List -->
	<ul class="space-y-3 flex-grow">
		{#each features as feature}
			<li class="flex items-start gap-3">
				<svg
					class="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						d="M5 13l4 4L19 7"
					/>
				</svg>
				<span class="text-sm text-text-secondary leading-relaxed">{feature}</span>
			</li>
		{/each}
	</ul>
</div>

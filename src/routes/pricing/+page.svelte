<script lang="ts">
	import PricingCard from '$lib/components/pricing/PricingCard.svelte';
	import Button from '$lib/components/Button.svelte';

	const freePlanFeatures = [
		'15 conversations per month',
		'Vocabulary saving & review',
		'Basic dictionary access',
		'Progress tracking',
		'Spaced repetition system'
	];

	const premiumFeatures = [
		'Unlimited conversations',
		'AI-powered grammar tips',
		'Advanced dictionary with examples',
		'Full spaced repetition system',
		'Progress analytics & insights',
		'Priority support',
		'Export vocabulary lists'
	];

	const comparisonFeatures = [
		{
			category: 'Conversations',
			features: [
				{ name: 'Voice conversations with AI', free: true, premium: true },
				{ name: 'Conversations per month', free: '15', premium: 'Unlimited' },
				{ name: 'Real-time transcription', free: true, premium: true }
			]
		},
		{
			category: 'Learning Tools',
			features: [
				{ name: 'Vocabulary saving', free: true, premium: true },
				{ name: 'AI grammar tips', free: false, premium: true },
				{ name: 'Advanced dictionary', free: false, premium: true },
				{ name: 'Example sentences', free: false, premium: true }
			]
		},
		{
			category: 'Study Features',
			features: [
				{ name: 'Spaced repetition system', free: true, premium: true },
				{ name: 'Progress tracking', free: true, premium: true },
				{ name: 'Detailed analytics', free: false, premium: true },
				{ name: 'Export vocabulary', free: false, premium: true }
			]
		},
		{
			category: 'Support',
			features: [
				{ name: 'Community support', free: true, premium: true },
				{ name: 'Email support', free: false, premium: true },
				{ name: 'Priority support', free: false, premium: true }
			]
		}
	];
</script>

<svelte:head>
	<title>Pricing - Hanasu</title>
	<meta
		name="description"
		content="Choose the perfect plan to master Japanese. Start free or upgrade to Premium for unlimited conversations and advanced features."
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-primary-50 to-white">
	<!-- Hero Section -->
	<section class="container mx-auto px-4 py-16 md:py-24">
		<div class="max-w-4xl mx-auto text-center">
			<h1 class="text-4xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
				Choose Your <span class="text-primary-600">Learning Plan</span>
			</h1>
			<p class="text-xl text-text-secondary mb-4 max-w-2xl mx-auto">
				Start learning Japanese for free, or unlock unlimited conversations and advanced features
				with Premium.
			</p>
			<p class="text-sm text-text-muted">
				✓ No credit card required for free plan • ✓ 14-day free trial • ✓ Cancel anytime
			</p>
		</div>
	</section>

	<!-- Pricing Cards -->
	<section class="container mx-auto px-4 pb-16 md:pb-24">
		<div class="max-w-7xl mx-auto">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
				<!-- Free Plan -->
				<PricingCard
					planName="Free"
					price="$0"
					billingPeriod="Forever"
					features={freePlanFeatures}
					ctaText="Get Started"
					ctaHref="/signup"
				/>

				<!-- Monthly Premium (Highlighted) -->
				<PricingCard
					planName="Premium"
					price="$6.99"
					billingPeriod="per month"
					features={premiumFeatures}
					ctaText="Start Free Trial"
					ctaHref="/signup?plan=monthly"
					highlighted={true}
					badge="Most Popular"
					badgeColor="primary"
				/>

				<!-- Yearly Premium -->
				<PricingCard
					planName="Premium"
					price="$29.99"
					billingPeriod="per year"
					features={premiumFeatures}
					ctaText="Start Free Trial"
					ctaHref="/signup?plan=yearly"
					badge="Best Value"
					badgeColor="success"
					savingsText="Save $54/year (57% off)"
				/>
			</div>

			<!-- Trust Signal -->
			<div class="text-center mt-12">
				<p class="text-text-secondary text-base">
					All premium plans include a <span class="font-semibold text-text-primary"
						>14-day free trial</span
					>. No commitment required.
				</p>
			</div>
		</div>
	</section>

	<!-- Feature Comparison -->
	<section class="bg-white py-16 md:py-24 border-y border-border">
		<div class="container mx-auto px-4">
			<div class="max-w-5xl mx-auto">
				<div class="text-center mb-12">
					<h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
						Compare Plans & Features
					</h2>
					<p class="text-lg text-text-secondary">
						See exactly what's included in each plan
					</p>
				</div>

				<!-- Column Headers for Desktop -->
				<div class="hidden md:block mb-6">
					<div class="grid grid-cols-[2fr_1fr_1fr] gap-4 max-w-5xl mx-auto px-6">
						<div></div>
						<div class="text-center font-semibold text-text-primary">Free</div>
						<div class="text-center font-semibold text-primary-600">Premium</div>
					</div>
				</div>

				<div class="space-y-8">
					{#each comparisonFeatures as section}
						<div class="bg-neutral-50 rounded-xl p-6 md:p-8">
							<h3 class="text-xl font-bold text-text-primary mb-6 pb-3 border-b border-border">
								{section.category}
							</h3>
							<div class="space-y-4">
								{#each section.features as feature}
									<div
										class="grid grid-cols-[1fr_auto_auto] md:grid-cols-[2fr_1fr_1fr] gap-4 items-center"
									>
										<span class="text-sm md:text-base text-text-secondary">{feature.name}</span>
										<div class="text-center min-w-20">
											{#if typeof feature.free === 'boolean'}
												{#if feature.free}
													<svg
														class="w-6 h-6 text-success-600 mx-auto"
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
												{:else}
													<svg
														class="w-6 h-6 text-neutral-400 mx-auto"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2.5"
															d="M6 18L18 6M6 6l12 12"
														/>
													</svg>
												{/if}
											{:else}
												<span class="text-sm font-medium text-text-primary">{feature.free}</span>
											{/if}
										</div>
										<div class="text-center min-w-20">
											{#if typeof feature.premium === 'boolean'}
												{#if feature.premium}
													<svg
														class="w-6 h-6 text-success-600 mx-auto"
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
												{:else}
													<svg
														class="w-6 h-6 text-neutral-400 mx-auto"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2.5"
															d="M6 18L18 6M6 6l12 12"
														/>
													</svg>
												{/if}
											{:else}
												<span class="text-sm font-medium text-primary-600">{feature.premium}</span
												>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- FAQ Section -->
	<section class="container mx-auto px-4 py-16 md:py-24">
		<div class="max-w-3xl mx-auto">
			<div class="text-center mb-12">
				<h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
					Frequently Asked Questions
				</h2>
			</div>

			<div class="space-y-6">
				<div class="bg-white border border-border rounded-xl p-6">
					<h3 class="text-lg font-semibold text-text-primary mb-2">
						What happens when I reach my free conversation limit?
					</h3>
					<p class="text-text-secondary">
						You can still access all your saved vocabulary and use the spaced repetition system. Your
						conversation limit resets at the beginning of each month, or you can upgrade to Premium
						for unlimited conversations.
					</p>
				</div>

				<div class="bg-white border border-border rounded-xl p-6">
					<h3 class="text-lg font-semibold text-text-primary mb-2">
						How does the 14-day free trial work?
					</h3>
					<p class="text-text-secondary">
						When you sign up for Premium, you get 14 days to try all features completely free. You
						won't be charged until after the trial period ends. Cancel anytime during the trial with
						no charges.
					</p>
				</div>

				<div class="bg-white border border-border rounded-xl p-6">
					<h3 class="text-lg font-semibold text-text-primary mb-2">
						Can I switch between plans?
					</h3>
					<p class="text-text-secondary">
						Yes! You can upgrade from Free to Premium anytime. If you're on Monthly Premium, you can
						switch to Yearly to save 57%. Downgrades take effect at the end of your current billing
						period.
					</p>
				</div>

				<div class="bg-white border border-border rounded-xl p-6">
					<h3 class="text-lg font-semibold text-text-primary mb-2">
						What payment methods do you accept?
					</h3>
					<p class="text-text-secondary">
						We accept all major credit cards (Visa, Mastercard, American Express, Discover) and debit
						cards. All payments are securely processed through Stripe.
					</p>
				</div>

				<div class="bg-white border border-border rounded-xl p-6">
					<h3 class="text-lg font-semibold text-text-primary mb-2">
						Can I cancel my subscription anytime?
					</h3>
					<p class="text-text-secondary">
						Absolutely. You can cancel your Premium subscription at any time from your account
						settings. You'll retain access until the end of your current billing period, and all your
						progress and vocabulary will be saved.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Final CTA -->
	<section class="container mx-auto px-4 pb-16 md:pb-24">
		<div class="max-w-3xl mx-auto">
			<div
				class="bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-2xl p-8 md:p-12 text-center"
			>
				<h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
					Ready to Master Japanese?
				</h2>
				<p class="text-lg text-text-secondary mb-8">
					Join thousands of learners having real conversations. Start free today.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<a href="/signup">
						<Button variant="primary" class="text-lg px-8 py-3">Start Learning Free</Button>
					</a>
					<a href="/">
						<Button variant="secondary" class="text-lg px-8 py-3">Learn More</Button>
					</a>
				</div>
				<p class="text-sm text-text-muted mt-6">
					Free forever • No credit card required • 14-day Premium trial available
				</p>
			</div>
		</div>
	</section>
</div>

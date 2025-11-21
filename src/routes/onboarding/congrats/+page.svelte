<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	let { data } = $props();

	const premiumFeatures = [
		{
			icon: '💬',
			title: 'Unlimited Conversations',
			description: 'Practice Japanese as much as you want, anytime'
		},
		{
			icon: '✨',
			title: 'AI-Powered Grammar Tips',
			description: 'Get instant feedback and corrections as you learn'
		},
		{
			icon: '📚',
			title: 'Advanced Dictionary',
			description: 'Access detailed definitions with real examples'
		},
		{
			icon: '📊',
			title: 'Progress Analytics',
			description: 'Track your improvement with detailed insights'
		},
		{
			icon: '🎯',
			title: 'Priority Support',
			description: 'Get help when you need it most'
		},
		{
			icon: '📥',
			title: 'Export Vocabulary',
			description: 'Download your vocabulary lists anytime'
		}
	];
</script>

<svelte:head>
	<title>Welcome to Premium - Hanasu</title>
	<meta
		name="description"
		content="Congratulations on joining Hanasu Premium! Start your Japanese learning journey today."
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-primary-50 via-secondary-50 to-white">
	<!-- Hero Section -->
	<section class="container mx-auto px-4 py-16 md:py-24">
		<div class="max-w-4xl mx-auto text-center">
			<!-- Success Icon -->
			<div class="mb-8">
				<div
					class="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-success-100 rounded-full"
				>
					<svg
						class="w-12 h-12 md:w-14 md:h-14 text-success-600"
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
				</div>
			</div>

			<!-- Main Heading -->
			<h1 class="text-4xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
				Welcome to <span class="text-primary-600">Premium!</span>
			</h1>

			<!-- Thank You Message -->
			<p class="text-xl md:text-2xl text-text-secondary mb-4">
				Thank you for joining, {data.userName}!
			</p>
			<p class="text-lg text-text-muted max-w-2xl mx-auto">
				You now have access to all premium features. Let's get you started on your Japanese
				learning journey.
			</p>
		</div>
	</section>

	<!-- Premium Features Grid -->
	<section class="container mx-auto px-4 pb-16 md:pb-24">
		<div class="max-w-5xl mx-auto">
			<h2 class="text-2xl md:text-3xl font-bold text-text-primary mb-8 text-center">
				Your Premium Features
			</h2>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
				{#each premiumFeatures as feature}
					<div class="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
						<div class="text-4xl mb-4">{feature.icon}</div>
						<h3 class="text-lg font-semibold text-text-primary mb-2">
							{feature.title}
						</h3>
						<p class="text-sm text-text-secondary">
							{feature.description}
						</p>
					</div>
				{/each}
			</div>

			<!-- CTA Section -->
			<div
				class="bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-2xl p-8 md:p-12 text-center"
			>
				<h3 class="text-2xl md:text-3xl font-bold text-text-primary mb-4">
					Ready to Start Learning?
				</h3>
				<p class="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
					Jump right in or take a quick tour to learn about all the features.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<a href="/dashboard">
						<Button variant="primary" class="text-lg px-8 py-3">
							Start Learning
						</Button>
					</a>
					<a href="/onboarding">
						<Button variant="secondary" class="text-lg px-8 py-3">
							Take a Quick Tour
						</Button>
					</a>
				</div>
			</div>
		</div>
	</section>
</div>

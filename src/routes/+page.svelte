<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Container from '$lib/components/Container.svelte';
	import DemoChat from '$lib/components/landing/DemoChat.svelte';
	import FeatureCard from '$lib/components/landing/FeatureCard.svelte';
	import HowItWorksStep from '$lib/components/landing/HowItWorksStep.svelte';
	import Testimonial from '$lib/components/landing/Testimonial.svelte';
</script>

<div class="min-h-screen bg-gradient-to-b from-primary-50 to-white">
	<!-- Hero Section -->
	<section class="container mx-auto px-4 py-16 md:py-24">
		<div class="max-w-4xl mx-auto text-center">
			<h1 class="tracking-tight text-4xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
				Learn Japanese Through <span class="text-primary-600">Natural Conversation</span>
			</h1>
			<p class="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
				Stop memorizing flashcards. Start having real conversations with AI and build vocabulary
				that actually sticks.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
				<a href="/signup">
					<Button variant="primary" class="text-lg px-8 py-3">Start Learning Free</Button>
				</a>
				<a href="#demo">
					<Button variant="secondary" class="text-lg px-8 py-3">Try Demo</Button>
				</a>
			</div>
			<p class="text-sm text-text-muted mt-4">
				No credit card required • Get started in 30 seconds
			</p>
		</div>
	</section>

	<!-- Stats Section -->
	<section class="bg-white py-12 border-y border-border">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
				<div>
					<div class="text-4xl font-bold text-primary-600 mb-2">500K+</div>
					<div class="text-text-secondary">Words Learned</div>
				</div>
				<div>
					<div class="text-4xl font-bold text-primary-600 mb-2">10,000+</div>
					<div class="text-text-secondary">Active Learners</div>
				</div>
				<div>
					<div class="text-4xl font-bold text-primary-600 mb-2">95%</div>
					<div class="text-text-secondary">Retention Rate</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Interactive Demo Section -->
	<section id="demo" class="container mx-auto px-4 py-16 md:py-24">
		<div class="max-w-5xl mx-auto">
			<div class="text-center mb-12">
				<h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">See How It Works</h2>
				<p class="text-lg text-text-secondary max-w-2xl mx-auto">
					Chat naturally, tap any word to see its meaning, and save vocabulary for later review.
					It's that simple.
				</p>
			</div>
			<DemoChat />
		</div>
	</section>

	<!-- How It Works Section -->
	<section class="bg-neutral-50 py-16 md:py-24">
		<div class="container mx-auto px-4">
			<div class="text-center mb-12">
				<h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">Your Learning Journey</h2>
				<p class="text-lg text-text-secondary">Master Japanese in three simple steps</p>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto justify-items-center">
				<HowItWorksStep
					number={1}
					title="Chat Naturally"
					description="Have real conversations about topics you care about. Our AI adapts to your level and interests."
				/>
				<HowItWorksStep
					number={2}
					title="Build Vocabulary"
					description="Tap any word to see its meaning and save it. Learn in context, not isolation."
				/>
				<HowItWorksStep
					number={3}
					title="Review & Master"
					description="Spaced repetition ensures you remember words long-term. Track your progress effortlessly."
				/>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="container mx-auto px-4 py-16 md:py-24">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
				Everything You Need to Succeed
			</h2>
			<p class="text-lg text-text-secondary">
				Powerful features that make learning feel effortless
			</p>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
			<FeatureCard
				title="AI Conversation Partner"
				description="Chat about any topic in Japanese. Get instant corrections and natural language feedback from an AI that understands context."
			>
				{#snippet icon()}
					<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
						/>
					</svg>
				{/snippet}
			</FeatureCard>

			<FeatureCard
				title="Integrated Dictionary"
				description="Tap any word to see its reading, meaning, and usage examples. No need to switch between apps or look things up separately."
			>
				{#snippet icon()}
					<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
						/>
					</svg>
				{/snippet}
			</FeatureCard>

			<FeatureCard
				title="Spaced Repetition System"
				description="Science-backed review timing ensures you remember vocabulary long-term. The algorithm optimizes your study schedule automatically."
			>
				{#snippet icon()}
					<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
						/>
					</svg>
				{/snippet}
			</FeatureCard>

			<FeatureCard
				title="Progress Tracking"
				description="Visualize your learning journey with detailed analytics. See your vocabulary growth, study streaks, and mastery levels."
			>
				{#snippet icon()}
					<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						/>
					</svg>
				{/snippet}
			</FeatureCard>

			<FeatureCard
				title="Contextual Learning"
				description="Learn words as they appear in real conversations, not isolated lists. Understand how vocabulary is actually used by native speakers."
			>
				{#snippet icon()}
					<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
				{/snippet}
			</FeatureCard>

			<FeatureCard
				title="Personalized Experience"
				description="The AI adapts to your level and interests. Talk about anime, business, travel, or whatever motivates you to keep learning."
			>
				{#snippet icon()}
					<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						/>
					</svg>
				{/snippet}
			</FeatureCard>
		</div>
	</section>

	<!-- Social Proof Section -->
	<section class="bg-neutral-50 py-16 md:py-24">
		<div class="container mx-auto px-4">
			<div class="text-center mb-12">
				<h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
					Loved by Language Learners
				</h2>
				<p class="text-lg text-text-secondary">
					Join thousands of students mastering Japanese through conversation
				</p>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
				<Testimonial
					quote="I've tried every app out there, but this is the first one where I actually remember the vocabulary. The context from conversations makes all the difference."
					name="Sarah Chen"
					role="University Student"
				/>
				<Testimonial
					quote="The spaced repetition system is perfect. I don't have to think about when to review - it just works. I've learned over 500 words in 3 months."
					name="Michael Torres"
					role="Software Engineer"
				/>
				<Testimonial
					quote="Finally, an app that doesn't feel like homework. Chatting about topics I care about makes learning feel natural and fun. Highly recommend!"
					name="Emily Nakamura"
					role="Content Creator"
				/>
			</div>
		</div>
	</section>

	<!-- Final CTA Section -->
	<section class="container mx-auto px-4 py-16 md:py-24">
		<div class="max-w-3xl mx-auto text-center">
			<Container class="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
				<h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
					Ready to Start Your Journey?
				</h2>
				<p class="text-lg text-text-secondary mb-8">
					Join thousands of learners mastering Japanese through natural conversation. Get started
					free in under a minute.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<a href="/signup">
						<Button variant="primary" class="text-lg px-8 py-3">Create Free Account</Button>
					</a>
					<a href="/login">
						<Button variant="secondary" class="text-lg px-8 py-3">Sign In</Button>
					</a>
				</div>
				<p class="text-sm text-text-muted mt-6">
					Free forever • No credit card required • Start chatting immediately
				</p>
			</Container>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-border py-8">
		<div class="container mx-auto px-4">
			<div
				class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-secondary"
			>
				<div>© 2024 Hanasu. All rights reserved.</div>
				<div class="flex gap-6">
					<a href="/about" class="hover:text-primary-600 transition-colors">About</a>
					<a href="/privacy" class="hover:text-primary-600 transition-colors">Privacy</a>
					<a href="/terms" class="hover:text-primary-600 transition-colors">Terms</a>
					<a href="/contact" class="hover:text-primary-600 transition-colors">Contact</a>
				</div>
			</div>
		</div>
	</footer>
</div>

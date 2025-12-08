<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<nav class="w-full bg-background border-b border-border sticky top-0 z-50">
	<div class="flex justify-between items-center max-w-7xl mx-auto px-4 py-4">
		<!-- Logo -->
		<a href="/" class="flex items-center">
			<Logo />
		</a>

		<!-- Navigation Links -->
		<div class="flex items-center gap-6">
			<!-- Pricing Link -->
			<a
				href="/pricing"
				class="text-lg text-text-secondary hover:text-primary-600 transition-colors font-medium hidden sm:block"
			>
				Pricing
			</a>

			<!-- Auth Buttons -->
			<div class="flex items-center gap-3">
				<a href="/login">
					<Button variant="ghost" class="bg-neutral-100 hover:bg-neutral-200 text-sm px-4 py-2">Sign In</Button>
				</a>
				<a href="/signup">
					<Button variant="primary" class="text-sm px-4 py-2">Get Started</Button>
				</a>
			</div>
		</div>
	</div>
</nav>

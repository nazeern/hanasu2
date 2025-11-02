<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		quote: string;
		name: string;
		role: string;
		avatar?: string;
		class?: string;
	}

	let { quote, name, role, avatar, class: className }: Props = $props();
</script>

<Container class={cn('flex flex-col h-full', className)}>
	<div class="flex-1 mb-4">
		<svg
			class="w-8 h-8 text-primary-200 mb-2"
			fill="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
			/>
		</svg>
		<p class="text-text-primary leading-relaxed italic">{quote}</p>
	</div>
	<div class="flex items-center gap-3">
		{#if avatar}
			<img src={avatar} alt={name} class="w-12 h-12 rounded-full object-cover" />
		{:else}
			<div
				class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold"
			>
				{name.charAt(0)}
			</div>
		{/if}
		<div>
			<div class="font-semibold text-text-primary">{name}</div>
			<div class="text-sm text-text-secondary">{role}</div>
		</div>
	</div>
</Container>

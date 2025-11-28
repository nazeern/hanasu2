import { POSTHOG_PUBLIC_KEY } from '$lib/constants';
import { PostHog } from 'posthog-node';

// Initialize PostHog client for server-side tracking
// flushAt: 1 and flushInterval: 0 ensure events are sent immediately (critical for serverless)
export const posthog = new PostHog(POSTHOG_PUBLIC_KEY, {
	host: 'https://us.i.posthog.com',
	flushAt: 1,
	flushInterval: 0
});

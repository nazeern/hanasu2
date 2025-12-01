import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import type { Database } from './database.types';
import { posthog } from '$lib/server/posthog';

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	// PostHog reverse proxy
	if (pathname.startsWith('/relay-HxVI')) {
		// Determine target hostname based on static or dynamic ingestion
		const hostname = pathname.startsWith('/relay-HxVI/static/')
			? 'us-assets.i.posthog.com' // Change to 'eu-assets.i.posthog.com' for EU Cloud
			: 'us.i.posthog.com'; // Change to 'eu.i.posthog.com' for EU Cloud

		// Build external URL
		const url = new URL(event.request.url);
		url.protocol = 'https:';
		url.hostname = hostname;
		url.port = '443';
		url.pathname = pathname.replace('/relay-HxVI/', '/');

		// Clone and adjust headers
		const headers = new Headers(event.request.headers);
		headers.set('Accept-Encoding', '');
		headers.set('host', hostname);

		// Proxy the request using SvelteKit's fetch
		const posthogResponse = await event.fetch(url.toString(), {
			method: event.request.method,
			headers: headers,
			body: event.request.body,
			duplex: 'half'
		} as RequestInit);

		// Return the proxied response
		return posthogResponse;
	}

	// Supabase client setup
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_PUBLISHABLE_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		}
	);

	event.locals.safeGetSession = async () => {
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			return { user: null };
		}
		// Don't call getSession() on server - it returns unauthenticated data
		// and triggers security warnings. Client can get session if needed.
		return { user };
	};

	// Track server-side request latency with PostHog
	const startTime = performance.now();
	const { user } = await event.locals.safeGetSession();

	const response = await resolve(event, {
		filterSerializedResponseHeaders(name: string) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});

	// Only track non-proxy routes
	if (!pathname.startsWith('/relay-HxVI')) {
		const duration = performance.now() - startTime;

		let eventName: string;
		let actionName: string | undefined;

		const hasSingleSearchParam = event.url.searchParams.size == 1;

		// Form actions are POST w/ single search param like '?/skip'
		if (event.request.method === 'POST' && hasSingleSearchParam) {
			eventName = 'form_action';
			// The search param key contains the action name (e.g., "/login" or "/")
			const formActionKey = event.url.searchParams.keys().toArray().at(0)
			if (formActionKey === '/') {
				actionName = 'default'
			} else {
				actionName = formActionKey?.slice(1);
			}
		}
		// Other non-GET requests are API routes, like +server.ts
		else if (event.request.method !== 'GET' && event.route.id) {
			eventName = 'api_route';
		}
		// GET requests are likely a load function
		else {
			eventName = 'load_function';
		}

		try {
			const properties: Record<string, string | number | boolean> = {
				route: event.route.id || pathname,
				method: event.request.method,
				duration_ms: Math.round(duration),
				status: response.status,
				is_authenticated: !!user,
			};

			// Only include action_name for form actions
			if (eventName === 'form_action' && actionName !== undefined) {
				properties.action_name = actionName;
			}

			posthog.capture({
				distinctId: user?.id || event.getClientAddress(),
				event: eventName,
				properties
			});
		} catch (error) {
			// Don't let tracking errors break the app
			console.error('PostHog tracking error:', error);
		}
	}

	return response;
};

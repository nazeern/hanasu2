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

		// Proxy the request
		const posthogResponse = await fetch(url.toString(), {
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

	return resolve(event, {
		filterSerializedResponseHeaders(name: string) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import type { LayoutLoad } from './$types';
import type { Database } from '../database.types';
import { browser } from '$app/environment';
import posthog from 'posthog-js';
import { POSTHOG_PUBLIC_KEY } from '$lib/constants';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = isBrowser()
		? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
			global: {
				fetch
			}
		})
		: createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
			global: {
				fetch
			},
			cookies: {
				getAll() {
					return data.cookies;
				}
			}
		});

	if (browser) {
		posthog.init(POSTHOG_PUBLIC_KEY, {
			api_host: '/relay-HxVI',
			ui_host: 'https://us.posthog.com',
			defaults: '2025-05-24',
			person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
		});
	}

	// Pass through all server data from +layout.server.ts
	// The client load function filters what reaches the Svelte component
	return { ...data, supabase, session: data.session };
};

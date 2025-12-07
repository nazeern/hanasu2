import type { User } from '@supabase/supabase-js';
import type { LayoutServerLoad } from './$types';
import { langInfoList, type LangInfo } from '$lib/constants';
import { getCustomerSubscriptionStatus } from '$lib/server/polar';
import { generateCannyHash } from '$lib/server/canny';

function getUserInitial(user: User | null | undefined): string {
	if (!user) return '?';

	const name = user.user_metadata.name;
	if (name) return name.charAt(0).toUpperCase();

	const email = user.email;
	if (email) return email.charAt(0).toUpperCase();

	return '?';
}

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, cookies }) => {
	const { user } = await safeGetSession();

	const { data: profile } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', user?.id ?? '')
		.limit(1)
		.single();

	// Check subscription status (handles null user gracefully)
	const subscriptionStatus = await getCustomerSubscriptionStatus(user?.id);

	// Generate Canny SSO hash for authenticated users
	const cannyHash = user ? generateCannyHash(user.id) : null;

	return {
		user,
		cookies: cookies.getAll(),
		// Variables below can be accessed via `parent()` in child pages
		userInitial: getUserInitial(user),
		userEmail: user?.email ?? 'Guest',
		profile: profile,
		langInfo: langInfoList.find((lang) => lang.code === profile?.lang),
		subscriptionStatus,
		cannyHash
	};
};

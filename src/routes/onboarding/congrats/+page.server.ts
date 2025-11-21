import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent }) => {
	const { user, profile } = await parent();

	// Ensure user is authenticated
	if (!user) {
		throw redirect(303, '/login');
	}

	// Return user data for personalization
	return {
		userName: user.user_metadata?.name ?? profile?.name ?? 'there',
		userEmail: user.email
	};
};

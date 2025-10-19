import type { User } from '@supabase/supabase-js';
import type { LayoutServerLoad } from './$types';

function getUserInitial(user: User | null | undefined): string {
	if (!user) return '?';

	const name = user.user_metadata?.name;
	if (name) return name.charAt(0).toUpperCase();

	const email = user.email;
	if (email) return email.charAt(0).toUpperCase();

	return '?';
}

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
	const { session, user } = await safeGetSession();

	return {
		session,
		user,
		cookies: cookies.getAll(),
		userInitial: getUserInitial(user)
	};
};

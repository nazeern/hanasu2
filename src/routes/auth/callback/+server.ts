import logger from '$lib/logger';
import { redirect, type RequestHandler } from '@sveltejs/kit';
import { updateContact } from '$lib/server/loops';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/dashboard';

	if (code) {
		const { error, data } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			logger.info('successful OAuth sign-in');

			// Add/update contact in Loops (idempotent - creates if new, updates if exists)
			if (data.user?.email) {
				try {
					const name = data.user.user_metadata?.name as string | undefined;
					const firstName = name ? name.split(' ')[0] : null;
					const lastName = name ? name.split(' ').slice(1).join(' ') || null : null;

					await updateContact({
						email: data.user.email,
						userId: data.user.id,
						properties: {
							firstName: firstName,
							lastName: lastName
						}
					});
				} catch (loopsError) {
					logger.error('Failed to update Loops contact, but auth succeeded', { loopsError });
				}
			}

			redirect(303, next);
		} else {
			logger.error('OAuth code exchange failed');
			logger.error(error);
		}
	} else {
		logger.warn('OAuth callback received without code parameter');
	}

	redirect(303, '/login');
};

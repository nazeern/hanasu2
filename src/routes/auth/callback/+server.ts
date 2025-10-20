import logger from '$lib/logger';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/dashboard';

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			logger.info('successful OAuth sign-in');
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

import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import logger from '$lib/logger';

export const actions: Actions = {
	default: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		logger.info('user signed out');
		redirect(303, '/login');
	}
};

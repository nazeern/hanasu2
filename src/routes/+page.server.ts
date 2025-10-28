import type { Actions } from './$types';
import logger from '$lib/logger';

export const actions: Actions = {
	updateLanguage: async (event) => {
		const {
			request,
			locals: { supabase, safeGetSession }
		} = event;
		const { user } = await safeGetSession();

		if (!user) {
			logger.error('No user found in session');
			return { success: false, error: 'Not authenticated' };
		}

		const formData = await request.formData();
		const lang = formData.get('lang');

		if (typeof lang !== 'string' || !lang) {
			logger.error('Invalid lang value', { lang });
			return { success: false, error: 'Invalid language code' };
		}

		const { error } = await supabase
			.from('profiles')
			.update({ lang })
			.eq('id', user.id);

		if (error) {
			logger.error('Failed to update language', { error, userId: user.id, lang });
			return { success: false, error: error.message };
		}

		logger.info('Language updated successfully', { userId: user.id, lang });
		return { success: true };
	}
};

import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import logger from '$lib/logger';
import { isString } from '$lib/util';

export const POST: RequestHandler = async ({ request, locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();

	if (!user) {
		error(401, 'Not authenticated');
	}

	let timezone: string;
	try {
		const body = await request.json();
		timezone = body.timezone;
	} catch {
		error(400, 'Invalid request body');
	}

	if (!isString(timezone)) {
		error(400, 'Invalid timezone');
	}

	// Basic validation: IANA timezones contain a slash
	if (!timezone.includes('/')) {
		error(400, 'Invalid timezone format');
	}

	const { error: dbError } = await supabase.from('profiles').update({ timezone }).eq('id', user.id);

	if (dbError) {
		logger.error('Failed to update user timezone', { userId: user.id, timezone, error: dbError });
		error(500, 'Failed to update timezone');
	}

	logger.info('User timezone updated', { userId: user.id, timezone });
	return json({ success: true, timezone });
};

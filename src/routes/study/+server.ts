import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tables } from '../../database.types';
import logger from '$lib/logger';

export const POST: RequestHandler = async ({ request, locals: { safeGetSession, supabase } }) => {
	const { user } = await safeGetSession();
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	const { vocabulary } = body as { vocabulary: Tables<'vocabulary'> };

	if (!vocabulary || !vocabulary.id) {
		logger.warn('Invalid request: missing vocabulary object or id');
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	const { error: updateError } = await supabase
		.from('vocabulary')
		.update({
			delay: Math.floor(vocabulary.delay),
			due: vocabulary.due,
			streak: Math.round(vocabulary.streak),
			n_correct: Math.round(vocabulary.n_correct),
			n_wrong: Math.round(vocabulary.n_wrong),
			time_to_response_ms: Math.max(Math.round(vocabulary.time_to_response_ms), 10_000)
		})
		.eq('id', vocabulary.id)
		.eq('user_id', user.id);

	if (updateError) {
		logger.error('Failed to update vocabulary record', updateError);
		return json({ error: 'Failed to update vocabulary' }, { status: 500 });
	}

	logger.info(`Vocabulary ${vocabulary.id} updated for user ${user.id}`);
	return json({ success: true });
};

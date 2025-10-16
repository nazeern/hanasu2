import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import logger from '$lib/logger';

export const POST: RequestHandler = async ({ request, locals: { safeGetSession, supabase } }) => {
	const { session, user } = await safeGetSession();
	if (!session || !user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	const { word_id, lang } = body;

	if (typeof word_id !== 'number' || typeof lang !== 'string') {
		logger.warn('Invalid request: missing word_id or lang');
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	const { data, error } = await supabase
		.from('vocabulary')
		.insert({
			user_id: user.id,
			word_id,
			lang,
			due: new Date().toISOString(),
			delay: 1,
			n_correct: 0,
			n_wrong: 0,
			streak: 0,
			time_to_response_ms: 0
		})
		.select()
		.single();

	if (error) {
		if (error.code === '23505') {
			return json({ error: 'Word already saved' }, { status: 409 });
		}
		logger.error('Failed to save word to vocabulary', error);
		return json({ error: 'Failed to save word' }, { status: 500 });
	}

	logger.info(`Word ${word_id} saved to vocabulary for user ${user.id}`);
	return json({ vocabulary: data });
};

export const DELETE: RequestHandler = async ({ request, locals: { safeGetSession, supabase } }) => {
	const { session, user } = await safeGetSession();
	if (!session || !user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	const { word_id } = body;

	if (typeof word_id !== 'number') {
		logger.warn('Invalid request: missing word_id');
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	const { error } = await supabase
		.from('vocabulary')
		.delete()
		.eq('user_id', user.id)
		.eq('word_id', word_id);

	if (error) {
		logger.error('Failed to delete word from vocabulary', error);
		return json({ error: 'Failed to delete word' }, { status: 500 });
	}

	logger.info(`Word ${word_id} removed from vocabulary for user ${user.id}`);
	return json({ success: true });
};

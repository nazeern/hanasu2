import logger from '$lib/logger';
import { json, error, type RequestHandler } from '@sveltejs/kit';
import { isString } from '$lib/util';

interface SaveSessionRequest {
	sessionId: string;
	lang: string;
	topic: string;
	duration: number;
	nResponses: number;
	avgResponseDurationMs?: number;
}

function isValidSessionRequest(body: any): body is SaveSessionRequest {
	return (
		isString(body.sessionId) &&
		isString(body.lang) &&
		isString(body.topic) &&
		typeof body.duration === 'number' &&
		typeof body.nResponses === 'number' &&
		(body.avgResponseDurationMs === undefined || typeof body.avgResponseDurationMs === 'number')
	);
}

export const POST: RequestHandler = async ({ request, locals: { safeGetSession, supabase } }) => {
	// Authenticate user
	const { user } = await safeGetSession();
	if (!user) {
		return error(401, { message: 'Unauthorized' });
	}

	// Parse and validate request body
	const body = await request.json();
	if (!isValidSessionRequest(body)) {
		return error(400, { message: 'Invalid session data' });
	}

	const { sessionId, lang, topic, duration, nResponses, avgResponseDurationMs } = body;

	try {
		// Insert session into database
		const { error: dbError } = await supabase.from('sessions').insert({
			id: sessionId,
			user_id: user.id,
			lang,
			topic,
			duration,
			n_responses: nResponses,
			avg_response_duration_ms: avgResponseDurationMs ?? null,
			chat_messages: null,
			token_usage: null
		});

		if (dbError) {
			logger.error({ error: dbError }, 'Failed to save session to database');
			return error(500, { message: 'Failed to save session' });
		}

		return json({ success: true });
	} catch (err) {
		logger.error({ error: err }, 'Session save error');
		return error(500, { message: 'Session save failed' });
	}
};

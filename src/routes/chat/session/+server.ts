import logger from '$lib/logger';
import { json, error, type RequestHandler } from '@sveltejs/kit';
import { isString } from '$lib/util';
import type { ConsolidatedUsage } from '../utils';
import { calculateCost } from '../utils';
import type { Json } from '../../../database.types';
import { posthog } from '$lib/server/posthog';

interface SaveSessionRequest {
	sessionId: string;
	lang: string;
	topic: string;
	duration: number; // in milliseconds (will be converted to seconds for database)
	nResponses: number;
	avgResponseDurationMs?: number;
	usage?: ConsolidatedUsage | null;
}

function isValidSessionRequest(body: any): body is SaveSessionRequest {
	return (
		isString(body.sessionId) &&
		isString(body.lang) &&
		isString(body.topic) &&
		typeof body.duration === 'number' &&
		typeof body.nResponses === 'number' &&
		(body.avgResponseDurationMs === undefined || typeof body.avgResponseDurationMs === 'number') &&
		(body.usage === null || typeof body.usage === 'object')
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

	const { sessionId, lang, topic, duration, nResponses, avgResponseDurationMs, usage } = body;

	// Convert duration from milliseconds to seconds, round, and cap at 10000 seconds (~2.7 hours)
	const processedDuration = Math.min(Math.round(duration / 1000), 10000);

	// Round and cap avg_response_duration_ms at database maximum (10000)
	const processedAvgResponseDuration = avgResponseDurationMs != null
		? Math.min(Math.round(avgResponseDurationMs), 10000)
		: null;

	try {
		// Insert session into database
		const { error: dbError } = await supabase.from('sessions').insert({
			id: sessionId,
			user_id: user.id,
			lang,
			topic,
			duration: processedDuration,
			n_responses: nResponses,
			avg_response_duration_ms: processedAvgResponseDuration,
			chat_messages: null,
			token_usage: usage as Json,
		});

		if (dbError) {
			logger.error({ error: dbError }, 'Failed to save session to database');
			return error(500, { message: 'Failed to save session' });
		}

		// Track to PostHog if usage available
		if (usage) {
			try {
				const { breakdown, totals } = calculateCost(usage);

				// https://posthog.com/docs/llm-analytics/installation/manual-capture?tab=Generation
				posthog.capture({
					distinctId: user.id,
					event: '$ai_generation',
					properties: {
						// Standard PostHog LLM properties (for dashboards)
						$ai_trace_id: sessionId,
						$ai_model: 'gpt-realtime',
						$ai_provider: 'openai',
						$ai_input_tokens: totals.inputTokens,
						$ai_output_tokens: totals.outputTokens,
						$ai_cache_read_input_tokens: totals.cachedTokens,

						// Cost properties
						$ai_input_cost_usd: totals.inputCost,
						$ai_output_cost_usd: totals.outputCost,
						$ai_total_cost_usd: totals.totalCost,
						$ai_request_count: nResponses,

						// Custom properties for audio/text breakdown
						audio_input_tokens: usage.audio.input,
						audio_output_tokens: usage.audio.output,
						audio_cached_tokens: usage.audio.cached,
						text_input_tokens: usage.text.input,
						text_output_tokens: usage.text.output,
						text_cached_tokens: usage.text.cached,

						// Cost breakdown by token type
						audio_input_cost: breakdown.audio.input,
						audio_output_cost: breakdown.audio.output,
						audio_cached_cost: breakdown.audio.cached,
						text_input_cost: breakdown.text.input,
						text_output_cost: breakdown.text.output,
						text_cached_cost: breakdown.text.cached,

						// Session metadata
						session_duration_seconds: processedDuration,
						response_count: nResponses,
						avg_response_time_ms: processedAvgResponseDuration,
						language: lang,

						// Unneeded fields
						$ai_input: [],
						$ai_output_choices: []
					},
				});

				logger.info({ sessionId, userId: user.id, cost: totals.totalCost }, 'Usage tracked to PostHog');
			} catch (phError) {
				logger.error({ error: phError }, 'PostHog tracking failed (non-fatal)');
				// Don't fail the request if PostHog fails
			}
		}

		logger.info('Session save successful')
		return json({ success: true });
	} catch (err) {
		logger.error({ error: err }, 'Session save error');
		return error(500, { message: 'Session save failed' });
	}
};

import type { SupabaseClient } from '@supabase/supabase-js';
import { FREE_DAILY_MESSAGE_LIMIT, FREE_MONTHLY_MESSAGE_LIMIT, UNLIMITED_MESSAGES } from '$lib/constants';
import type { Database } from '../../database.types';

export interface RawUsageStats {
	dailyUsed: number;
	monthlyUsed: number;
}

export interface PeriodUsage {
	limit: number;
	used: number;
	remaining: number;
}

export interface UsageStats {
	daily: PeriodUsage;
	monthly: PeriodUsage;
	canStartConversation: boolean;
	limitReached: 'none' | 'daily' | 'monthly';
}

function getStartOfDayUTC(): string {
	const now = new Date();
	const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
	return startOfDay.toISOString();
}

function getStartOfMonthUTC(): string {
	const now = new Date();
	const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
	return startOfMonth.toISOString();
}

/**
 * Calculate usage limits based on raw stats and subscription status
 */
export function limits(rawStats: RawUsageStats, isPremium: boolean): UsageStats {
	// Premium users have unlimited (very large limit that survives JSON serialization)
	if (isPremium) {
		return {
			daily: {
				limit: UNLIMITED_MESSAGES,
				used: rawStats.dailyUsed,
				remaining: UNLIMITED_MESSAGES
			},
			monthly: {
				limit: UNLIMITED_MESSAGES,
				used: rawStats.monthlyUsed,
				remaining: UNLIMITED_MESSAGES
			},
			canStartConversation: true,
			limitReached: 'none'
		};
	}

	// Free users have defined limits
	const dailyRemaining = Math.max(0, FREE_DAILY_MESSAGE_LIMIT - rawStats.dailyUsed);
	const monthlyRemaining = Math.max(0, FREE_MONTHLY_MESSAGE_LIMIT - rawStats.monthlyUsed);

	const dailyLimitReached = dailyRemaining <= 0;
	const monthlyLimitReached = monthlyRemaining <= 0;

	let limitReached: 'none' | 'daily' | 'monthly' = 'none';
	if (dailyLimitReached) {
		limitReached = 'daily';
	} else if (monthlyLimitReached) {
		limitReached = 'monthly';
	}

	return {
		daily: {
			limit: FREE_DAILY_MESSAGE_LIMIT,
			used: rawStats.dailyUsed,
			remaining: dailyRemaining
		},
		monthly: {
			limit: FREE_MONTHLY_MESSAGE_LIMIT,
			used: rawStats.monthlyUsed,
			remaining: monthlyRemaining
		},
		canStartConversation: !dailyLimitReached && !monthlyLimitReached,
		limitReached
	};
}

/**
 * Usage tracking service for managing message limits
 *
 * @example
 * const usage = new UsageService(supabase);
 * const rawStats = await usage.stats(userId);
 * const usageStats = limits(rawStats, isPremium);
 */
export class UsageService {
	private supabase: SupabaseClient<Database>;

	constructor(supabase: SupabaseClient<Database>) {
		this.supabase = supabase;
	}

	/**
	 * Query total messages used in a time period from sessions table
	 */
	private async getMessageUsageSince(userId: string, since: string): Promise<number> {
		const { data, error } = await this.supabase
			.from('sessions')
			.select('n_responses')
			.eq('user_id', userId)
			.gte('created_at', since);

		if (error) {
			console.error('Error fetching message usage:', error);
			return 0;
		}

		// Sum all n_responses values, treating null as 0
		const total = data?.reduce((sum, session) => sum + (session.n_responses || 0), 0) || 0;
		return total;
	}

	/**
	 * Get raw message usage counts for today and this month
	 */
	async stats(userId: string): Promise<RawUsageStats> {
		const startOfDay = getStartOfDayUTC();
		const startOfMonth = getStartOfMonthUTC();

		// Run both queries in parallel
		const [dailyUsed, monthlyUsed] = await Promise.all([
			this.getMessageUsageSince(userId, startOfDay),
			this.getMessageUsageSince(userId, startOfMonth)
		]);

		return {
			dailyUsed,
			monthlyUsed
		};
	}
}

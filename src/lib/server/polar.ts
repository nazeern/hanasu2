import { Polar } from '@polar-sh/sdk';
import { POLAR_ACCESS_TOKEN } from '$env/static/private';
import { dev } from '$app/environment';
import type { CustomerState } from '@polar-sh/sdk/models/components/customerstate.js';
import type { CustomerStateSubscription } from '@polar-sh/sdk/models/components/customerstatesubscription.js';

// Initialize Polar SDK client
const polar = new Polar({
	accessToken: POLAR_ACCESS_TOKEN,
	server: dev ? 'sandbox' : 'production'
});

// Re-export types for convenience
export type { CustomerState, CustomerStateSubscription };

export interface SubscriptionStatus {
	isPremium: boolean;
	subscription: CustomerStateSubscription | null;
	subscriptions: CustomerStateSubscription[];
	customer: CustomerState | null;
}

// Default empty subscription status for non-logged-in or non-subscribed users
const DEFAULT_SUBSCRIPTION_STATUS: SubscriptionStatus = {
	isPremium: false,
	subscription: null,
	subscriptions: [],
	customer: null
};

/**
 * Get customer subscription status by user ID (external ID in Polar)
 * @param userId - The Supabase user ID (used as external_id in Polar), can be null/undefined
 * @returns Subscription status with isPremium flag and subscription details
 */
export async function getCustomerSubscriptionStatus(
	userId: string | null | undefined
): Promise<SubscriptionStatus> {
	// Handle null/undefined userId (e.g., user not logged in)
	if (!userId) {
		return DEFAULT_SUBSCRIPTION_STATUS;
	}

	try {
		// Fetch customer state by external ID
		const customerState = await polar.customers.getStateExternal({
			externalId: userId
		});

		// Check if customer has any active subscriptions
		const activeSubscriptions = customerState.activeSubscriptions || [];

		// Filter to only truly active (paid) subscriptions, excluding trials if needed
		const paidSubscriptions = activeSubscriptions.filter((sub) => {
			// Check that subscription is active and not canceled
			return (
				sub.status === 'active' &&
				sub.canceledAt === null
			);
		});

		return {
			isPremium: paidSubscriptions.length > 0,
			subscription: paidSubscriptions[0] || null,
			subscriptions: paidSubscriptions,
			customer: customerState
		};
	} catch (error: any) {
		// If customer not found (404), they haven't purchased yet
		if (error?.statusCode === 404 || error?.status === 404) {
			return DEFAULT_SUBSCRIPTION_STATUS;
		}

		// Log other errors but return safe default instead of throwing
		console.error('Failed to fetch customer subscription status:', error);
		return DEFAULT_SUBSCRIPTION_STATUS;
	}
}

/**
 * Check if a user has an active premium subscription (simple boolean check)
 * @param userId - The Supabase user ID, can be null/undefined
 * @returns true if user has active subscription, false otherwise
 */
export async function isPremiumUser(userId: string | null | undefined): Promise<boolean> {
	const status = await getCustomerSubscriptionStatus(userId);
	return status.isPremium;
}

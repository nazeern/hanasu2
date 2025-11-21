import type { PageServerLoad } from './$types';
import { POLAR_PRODUCT_MONTHLY_ID, POLAR_PRODUCT_YEARLY_ID } from '$lib/constants';
import { PUBLIC_SITE_URL } from '$env/static/public';

function buildCheckoutUrl(
	primaryProductId: string,
	secondaryProductId: string,
	userId: string | null,
	userEmail: string | null,
	userName: string | null
): string {
	const url = new URL('/api/checkout', PUBLIC_SITE_URL);

	// Add both products, with primary product first
	url.searchParams.append('products', primaryProductId);
	url.searchParams.append('products', secondaryProductId);

	if (userId) {
		url.searchParams.set('customerExternalId', userId);
	}
	if (userEmail) {
		url.searchParams.set('customerEmail', userEmail);
	}
	if (userName) {
		url.searchParams.set('customerName', userName);
	}

	return url.pathname + url.search;
}

export const load: PageServerLoad = async ({ parent }) => {
	const { user, profile } = await parent();

	const userId = user?.id ?? null;
	const userEmail = user?.email ?? null;
	const userName = user?.user_metadata?.name ?? profile?.name ?? null;

	return {
		userId,
		userEmail,
		userName,
		// Monthly checkout: monthly product first, yearly as alternative
		monthlyCheckoutUrl: buildCheckoutUrl(
			POLAR_PRODUCT_MONTHLY_ID,
			POLAR_PRODUCT_YEARLY_ID,
			userId,
			userEmail,
			userName
		),
		// Yearly checkout: yearly product first, monthly as alternative
		yearlyCheckoutUrl: buildCheckoutUrl(
			POLAR_PRODUCT_YEARLY_ID,
			POLAR_PRODUCT_MONTHLY_ID,
			userId,
			userEmail,
			userName
		)
	};
};

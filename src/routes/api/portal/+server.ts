import { CustomerPortal } from '@polar-sh/sveltekit';
import { Polar } from '@polar-sh/sdk';
import { POLAR_ACCESS_TOKEN } from '$env/static/private';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { dev } from '$app/environment';

const polar = new Polar({
	accessToken: POLAR_ACCESS_TOKEN,
	server: dev ? 'sandbox' : 'production'
});

export const GET = CustomerPortal({
	accessToken: POLAR_ACCESS_TOKEN,
	getCustomerId: async (event) => {
		const { user } = await event.locals.safeGetSession();
		if (!user) {
			throw new Error('Unauthorized');
		}

		try {
			// Fetch customer by external ID (Supabase user ID)
			const customer = await polar.customers.getExternal({
				externalId: user.id
			});
			return customer.id;
		} catch (error) {
			console.error('Failed to fetch Polar customer:', error);
			throw new Error('Customer not found');
		}
	},
	returnUrl: `${PUBLIC_SITE_URL}/dashboard`,
	server: dev ? 'sandbox' : 'production'
});

import { Checkout } from '@polar-sh/sveltekit';
import { POLAR_ACCESS_TOKEN } from '$env/static/private';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { dev } from '$app/environment';

export const GET = Checkout({
	accessToken: POLAR_ACCESS_TOKEN,
	successUrl: `${PUBLIC_SITE_URL}/onboarding/congrats`,
	returnUrl: `${PUBLIC_SITE_URL}/pricing`,
	server: dev ? 'sandbox' : 'production',
	theme: 'light'
});

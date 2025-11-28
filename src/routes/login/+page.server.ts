import { fail, redirect, type Actions } from '@sveltejs/kit';
import { PUBLIC_SITE_URL } from '$env/static/public';
import logger from '$lib/logger';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();

	if (user) {
		redirect(303, '/dashboard');
	}
};

export const actions: Actions = {
	login: async (event) => {
		const url = PUBLIC_SITE_URL;
		const {
			request,
			locals: { supabase }
		} = event;
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const validEmail = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,8}$/.test(email);
		if (!validEmail) {
			logger.warn('login attempt with invalid email address');
			return fail(400, { error: 'Please enter a valid email address.' });
		}

		const password = formData.get('password') as string;
		const captchaToken = formData.get('cf-turnstile-response') as string;

		// Attempt login
		const loginData = {
			email,
			password,
			options: {
				captchaToken
			}
		};
		const { error: loginError } = await supabase.auth.signInWithPassword(loginData);
		if (!loginError) {
			logger.info('successful login with email & password');
			throw redirect(302, '/dashboard');
		} else {
			logger.warn('failed to login');
			logger.info(loginError);
			return fail(400, { error: 'Incorrect username or password.' })
		}
	},
	googleSignIn: async ({ locals: { supabase } }) => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${PUBLIC_SITE_URL}/auth/callback`
			}
		});

		if (error) {
			logger.error('Google OAuth initiation failed');
			logger.error(error);
			return fail(500, { error: 'Failed to initiate Google sign-in.' });
		}

		if (data.url) {
			logger.info(data.url)
			redirect(303, data.url);
		}

		return fail(500, { error: 'Failed to get OAuth URL.' });
	}
};

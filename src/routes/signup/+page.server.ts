import { fail, redirect, type Actions } from '@sveltejs/kit';
import { PUBLIC_SITE_URL } from '$env/static/public';
import logger from '$lib/logger';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (session) {
		redirect(303, '/dashboard');
	}
};

export const actions: Actions = {
	signup: async (event) => {
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
		const name = formData.get('name') as string;
		const lang = formData.get('lang') as string;
		const emailRedirectTo = url;
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
			logger.warn('failed to login, attempting signup...');
			logger.info(loginError);
		}

		// Attempt signup
		const signupData = {
			...loginData,
			options: {
				data: {
					name,
					lang
				},
				emailRedirectTo,
				captchaToken
			}
		};
		const { error: signupError } = await supabase.auth.signUp(signupData);
		if (signupError) {
			logger.warn('failed signup');
			logger.info(signupError);
			return fail(400, {
				success: false,
				email,
				message: 'There was an issue. Please contact support.'
			});
		}

		logger.info('sign up successful, email sent');
		return {
			success: true,
			message: 'Please check your email for a magic link to log into the website.'
		};
	}
};

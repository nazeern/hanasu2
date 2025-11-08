import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { profile } = await parent();

	// If user has already completed onboarding, redirect to dashboard
	if (profile?.experienced?.includes('onboard')) {
		throw redirect(303, '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const proficiencyValue = formData.get('proficiency') as string | null;
		const proficiency = proficiencyValue && proficiencyValue.trim() !== '' ? proficiencyValue : undefined;

		// Get current profile to preserve existing experienced array
		const { data: currentProfile } = await supabase
			.from('profiles')
			.select('experienced')
			.eq('id', user.id)
			.single();

		const experiencedArray = currentProfile?.experienced || [];

		// Add 'onboard' to experienced array if not already present
		if (!experiencedArray.includes('onboard')) {
			experiencedArray.push('onboard');
		}

		// Update profile with onboarding completion and proficiency
		const { error } = await supabase
			.from('profiles')
			.update({
				experienced: experiencedArray,
				proficiency: proficiency
			})
			.eq('id', user.id);

		if (error) {
			return fail(500, { error: 'Failed to update profile' });
		}

		throw redirect(303, '/dashboard');
	}
};

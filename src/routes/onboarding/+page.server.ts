import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { practiceFrequencyOptions, type PracticeFrequency } from './constants';

export const load: PageServerLoad = async ({ parent }) => {
	const { user, profile } = await parent();

	if (!user) {
		throw redirect(303, '/login');
	}

	return {};
};

export const actions: Actions = {
	complete: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const proficiencyValue = formData.get('proficiency') as string | null;
		const proficiency = proficiencyValue && proficiencyValue.trim() !== '' ? proficiencyValue : undefined;

		const practiceFrequencyValue = formData.get('practice_frequency') as string | null;
		const validFrequencies = practiceFrequencyOptions.map((opt) => opt.id);
		if (!practiceFrequencyValue || !validFrequencies.includes(practiceFrequencyValue as PracticeFrequency)) {
			return fail(400, { error: 'Invalid practice frequency' });
		}

		const practice_frequency = practiceFrequencyValue as PracticeFrequency;

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

		const { error } = await supabase
			.from('profiles')
			.update({
				experienced: experiencedArray,
				proficiency: proficiency,
				practice_frequency: practice_frequency
			})
			.eq('id', user.id);

		if (error) {
			return fail(500, { error: 'Failed to update profile' });
		}

		throw redirect(303, '/dashboard');
	},
	skip: async ({ locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

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

		const { error } = await supabase
			.from('profiles')
			.update({
				experienced: experiencedArray
			})
			.eq('id', user.id);

		if (error) {
			return fail(500, { error: 'Failed to update profile' });
		}

		throw redirect(303, '/dashboard');
	}
};

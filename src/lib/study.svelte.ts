import logger from '$lib/logger';
import type { Tables } from '../database.types';

export type StudyState = 'idle' | 'submitting' | 'correct' | 'incorrect';

export type StudyItem = {
	vocabulary: Tables<'vocabulary'>;
	dictEntry: Tables<'ja_dict'>;
};

export class Study {
	items = $state<StudyItem[]>([]);
	currentAnswer = $state('');
	state = $state<StudyState>('idle');
	submitting = $state<boolean>(false);
	startTime = $state<number>(Date.now());

	constructor(studyItems: StudyItem[]) {
		this.items = studyItems
		this.currentAnswer = ''
		this.state = 'idle'
		this.submitting = false
		this.startTime = Date.now()
	}

	get currentItem(): StudyItem | null {
		return this.items.at(-1) || null
	}

	get totalWords(): number {
		return this.items.length;
	}

	async submitAnswer(): Promise<void> {
		if (!this.currentItem || this.submitting == true) return;

		const correct = this.currentItem.dictEntry.readings?.includes(this.currentAnswer);

		const newVocabulary: Tables<'vocabulary'> = {
			...this.currentItem.vocabulary
		};

		if (correct) {
			newVocabulary.delay = this.currentItem.vocabulary.delay * 2.5;
			newVocabulary.streak = this.currentItem.vocabulary.streak + 1;
			newVocabulary.n_correct = this.currentItem.vocabulary.n_correct + 1;
			this.state = 'correct';
		} else {
			newVocabulary.delay = Math.max(1, this.currentItem.vocabulary.delay / 2);
			newVocabulary.streak = 0;
			newVocabulary.n_wrong = this.currentItem.vocabulary.n_wrong + 1;
			this.state = 'incorrect';
		}

		const newDue = new Date();
		newDue.setDate(newDue.getDate() + newVocabulary.delay);
		newVocabulary.due = newDue.toISOString();

		const timeToResponse = Date.now() - this.startTime;
		newVocabulary.time_to_response_ms = timeToResponse;

		this.submitting = true;
		try {
			const response = await fetch('/study', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					vocabulary: newVocabulary
				})
			});

			if (!response.ok) {
				throw new Error('Failed to update vocabulary record');
			}
		} catch (error) {
			logger.error('Error submitting answer', error);
			throw error;
		} finally {
			this.submitting = false;
		}
	}

	continue(): void {
		if (this.items.length > 0) {
			this.items.pop();
		}
		this.currentAnswer = '';
		this.state = 'idle';
		this.startTime = Date.now();
	}
}

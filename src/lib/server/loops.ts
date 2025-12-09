import { LoopsClient, type ContactProperties } from 'loops';
import { LOOPS_SECRET_KEY } from '$env/static/private';
import logger from '$lib/logger';

const loops = new LoopsClient(LOOPS_SECRET_KEY);

interface CreateContactParams {
	email: string;
	properties?: ContactProperties;
}

interface UpdateContactParams {
	email?: string;
	userId?: string;
	properties?: ContactProperties;
}

interface SendEventParams {
	email?: string;
	userId?: string;
	eventName: string;
	eventProperties?: Record<string, string | number | boolean>;
}

export async function createContact(params: CreateContactParams) {
	try {
		const response = await loops.createContact(params);

		if (response.success) {
			logger.info(`Loops contact created: ${params.email}`);
			return { success: true, id: response.id };
		} else {
			logger.error('Loops contact creation failed', { email: params.email, response });
			return { success: false, error: 'Failed to create contact' };
		}
	} catch (error) {
		logger.error('Loops API error during contact creation', { error, email: params.email });
		return { success: false, error: 'API error' };
	}
}

export async function updateContact(params: UpdateContactParams) {
	try {
		const response = await loops.updateContact(params);

		if (response.success) {
			logger.info(`Loops contact updated: ${params.email || params.userId}`);
			return { success: true, id: response.id };
		} else {
			logger.error('Loops contact update failed', { email: params.email, userId: params.userId, response });
			return { success: false, error: 'Failed to update contact' };
		}
	} catch (error) {
		logger.error('Loops API error during contact update', { error, email: params.email, userId: params.userId });
		return { success: false, error: 'API error' };
	}
}

export async function sendEvent(params: SendEventParams) {
	try {
		const response = await loops.sendEvent(params);

		if (response.success) {
			logger.info(`Loops event sent: ${params.eventName}`, { email: params.email, userId: params.userId });
			return { success: true };
		} else {
			logger.error('Loops event send failed', { eventName: params.eventName, response });
			return { success: false, error: 'Failed to send event' };
		}
	} catch (error) {
		logger.error('Loops API error during event send', { error, eventName: params.eventName });
		return { success: false, error: 'API error' };
	}
}

import { createHmac } from 'crypto';
import { CANNY_SECRET_KEY } from '$env/static/private';

/**
 * Generate HMAC-SHA256 hash for Canny SSO authentication
 * @param userId - The user's unique identifier
 * @returns Hexadecimal hash string
 */
export function generateCannyHash(userId: string): string {
	const hash = createHmac('sha256', CANNY_SECRET_KEY).update(userId).digest('hex');
	return hash;
}

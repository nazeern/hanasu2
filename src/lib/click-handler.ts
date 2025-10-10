import logger from '$lib/logger';

/**
 * Creates a click handler that distinguishes between single and double clicks
 * @param onSingleClick - Callback for single click
 * @param onDoubleClick - Callback for double click
 * @param delay - Time to wait for double click (default 300ms)
 */
export function createClickHandler<T>(
	onSingleClick: (e: MouseEvent, data: T) => void,
	onDoubleClick: (data: T) => void,
	delay: number = 300
) {
	let clickTimer: ReturnType<typeof setTimeout> | null = null;

	const handleSingleClick = (e: MouseEvent, data: T) => {
		// Clear any existing timer first (handles double-click scenario)
		if (clickTimer) {
			clearTimeout(clickTimer);
		}

		// Delay execution to check if double-click is coming
		logger.info('Single click detected, waiting for double click...');
		clickTimer = setTimeout(() => {
			logger.info('No double click detected, executing single click action.');
			onSingleClick(e, data);
			clickTimer = null;
		}, delay);
	};

	const handleDoubleClick = (data: T) => {
		// Cancel single-click action
		if (clickTimer) {
			logger.info('Double click detected, cancelling single click action.');
			clearTimeout(clickTimer);
			clickTimer = null;
		}
		onDoubleClick(data);
	};

	return { handleSingleClick, handleDoubleClick };
}

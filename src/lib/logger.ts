import { browser, dev } from '$app/environment';
import pino, { type Logger } from 'pino';

// Define a universal logger interface
interface UniversalLogger {
	info: (...args: any[]) => void;
	warn: (...args: any[]) => void;
	error: (...args: any[]) => void;
	debug: (...args: any[]) => void;
}

let logger: Logger | UniversalLogger;

if (browser) {
	// Browser: use console methods for DevTools compatibility
	logger = {
		info: (...args: any[]) => console.log(...args),
		warn: (...args: any[]) => console.warn(...args),
		error: (...args: any[]) => console.error(...args),
		debug: (...args: any[]) => console.debug(...args)
	};
} else {
	// Server: use pino with pretty formatting in dev, JSON in production
	logger = pino({
		level: dev ? 'debug' : 'info',
		...(dev && {
			transport: {
				target: 'pino-pretty',
				options: { colorize: true }
			}
		})
	});
}

export default logger;

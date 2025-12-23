// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { LoopsClient } from 'npm:loops@6.0.1';

const DRY_RUN = false;

const TEST_DATETIME = DRY_RUN ? '2025-12-10T01:00:00Z' : undefined

const TEST_IDS = [
	'240941d0-49ad-423b-b91c-7fe3079c58de',
	'64286e8d-3be3-4da6-a4fe-f1ae363efc9c'
]

function timezoneAtHour(timezone, hour) {
	const now = TEST_DATETIME ? Temporal.Instant.from(TEST_DATETIME) : Temporal.Now.instant()

	try {
		const timezonedDatetime = now.toZonedDateTimeISO(timezone)
		return timezonedDatetime.hour == hour
	} catch (error) {
		console.error(`invalid timezone: ${timezone}`, error)
	}
}

export class AudienceRepository {
	constructor(private supabase, private sendTimezones) { }

	async getDailyAudience() {
		const { data } = await this.supabase
			.from('profiles')
			.select(`
				id,
				notify,
				timezone,
				practice_frequency,
				name
			`)
			.eq('practice_frequency', 'daily')
			.in('timezone', this.sendTimezones);
		return data.map(user => ({ ...user, eventName: 'practice_reminder_due' }))
	}

	async get2DayAudience() {
		const now = TEST_DATETIME ? new Date(TEST_DATETIME) : new Date()
		const twoDaysAgo = new Date(now);
		twoDaysAgo.setDate(now.getDate() - 2);

		const threeDaysAgo = new Date(now);
		threeDaysAgo.setDate(now.getDate() - 3);

		const { data } = await this.supabase
			.from('profiles')
			.select(`
				id,
				notify,
				timezone,
				practice_frequency,
				name,
				sessions(
					created_at
				)
			`)
			.eq('practice_frequency', '3x_weekly')
			.in('timezone', this.sendTimezones)
			.gte('sessions.created_at', threeDaysAgo.toISOString());

		const audience = [];
		for (const user of data) {
			if (!user.sessions || user.sessions.length === 0) {
				continue; // No sessions in last 3 days, skip
			}

			const latestSession = new Date(
				Math.max(...user.sessions.map((s) => new Date(s.created_at)))
			);

			// Include if latest session is older than 2 days (but within 3 days)
			if (latestSession < twoDaysAgo) {
				const { sessions, ...userData } = user;
				audience.push({ ...userData, eventName: 'practice_reminder_due' });
			}
		}

		return audience;
	}

	async getWeeklyAudience() {
		const now = TEST_DATETIME ? new Date(TEST_DATETIME) : new Date()
		const sevenDaysAgo = new Date(now);
		sevenDaysAgo.setDate(now.getDate() - 7);

		const eightDaysAgo = new Date(now);
		eightDaysAgo.setDate(now.getDate() - 8);

		const { data } = await this.supabase
			.from('profiles')
			.select(`
				id,
				notify,
				timezone,
				practice_frequency,
				name,
				sessions(
					created_at
				)
			`)
			.eq('practice_frequency', 'weekly')
			.in('timezone', this.sendTimezones)
			.gte('sessions.created_at', eightDaysAgo.toISOString());

		const audience = [];
		for (const user of data) {
			if (!user.sessions || user.sessions.length === 0) {
				continue; // No sessions in last 8 days, skip
			}

			const latestSession = new Date(
				Math.max(...user.sessions.map((s) => new Date(s.created_at)))
			);

			// Include if latest session is older than 7 days (but within 8 days)
			if (latestSession < sevenDaysAgo) {
				const { sessions, ...userData } = user;
				audience.push({ ...userData, eventName: 'practice_reminder_due' });
			}
		}

		return audience;
	}

	async get9DayInactiveAudience() {
		const now = TEST_DATETIME ? new Date(TEST_DATETIME) : new Date()
		const nineDaysAgo = new Date(now);
		nineDaysAgo.setDate(now.getDate() - 9);

		const tenDaysAgo = new Date(now);
		tenDaysAgo.setDate(now.getDate() - 10);

		const { data } = await this.supabase
			.from('profiles')
			.select(`
				id,
				notify,
				timezone,
				practice_frequency,
				name,
				sessions(
					created_at
				)
			`)
			.neq('practice_frequency', 'never')
			.in('timezone', this.sendTimezones)
			.gte('sessions.created_at', tenDaysAgo.toISOString());

		const audience = [];
		for (const user of data) {
			if (!user.sessions || user.sessions.length === 0) {
				continue; // No sessions in last 10 days, skip
			}

			const latestSession = new Date(
				Math.max(...user.sessions.map((s) => new Date(s.created_at)))
			);

			// Include if latest session is older than 9 days (but within 10 days)
			if (latestSession < nineDaysAgo) {
				const { sessions, ...userData } = user;
				audience.push({ ...userData, eventName: 'reactivation' });
			}
		}

		return audience;
	}

}

Deno.serve(async (req) => {

	// Verify cron secret for authentication
	const cronSecret = Deno.env.get('CRON_SECRET_KEY');
	if (!cronSecret) {
		throw new Error('CRON_SECRET_KEY environment variable is required');
	}

	const authHeader = req.headers.get('Cron-Secret');
	if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
		return new Response(JSON.stringify({ message: 'Unauthorized' }), {
			headers: { 'Content-Type': 'application/json' },
			status: 401
		});
	}


	try {
		const supabase = createClient(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
		)
		const loops = new LoopsClient(Deno.env.get('LOOPS_SECRET_KEY') ?? '');

		const { data: timezoneData } = await supabase
			.from('profiles')
			.select('timezone')
			.neq('practice_frequency', 'never');
		const uniqueTimezones = [...new Set(timezoneData.map(record => record.timezone))]
		const sendTimezones = uniqueTimezones.filter((tz) => timezoneAtHour(tz, 20))

		const audienceRepo = new AudienceRepository(supabase, sendTimezones)

		const [daily, threeXWeekly, weekly, nineDayInactive] = await Promise.all([
			audienceRepo.getDailyAudience(),
			audienceRepo.get2DayAudience(),
			audienceRepo.getWeeklyAudience(),
			audienceRepo.get9DayInactiveAudience()
		])

		// Combine all audiences (each user has eventName property)
		let audience = [...daily, ...threeXWeekly, ...weekly, ...nineDayInactive]

		if (DRY_RUN && TEST_IDS.length) {
			audience = audience.filter((user) => TEST_IDS.includes(user.id))
		}

		// Send Loops.so events
		const BATCH_SIZE = 10;
		const results = { sent: 0, failed: 0, errors: [] };
		console.log(audience)

		for (let i = 0; i < audience.length; i += BATCH_SIZE) {
			const batch = audience.slice(i, i + BATCH_SIZE);

			// Send batch concurrently
			const promises = batch.map(async (user) => {
				try {
					await loops.sendEvent({
						userId: user.id,
						eventName: user.eventName,
						eventProperties: {
							firstName: user.name ? user.name.split(' ')[0] : null,
							timezone: user.timezone,
							practice_frequency: user.practice_frequency,
						}
					});
					results.sent++;
				} catch (error) {
					results.failed++;
					results.errors.push({ userId: user.id, error: error.message });
				}
			});

			await Promise.all(promises);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}

		console.log(results)

		return new Response(JSON.stringify(results), {
			headers: { 'Content-Type': 'application/json' },
			status: 200
		})

	} catch (err) {
		console.log(err)
		return new Response(JSON.stringify({ message: err?.message ?? err }), {
			headers: { 'Content-Type': 'application/json' },
			status: 500
		})
	}
})


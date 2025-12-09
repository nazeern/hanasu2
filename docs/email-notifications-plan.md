# Notification System - System Design & Architecture

## Problem Statement

Build email notifications for Hanasu with:
1. **Practice Reminders** - Daily/weekly reminders based on user preference, sent at 9am in user's local timezone
2. **Lifecycle Emails** - Welcome sequence + re-engagement (Day 0, 1, 3, 7)

## Architecture Decision: Hybrid SaaS + Custom

### Recommendation

**Lifecycle Emails: Use Loops ([loops.so](https://loops.so))**
- Purpose-built for SaaS lifecycle campaigns
- FREE up to 1,000 contacts (covers MVP)
- $49/month for 5,000 contacts
- No custom code needed - configure drip campaigns in dashboard
- Handles timing, triggers, and delivery automatically

**Practice Reminders: Custom (Supabase Edge Function + Loops)**
- Needs complex logic (check if practiced today, respect frequency, calculate streak)
- Timezone-aware sending (9am local time varies by user)
- Supabase cronjob does all database queries, then sends event to Loops
- Loops handles email delivery (charged by contacts, not email volume)
- pg_cron triggers hourly check

### Revised Architecture: Loops for Everything

**Original concern:** Can Loops handle practice reminder logic?
- ❌ Loops can't query our database directly
- ❌ Loops can't check "did user practice today"
- ❌ Loops can't calculate streaks or access sessions table

**Solution:** Do the logic in Supabase cronjob, send event to Loops
- ✅ Cronjob queries database (sessions, vocabulary, profiles)
- ✅ Cronjob calculates eligibility (practiced today? correct timezone? correct frequency?)
- ✅ Cronjob calculates personalization data (streak, words_saved, etc.)
- ✅ Cronjob sends `practice_reminder_due` event to Loops with all data
- ✅ Loops immediately sends email with personalized properties

**Why this works:**
- Loops rate limit: **10 requests/second** (~600/min) - more than sufficient
- Event property limit: **500 characters per value** - our data is tiny (streak: "5", words_saved: "127")
- Cost: FREE at MVP scale (charged by contacts, not email volume)
- Simpler: One integration (Loops) instead of two (Loops + Resend)
- One dashboard for all email analytics

**Final Architecture: Loops Only**
- ✅ Lifecycle emails: Configured in Loops dashboard (no code)
- ✅ Practice reminders: Supabase cronjob + Loops event (custom logic + SaaS delivery)
- ✅ FREE for MVP (<1k users)
- ✅ Scales affordably
- ✅ Simpler than hybrid Resend approach

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      User Signup/Activity                     │
└──────────────────────────────────────────────────────────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
        ┌─────────────────┐      ┌──────────────────┐
        │ SvelteKit App   │      │ Supabase         │
        │ (Signup flow)   │      │ (Practice Data)  │
        └─────────────────┘      └──────────────────┘
                 │                         │
                 │ updateContact()         │ pg_cron (hourly)
                 │ sendEvent()             │
                 │                         ▼
                 │                ┌──────────────────────────┐
                 │                │ Edge Function            │
                 │                │ - Query sessions table   │
                 │                │ - Check timezone         │
                 │                │ - Check practice today   │
                 │                │ - Calculate streak       │
                 │                │ - Check practice_freq    │
                 │                └──────────────────────────┘
                 │                         │
                 │                         │ sendEvent()
                 │                         │ ('practice_reminder_due')
                 ▼                         ▼
        ┌────────────────────────────────────────┐
        │           Loops API                    │
        │  - Lifecycle emails (dashboard config) │
        │  - Practice reminders (event trigger)  │
        └────────────────────────────────────────┘
                              │
                              ▼
                      User's Inbox
```

## Timezone Support

**Storage:** Add `timezone` (TEXT) and `reminder_time` (INT 0-23) to profiles table
- Store IANA identifiers: "America/Los_Angeles", "America/New_York", "Asia/Tokyo"
- Default: "America/Los_Angeles" (or detect from browser on signup)
- Default reminder_time: 9 (9am local)

**Scheduling Strategy:**
- pg_cron runs Edge Function **every hour**
- Edge Function loops through ALL users
- For each user: Calculate their current local hour
- If local hour === reminder_time (e.g., 9), check eligibility and send
- Efficient: Only users at "their 9am" get processed each run

**Example:**
- User A in PT (UTC-8), reminder_time=9
- User B in ET (UTC-5), reminder_time=9
- User C in JST (UTC+9), reminder_time=9

At 5pm UTC:
- User A: 9am PT ✅ Send
- User B: 12pm ET ❌ Skip
- User C: 2am JST ❌ Skip

## Database Schema Changes

### Extend `profiles` table
Add 6 new columns:
- `email_practice_reminders` (boolean) - Toggle for practice reminders
- `email_lifecycle` (boolean) - Toggle for lifecycle emails
- `email_unsubscribe_token` (text, unique) - For one-click unsubscribe
- `timezone` (text) - IANA identifier like "America/Los_Angeles"
- `reminder_time` (integer 0-23) - Hour for daily reminders (default: 9)
- `created_at` (timestamptz) - For Loops signup date tracking

### Create `email_log` table
Track all sent emails for debugging:
- `user_id` (uuid, foreign key to profiles)
- `email_type` (text) - e.g., 'practice_reminder', 'lifecycle'
- `event_name` (text) - e.g., 'practice_reminder_due', 'user_inactive_7_days'
- `sent_at` (timestamptz) - When email was triggered
- `status` (text) - 'sent', 'failed', 'skipped'
- `metadata` (jsonb) - Event properties sent to Loops
- Used to prevent duplicate sends and track delivery

**Note:** Lifecycle email state tracked by Loops internally, not in our DB.

## Integration Points (High-Level)

### Loops Integration (Lifecycle Emails)
1. **Signup**: Call Loops API to create contact with user data
2. **Configure Campaigns**: In Loops dashboard, set up 4 drip emails:
   - Welcome (immediate)
   - Day 1 Features
   - Day 3 Tips
   - Day 7 Re-engagement (triggered by "inactive_user" event)
3. **Track Activity**: Send "session_completed" event to Loops when user practices
4. **Trigger Re-engagement**: Daily cron checks for inactive users (3+ days), sends "inactive_user" event to Loops

**Files to Create:**
- `src/lib/server/loops.ts` - Loops API wrapper (createContact, sendEvent)

**Files to Modify:**
- `src/routes/auth/callback/+server.ts` - Add user to Loops on signup
- `src/routes/chat/session/+server.ts` - Send "session_completed" event

### Practice Reminders Integration (Loops)
1. **Edge Function**: Runs hourly via pg_cron
2. **Logic**: For each user, check if it's their reminder_time in their timezone
3. **Eligibility**: Only send if user hasn't practiced today + respects practice_frequency
4. **Send**: Call Loops API with `sendEvent('practice_reminder_due', eventProperties)`

**Files to Create:**
- `supabase/functions/send-practice-reminders/index.ts` - Edge Function with timezone logic

**Supabase Setup:**
- pg_cron schedule (hourly): `0 * * * *`
- Edge Function deployed with secrets (LOOPS_SECRET_KEY, CRON_SECRET)

**Event Properties to Send:**
- `streak` (number) - Current daily streak
- `words_saved` (number) - Total vocabulary saved
- `total_conversation_minutes` (number) - Total practice time
- `practice_frequency` (string) - User's preference (daily/3x_weekly)
- `first_name` (string) - For personalization

**Loops Dashboard Setup:**
- Create Loop: "Practice Reminder"
- Trigger: "Event received" → `practice_reminder_due`
- Email template uses event properties for personalization

### User Settings UI
Create `/settings` page where users can:
- Toggle email_practice_reminders on/off
- Toggle email_lifecycle on/off
- Select timezone (dropdown of common timezones)
- Select reminder_time (dropdown 6am-11am)
- Change practice_frequency

**Files to Create:**
- `src/routes/settings/+page.svelte` - Settings UI
- `src/routes/settings/+page.server.ts` - Form actions
- `src/routes/settings/email/+page.server.ts` - Unsubscribe handler

## Cost Analysis

### MVP (<1,000 users)

| Service | Usage | Cost |
|---------|-------|------|
| **Loops** | <1,000 contacts, all emails (lifecycle + practice reminders) | **$0/mo** (free tier) |
| **Supabase** | Edge Functions, pg_cron | **$0** (included in Pro/Free) |
| **Total** | | **$0/month** |

**Why Loops is free regardless of email volume:**
- Loops charges by **contacts**, not email sends
- 500 users = 500 contacts = **free tier**
- Each user can receive unlimited emails (lifecycle + daily reminders)
- No per-email charges like Resend/SendGrid

**Email Volume (for reference):**
- 500 active users
- 50% enable practice reminders (250 users)
- Daily reminders: 250 emails/day = 7,500/mo
- Lifecycle: 4 emails per user = 2,000/mo (one-time per cohort)
- **Total: ~9,500 emails/month** - all covered by Loops free tier

### Growth Phase (5,000 users)

| Service | Usage | Cost |
|---------|-------|------|
| **Loops** | 5,000 contacts | **$49/mo** |
| **Supabase** | Edge Functions | **$0** (included) |
| **Total** | | **$49/month** |

**Savings vs. Resend approach:** $20/month (no Resend subscription needed)

### Scale (10,000 users)

| Service | Usage | Cost |
|---------|-------|------|
| **Loops** | 10,000 contacts | **$99/mo** (estimate) |
| **Supabase** | Edge Functions | **$0** (included) |
| **Total** | | **$99/month** |

**Savings vs. Resend approach:** $20/month (no Resend subscription needed)

### Alternative: Customer.io at Scale

If you needed more advanced segmentation/analytics:

| Service | Usage | Cost |
|---------|-------|------|
| **Customer.io** | 10,000 profiles | **$200/mo** (estimate) |
| **Total** | | **$200/month** |

**Verdict:** Loops-only approach saves $20/month (vs. Loops+Resend hybrid) and $100+/month (vs. Customer.io)

## Implementation Phases

### Phase 1: Database & Loops Setup (Week 1)
**Goal:** Get lifecycle emails working

1. Run database migration (add columns to profiles, create email_log)
2. Sign up for Loops, verify domain
3. Create `src/lib/server/loops.ts` wrapper
4. Modify signup flow to add users to Loops
5. Configure 4 campaigns in Loops dashboard
6. Test with your own account

**Deliverable:** New users receive welcome email sequence

### Phase 2: Practice Reminders Foundation (Week 2)
**Goal:** Get practice reminders working (fixed timezone first)

1. Create practice reminder email template in Loops dashboard
2. Configure Loop: Trigger "Event received" → `practice_reminder_due`
3. Create Edge Function (start with UTC-only, no timezone logic yet)
4. Edge Function logic: Query users, calculate eligibility, send Loops event
5. Setup pg_cron hourly schedule
6. Test manually with your account

**Deliverable:** Practice reminders working at 9am UTC using Loops

### Phase 3: Timezone Support (Week 3)
**Goal:** Per-user timezone for reminders

1. Add timezone picker to onboarding flow (set default)
2. Update Edge Function with timezone calculation logic
3. Test with multiple timezones (PT, ET, JST)
4. Add timezone selector to settings page

**Deliverable:** Reminders sent at user's local 9am

### Phase 4: Settings & Polish (Week 4)
**Goal:** User control and monitoring

1. Create `/settings` page with email preferences
2. Add unsubscribe handler
3. Display recent emails in settings (query email_log table)
4. Monitor Loops analytics for delivery tracking
5. Add link to settings from dashboard/navbar
6. Run full end-to-end test

**Deliverable:** Users can manage all email preferences

## Testing Strategy

**Avoid Spamming Users:**
1. Add `is_test_user` boolean to profiles
2. During development, filter Edge Function to only `is_test_user = true`
3. Create email preview endpoint (`/api/email-preview`) to view templates without sending
4. Use Loops test mode for lifecycle emails
5. Manual invocation: `curl` Edge Function directly to test

**Production Rollout:**
1. Start with 10% of users (random sample)
2. Monitor email_log for failures/bounces
3. Check Loops analytics for open rates
4. Gradually increase to 100% over 1 week

## Risk Mitigation

**What if Loops goes down?**
- All emails fail gracefully (lifecycle + practice reminders)
- No data loss - events are queued by Edge Function
- Retry logic can be added to Edge Function

**What if too many emails sent (bug)?**
- email_log prevents duplicates (check sent_at today)
- Loops has rate limits (10 req/sec) - protects against runaway loops
- Can pause pg_cron immediately if needed

**What if timezone logic breaks?**
- Falls back to UTC
- Still functional, just wrong time for some users
- email_log metadata includes timezone for debugging

**What if rate limit is hit?**
- Edge Function can throttle to stay under 10 req/sec
- Batch processing with delays between API calls
- Monitor x-ratelimit-remaining header

## Success Metrics

Track in PostHog/Analytics and Loops Dashboard:
- **Email open rates** (via Loops analytics)
- **Click-through rates** (CTR to /chat from emails)
- **Practice conversion**: % of reminder recipients who practice within 2 hours
- **Re-engagement effectiveness**: % of "we miss you" recipients who return
- **Unsubscribe rate** (should be <2%)
- **Delivery rate** (via Loops dashboard)

## Implementation Summary for Practice Reminders

### Architecture Decision: Loops-Only (Revised 2024-12-09)

**Original Plan:** Supabase Edge Function + Resend for practice reminders
**Revised Plan:** Supabase Edge Function + Loops for practice reminders

**Why we changed:**
1. **Loops rate limits are sufficient** - 10 req/sec (~600/min) handles all scenarios
2. **Payload limits are fine** - 500 chars per value, our data is tiny
3. **Cost savings** - $20/month saved by not needing Resend
4. **Simpler architecture** - One integration (Loops) instead of two
5. **One dashboard** - All email analytics in Loops

### Implementation Checklist (Ready for Tomorrow)

**1. Database Schema Updates**
- [ ] Add `email_practice_reminders` (boolean) to profiles table
- [ ] Add `timezone` (text) to profiles table - IANA identifier
- [ ] Add `reminder_time` (integer 0-23) to profiles table
- [ ] Create `email_log` table for tracking sent emails
- [ ] Add index on profiles(email_practice_reminders, timezone, reminder_time)

**2. Supabase Edge Function**
- [ ] Create `supabase/functions/send-practice-reminders/index.ts`
- [ ] Query logic: Find users where local hour === reminder_time
- [ ] Eligibility check: No session today (check sessions.created_at)
- [ ] Eligibility check: Respect practice_frequency (daily vs 3x_weekly)
- [ ] Calculate personalization data: streak, words_saved, total_conversation_minutes
- [ ] Call Loops `sendEvent('practice_reminder_due', eventProperties)`
- [ ] Log to email_log table (prevent duplicates)
- [ ] Deploy with secrets: LOOPS_SECRET_KEY, CRON_SECRET

**3. pg_cron Schedule**
- [ ] Setup hourly cron: `0 * * * *`
- [ ] Invoke Edge Function URL with CRON_SECRET header
- [ ] Test with manual invocation first

**4. Loops Dashboard**
- [ ] Create Loop: "Practice Reminder"
- [ ] Trigger: "Event received" → `practice_reminder_due`
- [ ] Email template with event properties:
  - `{{streak}}` - Current daily streak
  - `{{words_saved}}` - Total vocabulary saved
  - `{{total_conversation_minutes}}` - Total practice time
  - `{{first_name}}` - User's first name
- [ ] Use plain text, conversational tone (avoid Promotions tab)

**5. Testing Strategy**
- [ ] Add `is_test_user` boolean to profiles
- [ ] Filter Edge Function to only send to test users initially
- [ ] Manually test with your own account in multiple timezones
- [ ] Verify email_log prevents duplicates
- [ ] Check Loops analytics for delivery

### Key Technical Details

**Timezone Calculation Logic:**
```typescript
// For each user in profiles where email_practice_reminders = true
const userLocalHour = DateTime.now().setZone(user.timezone).hour;
if (userLocalHour === user.reminder_time) {
  // Check eligibility and send event to Loops
}
```

**Event Properties Format:**
```typescript
{
  userId: user.id,
  eventName: 'practice_reminder_due',
  eventProperties: {
    streak: 5,
    words_saved: 127,
    total_conversation_minutes: 45,
    practice_frequency: 'daily',
    first_name: 'John'
  }
}
```

**Rate Limiting:**
- Process users in batches
- Throttle to stay under 10 req/sec
- Use Promise.all for parallel database queries
- Sequential Loops API calls with delays if needed

### Files Already Implemented

✅ `src/lib/server/loops.ts` - Loops API wrapper (exists)
✅ `src/routes/auth/callback/+server.ts` - User signup to Loops (exists)
✅ `src/routes/chat/session/+server.ts` - Session events to Loops (exists)

### Current Status

**Lifecycle emails:** ✅ Implemented
- Welcome email (immediate)
- First conversation completed email
- Working on: 7-day re-engagement email

**Practice reminders:** ⏳ Not started yet
- Database schema changes needed
- Edge Function needs to be created
- Loops dashboard needs configuration

## Sources

- [Loops API Introduction](https://loops.so/docs/api-reference/intro) - Rate limits documentation
- [Loops Event Properties](https://loops.so/docs/events/properties) - Payload size limits
- [Loops vs Customer.io comparison](https://zapier.com/blog/best-drip-email-marketing-apps/)
- [Email deliverability benchmarks](https://www.emailtooltester.com/en/blog/email-deliverability-statistics/)
- [Best transactional email services 2025](https://www.emailtooltester.com/en/blog/best-transactional-email-service/)
- [Timezone storage best practices](https://softwareengineering.stackexchange.com/questions/196156/what-is-the-best-practice-for-saving-timezones-in-the-database)
- [Supabase Edge Functions scheduling](https://supabase.com/docs/guides/functions/schedule-functions)
- [Customer.io timezone matching](https://docs.customer.io/journeys/timezone-match/)
- [Email drip campaign best practices](https://mailchimp.com/resources/email-drip-campaign-examples/)

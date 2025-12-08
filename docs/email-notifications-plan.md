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

**Practice Reminders: Custom (Supabase Edge Function + Resend)**
- Needs complex logic (check if practiced today, respect frequency, calculate streak)
- Timezone-aware sending (9am local time varies by user)
- Resend API for sending (3,000 free/month, then $20/50k emails)
- 95-99% deliverability, webhooks, analytics included
- pg_cron triggers hourly check

### Why Not Use Only One Solution?

**Option 1: Only Loops**
- ❌ Can't check "did user practice today before sending reminder"
- ❌ No access to sessions table for streak calculation
- ❌ Limited custom logic for practice_frequency

**Option 2: Only Customer.io ($100/mo minimum)**
- ✅ Could handle everything with custom logic
- ❌ Expensive for early stage ($100/mo vs free)
- ❌ Overkill for simple lifecycle emails

**Option 3: All custom (Edge Functions for everything)**
- ✅ Maximum control
- ❌ Have to build drip campaign logic from scratch
- ❌ More code to maintain
- ❌ Lifecycle emails are commodity - why reinvent?

**Hybrid Approach (Recommended)**
- ✅ Loops handles commodity lifecycle emails (no code)
- ✅ Custom logic only where needed (practice reminders)
- ✅ FREE for MVP (<1k users)
- ✅ Scales affordably

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
        │ Loops API       │      │ Supabase         │
        │ (Lifecycle)     │      │ (Practice Data)  │
        └─────────────────┘      └──────────────────┘
                 │                         │
                 │                         │
         Welcome, Tips,            pg_cron (hourly)
         Re-engagement                     │
                 │                         ▼
                 │                ┌──────────────────┐
                 │                │ Edge Function    │
                 │                │ (Check timezone, │
                 │                │  practice status)│
                 │                └──────────────────┘
                 │                         │
                 │                         ▼
                 │                ┌──────────────────┐
                 │                │ Resend API       │
                 │                │ (Send reminder)  │
                 │                └──────────────────┘
                 │                         │
                 └─────────────────────────┘
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
- `user_id`, `email_type`, `sent_at`, `status`, `resend_id`, `metadata`
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

### Resend Integration (Practice Reminders)
1. **Edge Function**: Runs hourly via pg_cron
2. **Logic**: For each user, check if it's their reminder_time in their timezone
3. **Eligibility**: Only send if user hasn't practiced today + respects practice_frequency
4. **Send**: Call Resend API with personalized reminder (includes streak)

**Files to Create:**
- `src/lib/server/email.ts` - Resend wrapper using Resend SDK
- `src/lib/server/email-templates/` - HTML email templates (base + practice reminder)
- `supabase/functions/send-practice-reminders/index.ts` - Edge Function with timezone logic

**Supabase Setup:**
- pg_cron schedule (hourly): `0 * * * *`
- Edge Function deployed with secrets (RESEND_API_KEY, CRON_SECRET)

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
| **Loops** | <1,000 contacts, lifecycle emails | **$0/mo** (free tier) |
| **Resend** | ~5k practice reminders/mo | **$0/mo** (free 3k/mo) |
| **Supabase** | Edge Functions, pg_cron | **$0** (included in Pro/Free) |
| **Total** | | **$0/month** |

**Assumptions:**
- 500 active users
- 50% enable practice reminders
- Daily: 250 emails/day = 7,500/mo
- 3x weekly: 125 emails/day = 3,750/mo
- Average: ~5,000 practice reminder emails/month
- Lifecycle: 4 emails per user = 2,000/mo (one-time per cohort)
- **Total: ~7,000 emails/month** - exceeds Resend free tier (3k/mo)

**Note:** At ~500 users, you'll need Resend paid plan ($20/mo) once volume exceeds 3k/month. This happens around 300-400 active users with daily reminders enabled.

### Growth Phase (5,000 users)

| Service | Usage | Cost |
|---------|-------|------|
| **Loops** | 5,000 contacts | **$49/mo** |
| **Resend** | ~25k practice reminders/mo | **$20/mo** (50k limit) |
| **Supabase** | Edge Functions | **$0** (included) |
| **Total** | | **$69/month** |

### Scale (10,000 users)

| Service | Usage | Cost |
|---------|-------|------|
| **Loops** | 10,000 contacts | **$99/mo** (estimate) |
| **Resend** | ~50k practice reminders/mo | **$20/mo** |
| **Supabase** | Edge Functions | **$0** (included) |
| **Total** | | **$119/month** |

### Alternative: Customer.io at Scale

If you needed more advanced segmentation/analytics:

| Service | Usage | Cost |
|---------|-------|------|
| **Customer.io** | 10,000 profiles | **$200/mo** (estimate) |
| **Total** | | **$200/month** |

**Verdict:** Hybrid approach saves $80+/month at 10k users vs. Customer.io

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

1. Sign up for Resend, verify domain (SPF/DKIM/DMARC)
2. Create `src/lib/server/email.ts` wrapper using Resend SDK
3. Create practice reminder email template (React Email or plain HTML)
4. Create Edge Function (start with UTC-only, no timezone logic yet)
5. Setup pg_cron hourly schedule
6. Test manually with your account

**Deliverable:** Practice reminders working at 9am UTC using Resend

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
3. Display recent emails in settings
4. Setup Resend webhooks for delivery tracking
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
- Lifecycle emails fail gracefully
- Practice reminders unaffected
- Users still get core value (practice reminders)

**What if too many emails sent (bug)?**
- email_log prevents duplicates (check sent_at today)
- Resend has rate limits (won't bankrupt you)
- Can pause pg_cron immediately if needed

**What if timezone logic breaks?**
- Falls back to UTC
- Still functional, just wrong time for some users
- email_log metadata includes timezone for debugging

## Success Metrics

Track in PostHog/Analytics:
- **Email open rates** (via Resend/Loops)
- **Click-through rates** (CTR to /chat from emails)
- **Practice conversion**: % of reminder recipients who practice within 2 hours
- **Re-engagement effectiveness**: % of "we miss you" recipients who return
- **Unsubscribe rate** (should be <2%)

## Resend Setup Checklist

**Initial Setup:**
1. Create Resend account at [resend.com](https://resend.com)
2. Verify domain ownership (add DNS records for SPF, DKIM, DMARC)
3. Generate API key from dashboard
4. Install SDK: `pnpm add resend`

**Configuration:**
- Free tier: 3,000 emails/month (1-day log retention)
- Paid tier: $20/month for 50,000 emails (3-month log retention)
- Upgrade when volume exceeds 3k/month (around 300-400 active users)

**Features Available:**
- ✅ 95-99% deliverability with dedicated infrastructure
- ✅ Webhooks for bounce/complaint tracking
- ✅ Analytics dashboard (opens, clicks, bounces)
- ✅ Region-based sending (reduce latency)
- ✅ React Email support for templates

## Sources

- [Resend pricing and features](https://resend.com/pricing)
- [Email deliverability benchmarks](https://www.emailtooltester.com/en/blog/email-deliverability-statistics/)
- [Best transactional email services 2025](https://www.emailtooltester.com/en/blog/best-transactional-email-service/)
- [Loops vs Customer.io comparison](https://zapier.com/blog/best-drip-email-marketing-apps/)
- [Timezone storage best practices](https://softwareengineering.stackexchange.com/questions/196156/what-is-the-best-practice-for-saving-timezones-in-the-database)
- [Supabase Edge Functions scheduling](https://supabase.com/docs/guides/functions/schedule-functions)
- [Customer.io timezone matching](https://docs.customer.io/journeys/timezone-match/)
- [Email drip campaign best practices](https://mailchimp.com/resources/email-drip-campaign-examples/)

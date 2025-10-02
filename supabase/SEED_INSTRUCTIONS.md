# Mock Events Setup Instructions

This guide will help you populate your Opciion platform with 3 realistic mock events for testing and demonstration purposes.

## Events Included

1. **React & TypeScript Workshop** (FREE)
   - Date: November 15, 2025
   - Location: San Francisco, CA
   - Category: Technology
   - Capacity: 50 attendees
   - Includes: 4 FAQ items, 1 ticket type

2. **Future of Business 2025 Conference** (PAID - $299-$599)
   - Date: November 28, 2025
   - Location: New York, NY
   - Category: Business
   - Capacity: 500 attendees
   - Includes: 5 FAQ items, 3 ticket types (Early Bird, Standard, VIP)

3. **Winter City Marathon 2025** (PAID - $45-$95)
   - Date: December 14, 2025
   - Location: Chicago, IL
   - Category: Outdoor
   - Capacity: 1000 participants
   - Includes: 6 FAQ items, 3 ticket types (10K, Half Marathon, Full Marathon)

## Prerequisites

Before running the seed script, you need:

1. ✅ Supabase database setup complete (run `SETUP_DATABASE.sql` first)
2. ✅ At least one user account created in your application

## Step-by-Step Instructions

### Step 1: Create a User Account

1. Start your development server (if not already running):
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/auth`

3. Sign up with any email and password, for example:
   - Email: `organizer@example.com`
   - Password: `SecurePassword123!`

4. The system will automatically create a profile for you

### Step 2: Get Your User ID

**Option A: Using Supabase Dashboard**

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Find your newly created user
4. Copy the **User ID** (UUID format)

**Option B: Using SQL Query**

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this query:
   ```sql
   SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 1;
   ```
3. Copy the `id` value

### Step 3: Run the Seed Script

1. Open **SQL Editor** in your Supabase Dashboard

2. Open the file: `supabase/seed-mock-events.sql`

3. **IMPORTANT**: The script will automatically use the first user it finds. If you want to use a specific user:
   - Find the line with `SELECT id INTO v_user_id FROM auth.users LIMIT 1;`
   - Replace it with: `v_user_id := 'YOUR-USER-ID-HERE';`

4. Copy and paste the entire SQL script into the SQL Editor

5. Click **Run** (or press Cmd/Ctrl + Enter)

### Step 4: Verify the Events Were Created

**Check in SQL Editor:**
```sql
SELECT id, title, status, featured, date, price
FROM events
ORDER BY date;
```

You should see 3 events with `published` status.

**Check in Your App:**

1. Navigate to: `http://localhost:5173/`
2. Scroll to the "Featured Events" section
3. You should see all 3 events displayed

4. Or go directly to: `http://localhost:5173/events`
5. All 3 events should be visible

### Step 5: View Your Events in Dashboard

1. Navigate to: `http://localhost:5173/dashboard`
2. Toggle to **Event Creator** mode
3. You should see the 3 events you created under "Upcoming Events"

## What Gets Created

### Database Records

- **3 Events** in `events` table
  - All with `status = 'published'`
  - All with `featured = true`
  - Future dates (November & December 2025)

- **15 FAQ Items** in `faq_items` table
  - 4 for Event 1 (Workshop)
  - 5 for Event 2 (Conference)
  - 6 for Event 3 (Marathon)

- **7 Ticket Types** in `ticket_types` table
  - 1 free ticket (Workshop)
  - 3 paid tiers (Conference: $299, $399, $599)
  - 3 paid distances (Marathon: $45, $75, $95)

### Event Details

Each event includes:
- ✅ Rich HTML overview content
- ✅ Multiple FAQ entries
- ✅ Ticket types with pricing
- ✅ Confirmation messages
- ✅ Email templates with variable substitution
- ✅ Hashtags for categorization
- ✅ Proper date/time formatting

## Troubleshooting

### Issue: "No users found"

**Solution**: You need to create a user first through the app's sign-up flow at `/auth`.

### Issue: Events not appearing in discovery

**Check these:**

1. Verify events are published:
   ```sql
   SELECT id, title, status FROM events;
   ```
   Status should be `'published'`

2. Verify dates are in the future:
   ```sql
   SELECT title, date, start_date FROM events;
   ```

3. Check if the event filtering is working:
   - The app filters out expired events
   - Make sure your system date is before November 15, 2025

### Issue: "Permission denied" or RLS errors

**Solution**: Make sure you're signed in to the app and the organizer_id matches your user ID.

Check with:
```sql
SELECT
  e.title,
  e.organizer_id,
  u.email as organizer_email
FROM events e
LEFT JOIN auth.users u ON u.id = e.organizer_id;
```

### Issue: FAQ or Tickets not showing

**Check the relationships:**
```sql
-- Check FAQs
SELECT e.title, COUNT(f.id) as faq_count
FROM events e
LEFT JOIN faq_items f ON f.event_id = e.id
GROUP BY e.id, e.title;

-- Check Tickets
SELECT e.title, COUNT(t.id) as ticket_count
FROM events e
LEFT JOIN ticket_types t ON t.event_id = e.id
GROUP BY e.id, e.title;
```

## Resetting / Re-running

If you want to clear the mock data and start over:

```sql
-- Delete all mock event data
DELETE FROM faq_items WHERE event_id IN (
  SELECT id FROM events WHERE title IN (
    'React & TypeScript Workshop',
    'Future of Business 2025 Conference',
    'Winter City Marathon 2025'
  )
);

DELETE FROM ticket_types WHERE event_id IN (
  SELECT id FROM events WHERE title IN (
    'React & TypeScript Workshop',
    'Future of Business 2025 Conference',
    'Winter City Marathon 2025'
  )
);

DELETE FROM events WHERE title IN (
  'React & TypeScript Workshop',
  'Future of Business 2025 Conference',
  'Winter City Marathon 2025'
);
```

Then run the seed script again.

## Next Steps

After seeding the events:

1. **Browse Events**: Visit `/events` to see the discovery page
2. **View Details**: Click on any event to see its full details (once detail page is implemented)
3. **Test Registration**: Try the registration flow
4. **Check Dashboard**: View events in your organizer dashboard
5. **Test Search**: Use the search bar to find events by keyword
6. **Test Filters**: Click category badges to filter events

## Adding Images

The seed script doesn't include images since Supabase Storage requires actual file uploads. To add event images:

1. Navigate to `/create-event` (or edit an existing event when edit feature is added)
2. Upload images for each event
3. Recommended placeholder images from [Unsplash](https://unsplash.com/):
   - **Workshop**: Tech/coding related images
   - **Conference**: Business meeting/conference hall images
   - **Marathon**: Running/athletics images

Or use stock photos from [Pexels](https://www.pexels.com/):
- Search: "tech workshop", "business conference", "marathon running"
- Copy image URLs and update events via SQL:
  ```sql
  UPDATE events
  SET main_image_url = 'https://example.com/image.jpg'
  WHERE title = 'React & TypeScript Workshop';
  ```

---

**Questions or Issues?**

Check the main documentation in `SUPABASE_SETUP_INSTRUCTIONS.md` for more details about the database setup and configuration.

# Supabase Setup Instructions

Follow these steps to set up your Supabase database completely.

## Step 1: Access Your Supabase Dashboard

Go to: https://0ec90b57d6e95fcbda19832f.supabase.co

## Step 2: Disable Email Confirmation (For Development)

1. In the dashboard, navigate to **Authentication** → **Providers**
2. Click on **Email** provider
3. Scroll down and toggle **OFF** "Confirm email"
4. Click **Save**

This allows users to sign up without needing to confirm their email (easier for testing).

## Step 3: Run Database Setup

1. In the dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the file `supabase/SETUP_DATABASE.sql` from your project
4. Copy and paste the entire contents into the SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)

This will create all tables, relationships, policies, triggers, and indexes.

## Step 4: Run Storage Setup

1. Still in the **SQL Editor**, click **New Query**
2. Open the file `supabase/SETUP_STORAGE.sql` from your project
3. Copy and paste the entire contents into the SQL Editor
4. Click **Run**

This will create storage buckets for images (avatars, event images, module images).

## Step 5: Verify Setup

### Check Tables
1. Go to **Table Editor** in the dashboard
2. You should see these tables:
   - profiles
   - events
   - event_registrations
   - event_modules
   - module_fields
   - ticket_types
   - faq_items

### Check Storage
1. Go to **Storage** in the dashboard
2. You should see these buckets:
   - avatars (public)
   - event-images (public)
   - module-images (public)

## Step 6: Test User Creation

1. In your app, go to the signup page
2. Create a new user account
3. Check **Authentication** → **Users** in the dashboard
4. You should see your new user
5. Check **Table Editor** → **profiles** table
6. You should see a profile created automatically for the user

## Troubleshooting

### Users not appearing in profiles table?
- Make sure the trigger `on_auth_user_created` was created successfully
- Check the **Database** → **Functions** section for `handle_new_user`
- Try creating a new user after confirming the trigger exists

### Can't upload images?
- Verify storage buckets were created in **Storage** section
- Check that policies exist for each bucket
- Make sure buckets are set to **public**

### RLS Errors?
- All tables have Row Level Security enabled
- Make sure you're signed in when testing
- Check the policies in **Authentication** → **Policies**

## Database Schema Overview

### Core Tables
- **profiles**: User profiles with display name, avatar, role, and bio
- **events**: Event information with dates, location, pricing, and status
- **event_registrations**: Links users to events they've registered for

### Custom Modules System
- **event_modules**: Modular components (tickets, transportation, hospitality, custom)
- **module_fields**: Custom fields for each module
- **ticket_types**: Different ticket options for events
- **faq_items**: Frequently asked questions for events

### Image Storage
- **avatars bucket**: User profile pictures organized by user_id
- **event-images bucket**: Event photos and galleries
- **module-images bucket**: Images for custom modules

All tables have proper Row Level Security policies ensuring users can only access and modify their own data, while allowing public read access to published content.

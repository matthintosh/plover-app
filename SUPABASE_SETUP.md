# Supabase Setup Guide

This guide will help you set up Supabase for the Plover application.

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in project details:
   - **Name**: Plover App (or your preferred name)
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get Your Credentials

1. Once your project is ready, go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in the project root (if it doesn't exist)
2. Add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: Never commit `.env.local` to git (it's already in `.gitignore`)

## Step 4: Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order from `database/migrations/`:
   - `001_create_periodontist.sql`
   - `002_create_patient.sql`
   - `003_create_diagnosis.sql`
   - `004_create_risk_factor.sql`
   - `005_create_onboarding_response.sql`
   - `006_create_daily_check_in.sql`
   - `007_create_oral_hygiene_recommendation.sql`
   - `008_create_odontogram.sql`
   - `009_create_article.sql`
   - `010_create_indexes.sql`

4. For each file:
   - Click "New Query"
   - Copy the entire contents of the migration file
   - Paste into the SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)
   - Verify success message

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run all migrations
supabase db push
```

## Step 5: Verify Database Setup

1. Go to **Table Editor** in Supabase dashboard
2. Verify all tables are created:
   - periodontist
   - patient
   - diagnosis
   - risk_factor
   - onboarding_response
   - daily_check_in
   - oral_hygiene_recommendation
   - odontogram
   - article

3. Check that RLS is enabled:
   - Click on each table
   - Go to "Policies" tab
   - Verify policies are created

## Step 6: Generate TypeScript Types

After migrations are complete, update the TypeScript types:

### Option A: Using Supabase Dashboard

1. Go to **Settings** → **API**
2. Scroll to "TypeScript types"
3. Click "Generate types"
4. Copy the generated types
5. Replace contents of `src/lib/supabase/types.ts`

### Option B: Using Supabase CLI

```bash
npx supabase gen types typescript --project-id your-project-id > src/lib/supabase/types.ts
```

## Step 7: Configure Authentication

### Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize magic link email template

### Configure Magic Link Settings

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your app URL (e.g., `exp://localhost:8081` for development)
3. Add redirect URLs:
   - `exp://localhost:8081/**` (Expo development)
   - `plover://**` (Deep linking - if configured)

## Step 8: Set Up Storage (Optional - for article thumbnails)

1. Go to **Storage**
2. Create a new bucket named `article-thumbnails`
3. Set bucket to **Public** (or configure policies as needed)
4. Configure CORS if needed for web access

## Step 9: Test Connection

1. Start your development server:
   ```bash
   npm start
   ```

2. The Supabase client should initialize without errors
3. Check the console for any warnings about missing credentials

## Troubleshooting

### "Supabase URL or Anon Key is missing" Warning

- Verify `.env.local` exists and contains correct values
- Restart your development server after creating `.env.local`
- Check that variable names match exactly: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Migration Errors

- Ensure migrations are run in order (001 through 010)
- Check that previous migrations completed successfully
- Review error messages in Supabase SQL Editor

### RLS Policy Errors

- Verify that `auth.uid()` is being set correctly
- Check that users are authenticated before accessing data
- Review RLS policy conditions in each migration file

### Type Generation Issues

- Ensure all migrations have been run
- Verify Supabase project is accessible
- Check that project ID is correct

## Next Steps

Once Supabase is set up:

1. ✅ T011 is complete (you've created the project)
2. Run the migrations (T012-T022 are ready)
3. Update TypeScript types (T024)
4. Begin implementing User Story 1 (authentication features)

## Security Notes

- **Never commit** `.env.local` to version control
- The `anon` key is safe to use in client-side code (it's public)
- RLS policies enforce data access control
- For production, consider:
  - Setting up custom domains
  - Configuring CORS properly
  - Reviewing RLS policies
  - Setting up database backups
  - Configuring monitoring and alerts


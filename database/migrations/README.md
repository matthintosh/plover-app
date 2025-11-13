# Database Migrations

This directory contains SQL migration files for setting up the Plover application database in Supabase.

## Setup Instructions

### 1. Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Create a new project
3. Wait for the project to be provisioned
4. Go to Project Settings → API
5. Copy your:
   - Project URL
   - Anon (public) key

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Migrations

#### Option A: Using Supabase Dashboard (Recommended for initial setup)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run each migration file in order (001 through 010):
   - Copy the contents of each file
   - Paste into SQL Editor
   - Click "Run"

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Verify Setup

After running migrations, verify:

1. All tables are created (check in Table Editor)
2. RLS is enabled on all tables
3. Indexes are created
4. Triggers are working

### 5. Generate TypeScript Types

After migrations are complete, generate TypeScript types:

```bash
npx supabase gen types typescript --project-id your-project-id > src/lib/supabase/types.ts
```

Or use the Supabase dashboard:
1. Go to Settings → API
2. Scroll to "TypeScript types"
3. Copy the generated types
4. Replace contents of `src/lib/supabase/types.ts`

## Migration Order

Migrations must be run in this order due to foreign key dependencies:

1. `001_create_periodontist.sql` - Base table
2. `002_create_patient.sql` - Depends on periodontist
3. `003_create_diagnosis.sql` - Depends on patient and periodontist
4. `004_create_risk_factor.sql` - Depends on patient and periodontist
5. `005_create_onboarding_response.sql` - Depends on patient
6. `006_create_daily_check_in.sql` - Depends on patient
7. `007_create_oral_hygiene_recommendation.sql` - Depends on patient and periodontist
8. `008_create_odontogram.sql` - Depends on oral_hygiene_recommendation
9. `009_create_article.sql` - Independent table
10. `010_create_indexes.sql` - Performance indexes

## Important Notes

- **RLS Policies**: All tables have Row Level Security enabled. Make sure to test authentication flows.
- **Auth Integration**: Periodontist authentication uses Supabase Auth. The `auth.uid()` in RLS policies should match the `periodontist.id`.
- **Patient Authentication**: Patients use magic links. The `patient.id` should match the Supabase Auth user ID when they authenticate via magic link.
- **Data Validation**: Constraints are enforced at the database level, but application-level validation is also required.

## Troubleshooting

### Migration Fails with Foreign Key Error
- Ensure migrations are run in order
- Check that previous migrations completed successfully

### RLS Policies Not Working
- Verify that `auth.uid()` is set correctly
- Check that users are authenticated before accessing data
- Review RLS policy conditions

### Type Generation Fails
- Ensure all migrations have been run
- Verify Supabase project is accessible
- Check that project ID is correct


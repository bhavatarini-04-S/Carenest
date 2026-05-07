# Supabase Database Setup

This directory contains SQL migration files for setting up the CareNest database schema.

## Database Tables

### 1. `user_profiles`
Stores additional user information beyond the default Supabase auth.users table.

**Columns:**
- `id` (UUID) - Primary key, references auth.users
- `email` (TEXT) - User's email address
- `name` (TEXT) - User's display name
- `age_group` (TEXT) - Age bracket: '18-24', '25-35', '35-45', '45+'
- `profession` (TEXT) - User's profession
- `is_anonymous` (BOOLEAN) - Whether user signed up anonymously
- `created_at` (TIMESTAMP) - Account creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Features:**
- Row Level Security (RLS) enabled
- Automatic profile creation on user signup via trigger
- Auto-updating `updated_at` timestamp
- Indexed for performance

### 2. `user_sessions`
Tracks user login/logout activity for analytics and security.

**Columns:**
- `id` (UUID) - Primary key
- `user_id` (UUID) - References auth.users
- `session_type` (TEXT) - Type: 'login', 'logout', 'signup', 'anonymous'
- `ip_address` (TEXT) - User's IP address
- `user_agent` (TEXT) - Browser/device user agent
- `device_info` (JSONB) - Additional device metadata
- `created_at` (TIMESTAMP) - Session timestamp

**Features:**
- Row Level Security (RLS) enabled
- Indexed for fast queries
- Supports analytics and security monitoring

## How to Apply Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of each migration file:
   - First: `migrations/20260507_create_user_profiles.sql`
   - Second: `migrations/20260507_create_user_sessions.sql`
5. Click **Run** for each query

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Push migrations to your database
supabase db push
```

### Option 3: Manual SQL Execution

1. Connect to your Supabase database using any PostgreSQL client
2. Execute the SQL files in order:
   ```sql
   \i migrations/20260507_create_user_profiles.sql
   \i migrations/20260507_create_user_sessions.sql
   ```

## Verification

After applying migrations, verify the tables were created:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'user_sessions');

-- Check RLS policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Automatic Profile Creation**: Profiles are created automatically on signup
- **Secure Policies**: INSERT, SELECT, and UPDATE policies enforce user ownership
- **Cascade Deletion**: User data is automatically deleted when auth user is deleted

## Next Steps

After setting up the database:

1. Update your application code to save user profiles
2. Implement session tracking in login/logout flows
3. Add analytics dashboards using the session data
4. Consider adding more tables for wellness journals, chat history, etc.

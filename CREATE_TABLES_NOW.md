# 🚨 NO TABLES FOUND - CREATE THEM NOW!

## Why You See "No Rows and Columns"

Your database tables **don't exist yet** because you haven't run the SQL migration script.

Think of it like this:
- ❌ You opened phpMyAdmin but the database is empty
- ✅ You need to create the tables first

---

## 🚀 CREATE YOUR TABLES NOW (5 Minutes)

### Step 1: Open SQL Editor in Supabase

1. Go to: https://supabase.com/dashboard
2. Click on your **CareNest** project
3. Click **"SQL Editor"** in the left sidebar (</> icon)
4. Click **"New Query"** button

---

### Step 2: Copy the SQL Script

Open the file: `supabase/APPLY_MIGRATIONS.sql` in your project

**OR** copy this complete script:

```sql
-- ============================================
-- CareNest Database Setup - Complete Script
-- ============================================

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    name TEXT,
    age_group TEXT CHECK (age_group IN ('18-25', '25-35', '35-45', '45+')),
    profession TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, is_anonymous)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.is_anonymous
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.user_profiles;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_age_group ON public.user_profiles(age_group);
CREATE INDEX IF NOT EXISTS idx_user_profiles_profession ON public.user_profiles(profession);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type TEXT CHECK (session_type IN ('login', 'logout', 'signup', 'anonymous')),
    ip_address TEXT,
    user_agent TEXT,
    device_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_sessions
CREATE POLICY "Users can view own sessions"
    ON public.user_sessions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
    ON public.user_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON public.user_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_type ON public.user_sessions(session_type);
```

---

### Step 3: Paste and Run

1. **Select ALL** the SQL script above (Ctrl+A)
2. **Copy** it (Ctrl+C)
3. **Paste** into the Supabase SQL Editor (Ctrl+V)
4. **Click "Run"** button (or press Ctrl+Enter)
5. **Wait** for "Success. No rows returned" message

---

### Step 4: Verify Tables Were Created

1. Click **"Table Editor"** in the left sidebar
2. You should now see:
   - ✅ **user_profiles** (your table!)
   - ✅ **user_sessions** (your table!)
   - ✅ **auth.users** (built-in)

---

## ✅ After Running the Script:

### What You'll See in Table Editor:

**Left Sidebar:**
```
📁 Tables
  ├─ auth.users
  ├─ user_profiles ← NEW!
  └─ user_sessions ← NEW!
```

**Click on "user_profiles":**
- You'll see columns: id, email, name, age_group, profession, is_anonymous, created_at, updated_at
- No rows yet (because no users have signed up)

**Click on "user_sessions":**
- You'll see columns: id, user_id, session_type, ip_address, user_agent, device_info, created_at
- No rows yet (because no one has logged in)

---

## 🧪 Test It:

After creating the tables:

1. Go to your app: http://localhost:5173/
2. Click "Create account"
3. Sign up with email and password
4. Select age group
5. Select profession
6. Go back to Supabase Table Editor
7. Click "user_profiles" → You'll see your data! 🎉
8. Click "user_sessions" → You'll see your signup session! 🎉

---

## ❌ Troubleshooting:

### "relation 'user_profiles' already exists"
- Tables already created! Just refresh Table Editor

### "permission denied"
- Make sure you're the project owner
- Check if you're logged into the correct Supabase account

### "syntax error"
- Make sure you copied the ENTIRE script
- Don't miss any lines

### Still no tables after running?
- Refresh the page (F5)
- Click "Table Editor" again
- Check if you're in the correct project

---

## 📸 Visual Guide:

```
Step 1: SQL Editor
  Supabase Dashboard
    → Your Project
      → SQL Editor (left sidebar) </>
        → New Query

Step 2: Paste Script
  [Paste the entire SQL script here]

Step 3: Run
  Click "Run" button at top right

Step 4: Verify
  Success message appears
  
Step 5: Check Tables
  → Table Editor (left sidebar) 📊
    → See user_profiles ✅
    → See user_sessions ✅
```

---

## 🎯 Quick Checklist:

- [ ] Open Supabase Dashboard
- [ ] Click your CareNest project
- [ ] Click "SQL Editor"
- [ ] Click "New Query"
- [ ] Copy the SQL script above
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Wait for "Success" message
- [ ] Click "Table Editor"
- [ ] See "user_profiles" and "user_sessions" tables ✅

---

**Do this now and your tables will appear!** 🚀

After running the script, go back to Table Editor and you'll see your tables!

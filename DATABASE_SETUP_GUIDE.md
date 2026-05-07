# 🚀 Database Setup Guide - Quick Start

## ✅ What's Been Done

I've already integrated the database functionality into your application:

1. ✅ **Auth.jsx** - Now saves user profiles and tracks login/signup sessions
2. ✅ **AgeSelect.jsx** - Saves selected age group to database
3. ✅ **ProfessionSelect.jsx** - Saves selected professions to database
4. ✅ **userProfile.js** - Helper functions created for database operations

## 📋 What You Need to Do

### Step 1: Apply Database Migrations (5 minutes)

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your CareNest project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste the SQL Script**
   - Open the file: `supabase/APPLY_MIGRATIONS.sql`
   - Copy the ENTIRE contents
   - Paste into the Supabase SQL Editor

4. **Run the Script**
   - Click the "Run" button (or press Ctrl+Enter)
   - Wait for "Success. No rows returned" message

5. **Verify Tables Were Created**
   - Click "Table Editor" in the left sidebar
   - You should see two new tables:
     - `user_profiles`
     - `user_sessions`

### Step 2: Test the Application

1. **Restart your dev server** (if it's running):
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Test the signup flow**:
   - Go to http://localhost:5173/
   - Click "Create account"
   - Enter email, password, and name
   - Click "Create my safe space"
   - Select your age group
   - Select your profession(s)

3. **Verify data was saved**:
   - Go back to Supabase Dashboard
   - Click "Table Editor" → "user_profiles"
   - You should see your profile data!
   - Click "user_sessions" to see login tracking

## 🎯 What Happens Now

### When users sign up:
- ✅ Account created in Supabase Auth
- ✅ Profile automatically created in `user_profiles` table
- ✅ Signup session tracked in `user_sessions` table
- ✅ Name saved (if provided)

### When users select age:
- ✅ Age group saved to `user_profiles.age_group`

### When users select profession:
- ✅ Professions saved to `user_profiles.profession`

### When users login:
- ✅ Login session tracked in `user_sessions` table
- ✅ Device info and user agent saved

### When users login anonymously:
- ✅ Anonymous profile created
- ✅ `is_anonymous` flag set to true
- ✅ Anonymous session tracked

## 📊 Database Schema

### user_profiles
```
id              UUID (Primary Key)
email           TEXT
name            TEXT
age_group       TEXT ('18-25', '25-35', '35-45', '45+')
profession      TEXT
is_anonymous    BOOLEAN
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### user_sessions
```
id              UUID (Primary Key)
user_id         UUID (Foreign Key)
session_type    TEXT ('login', 'logout', 'signup', 'anonymous')
ip_address      TEXT
user_agent      TEXT
device_info     JSONB
created_at      TIMESTAMP
```

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Automatic profile creation via database trigger
- Secure policies prevent unauthorized access
- Cascade deletion (user data deleted when account deleted)

## 🛠️ Available Functions

You can use these functions anywhere in your app:

```javascript
import { 
  saveUserProfile, 
  getUserProfile, 
  updateProfileField, 
  trackUserSession,
  getUserSessions 
} from '../lib/userProfile'

// Save/update profile
await saveUserProfile({ name: 'John', age_group: '25-35' })

// Get current user's profile
const { data } = await getUserProfile()

// Update single field
await updateProfileField('name', 'Jane')

// Track session
await trackUserSession('login')

// Get session history
const { data: sessions } = await getUserSessions(20)
```

## 🎨 Next Steps (Optional)

1. **Add a Profile Page** - Display user profile with edit functionality
2. **Add Session History** - Show users their login history
3. **Add Analytics Dashboard** - Track user engagement metrics
4. **Add More Tables** - For wellness journals, chat history, etc.

## ❓ Troubleshooting

### "relation 'user_profiles' does not exist"
- You haven't run the SQL migrations yet
- Go to Supabase SQL Editor and run `APPLY_MIGRATIONS.sql`

### "permission denied for table user_profiles"
- RLS policies might not be set up correctly
- Re-run the SQL migrations

### "Cannot read properties of null"
- User might not be authenticated
- Check if `supabase.auth.getUser()` returns a user

### Data not saving
- Check browser console for errors
- Verify Supabase credentials in `.env` file
- Make sure migrations were applied successfully

## 📞 Need Help?

Check these files for more details:
- `supabase/README.md` - Detailed database documentation
- `INTEGRATION_GUIDE.md` - Code examples and integration patterns
- `src/lib/userProfile.js` - Helper function implementations

---

**That's it! Your database is ready to store all user login and signup details! 🎉**

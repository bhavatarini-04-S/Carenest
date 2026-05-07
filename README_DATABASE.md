# CareNest - Database Integration

## 🎉 New Features Added

This update includes a complete database system for storing user profiles and tracking authentication sessions.

### ✅ What's New:

1. **User Profile Management**
   - Stores user information (name, email, age group, profession)
   - Automatic profile creation on signup
   - Support for anonymous users

2. **Session Tracking**
   - Tracks all login/logout events
   - Records device information and user agents
   - Supports analytics and security monitoring

3. **Database Helper Functions**
   - Easy-to-use functions for profile management
   - Session tracking utilities
   - Type-safe database operations

---

## 📁 New Files:

### Code Files:
- `src/lib/userProfile.js` - Database helper functions
- `src/pages/Auth.jsx` - Updated with profile saving
- `src/pages/AgeSelect.jsx` - Updated with age group saving
- `src/pages/ProfessionSelect.jsx` - Updated with profession saving

### Database Files:
- `supabase/migrations/20260507_create_user_profiles.sql` - User profiles table
- `supabase/migrations/20260507_create_user_sessions.sql` - Session tracking table
- `supabase/APPLY_MIGRATIONS.sql` - Combined migration script

### Documentation:
- `DATABASE_SETUP_GUIDE.md` - Complete setup instructions
- `INTEGRATION_GUIDE.md` - Code integration examples
- `SETUP_COMPLETE.md` - Overview of all changes
- `ENABLE_ANONYMOUS_AUTH.md` - Anonymous auth setup guide
- `VIEW_DATABASE.txt` - How to view database in Supabase
- `CHECKLIST.md` - Setup checklist
- `.env.example` - Environment variables template

---

## 🚀 Setup Instructions:

### 1. Clone and Install:
```bash
git clone <your-repo-url>
cd Carenest
npm install
```

### 2. Configure Environment Variables:
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your API keys:
# - Supabase URL and Anon Key
# - Google Gemini API Key
# - Groq API Key
```

### 3. Apply Database Migrations:
1. Go to Supabase Dashboard → Your Project
2. Click "SQL Editor"
3. Copy contents of `supabase/APPLY_MIGRATIONS.sql`
4. Paste and run in SQL Editor

### 4. Enable Anonymous Sign-In (Optional):
1. Go to Supabase Dashboard → Authentication → Providers
2. Scroll to "Anonymous Sign-ins"
3. Toggle ON and Save

### 5. Run the App:
```bash
npm run dev
```

---

## 📊 Database Schema:

### user_profiles
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | User ID (Primary Key) |
| email | TEXT | User's email |
| name | TEXT | Display name |
| age_group | TEXT | '18-25', '25-35', '35-45', '45+' |
| profession | TEXT | Selected professions |
| is_anonymous | BOOLEAN | Anonymous user flag |
| created_at | TIMESTAMP | Account creation |
| updated_at | TIMESTAMP | Last update |

### user_sessions
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Session ID (Primary Key) |
| user_id | UUID | User ID (Foreign Key) |
| session_type | TEXT | 'login', 'logout', 'signup', 'anonymous' |
| ip_address | TEXT | User's IP |
| user_agent | TEXT | Browser info |
| device_info | JSONB | Device metadata |
| created_at | TIMESTAMP | Session timestamp |

---

## 🔒 Security Features:

- ✅ Row Level Security (RLS) enabled
- ✅ Users can only access their own data
- ✅ Automatic profile creation via triggers
- ✅ Secure policies at database level
- ✅ API keys excluded from git via .gitignore

---

## 📚 Documentation:

For detailed information, see:
- `DATABASE_SETUP_GUIDE.md` - Step-by-step setup
- `INTEGRATION_GUIDE.md` - Code examples
- `SETUP_COMPLETE.md` - Complete overview

---

## 🛠️ Available Functions:

```javascript
import { 
  saveUserProfile, 
  getUserProfile, 
  updateProfileField, 
  trackUserSession,
  getUserSessions 
} from './src/lib/userProfile'

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

---

## 🎯 What Gets Stored:

- **On Signup:** Email, name, timestamp, signup session
- **On Age Selection:** Age group
- **On Profession Selection:** Selected professions
- **On Login:** Login timestamp, device info
- **On Anonymous Login:** Anonymous flag, session tracking

---

## 📞 Support:

For issues or questions:
1. Check the documentation files
2. Review Supabase dashboard for errors
3. Check browser console (F12) for client-side errors
4. Verify environment variables are set correctly

---

**Happy coding! 🚀**

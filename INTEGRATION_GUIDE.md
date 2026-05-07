# Database Integration Guide

## Overview
This guide shows how to integrate the user profile and session tracking features into your CareNest application.

## Step 1: Apply Database Migrations

Before using the profile features, you need to create the database tables in Supabase:

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Run the SQL files in `supabase/migrations/` folder in order:
   - `20260507_create_user_profiles.sql`
   - `20260507_create_user_sessions.sql`

See `supabase/README.md` for detailed instructions.

## Step 2: Update Auth Component

Modify `src/pages/Auth.jsx` to save user profiles and track sessions:

```javascript
import { saveUserProfile, trackUserSession } from '../lib/userProfile'

// In handleSubmit function, after successful signup/signin:
async function handleSubmit() {
    setLoading(true); setError('')
    try {
        if (tab === 'signup') {
            const { data, error } = await supabase.auth.signUp({ email, password })
            if (error) throw error
            setUser(data.user)
            
            // Save initial profile
            await saveUserProfile({
                name: name || null,
                is_anonymous: false
            })
            
            // Track signup session
            await trackUserSession('signup')
            
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error
            setUser(data.user)
            
            // Track login session
            await trackUserSession('login')
        }
        navigate('/onboarding/age')
    } catch (e) {
        // ... error handling
    }
    finally { setLoading(false) }
}

// In handleAnonymous function:
async function handleAnonymous() {
    setLoading(true)
    try {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) throw error
        setUser(data.user); setAnonymous(true)
        
        // Save anonymous profile
        await saveUserProfile({
            is_anonymous: true
        })
        
        // Track anonymous session
        await trackUserSession('anonymous')
        
        navigate('/onboarding/age')
    } catch (e) {
        // ... error handling
    }
    finally { setLoading(false) }
}
```

## Step 3: Update Age Selection Page

Modify `src/pages/AgeSelect.jsx` to save age group:

```javascript
import { updateProfileField } from '../lib/userProfile'

// When user selects age group:
async function handleAgeSelect(ageGroup) {
    await updateProfileField('age_group', ageGroup)
    navigate('/onboarding/profession')
}
```

## Step 4: Update Profession Selection Page

Modify `src/pages/ProfessionSelect.jsx` to save profession:

```javascript
import { updateProfileField } from '../lib/userProfile'

// When user selects profession:
async function handleProfessionSelect(profession) {
    await updateProfileField('profession', profession)
    navigate('/dashboard')
}
```

## Step 5: Track Logout

Add logout tracking wherever you handle user logout:

```javascript
import { trackUserSession } from '../lib/userProfile'

async function handleLogout() {
    await trackUserSession('logout')
    await supabase.auth.signOut()
    navigate('/auth')
}
```

## Step 6: Display User Profile

You can fetch and display user profile anywhere in your app:

```javascript
import { getUserProfile } from '../lib/userProfile'
import { useEffect, useState } from 'react'

function ProfileComponent() {
    const [profile, setProfile] = useState(null)
    
    useEffect(() => {
        async function loadProfile() {
            const { data } = await getUserProfile()
            setProfile(data)
        }
        loadProfile()
    }, [])
    
    if (!profile) return <div>Loading...</div>
    
    return (
        <div>
            <h2>Welcome, {profile.name || 'Friend'}!</h2>
            <p>Age Group: {profile.age_group}</p>
            <p>Profession: {profile.profession}</p>
        </div>
    )
}
```

## Step 7: View Session History

Display user's login history:

```javascript
import { getUserSessions } from '../lib/userProfile'
import { useEffect, useState } from 'react'

function SessionHistory() {
    const [sessions, setSessions] = useState([])
    
    useEffect(() => {
        async function loadSessions() {
            const { data } = await getUserSessions(20)
            setSessions(data || [])
        }
        loadSessions()
    }, [])
    
    return (
        <div>
            <h3>Recent Activity</h3>
            {sessions.map(session => (
                <div key={session.id}>
                    <strong>{session.session_type}</strong>
                    <span>{new Date(session.created_at).toLocaleString()}</span>
                    <span>{session.device_info?.platform}</span>
                </div>
            ))}
        </div>
    )
}
```

## Available Functions

### `saveUserProfile(profileData)`
Create or update user profile with name, age_group, profession, etc.

### `getUserProfile()`
Fetch current user's profile data.

### `updateProfileField(field, value)`
Update a single profile field (e.g., name, age_group).

### `trackUserSession(sessionType, metadata)`
Track user sessions: 'login', 'logout', 'signup', 'anonymous'.

### `getUserSessions(limit)`
Get user's session history (default: 10 most recent).

## Database Schema

### user_profiles
- `id` - User ID (references auth.users)
- `email` - User email
- `name` - Display name
- `age_group` - '18-24', '25-35', '35-45', '45+'
- `profession` - User's profession
- `is_anonymous` - Boolean flag
- `created_at` - Timestamp
- `updated_at` - Timestamp

### user_sessions
- `id` - Session ID
- `user_id` - User ID (references auth.users)
- `session_type` - 'login', 'logout', 'signup', 'anonymous'
- `ip_address` - IP address (optional)
- `user_agent` - Browser user agent
- `device_info` - JSON with device metadata
- `created_at` - Timestamp

## Security

- **Row Level Security (RLS)** is enabled on all tables
- Users can only access their own data
- Automatic profile creation on signup via database trigger
- Secure policies prevent unauthorized access

## Next Steps

1. Apply the database migrations in Supabase
2. Update your Auth component to use the new functions
3. Add profile updates in onboarding pages
4. Display user profiles in dashboards
5. Add session history views for security monitoring

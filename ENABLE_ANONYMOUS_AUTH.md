# 🔓 Enable Anonymous Sign-In in Supabase

## Why is Anonymous Sign-In Disabled?

By default, Supabase disables anonymous authentication for security reasons. You need to manually enable it in your project settings.

## 📋 Steps to Enable Anonymous Sign-In

### Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your **CareNest** project

### Step 2: Navigate to Authentication Settings

1. Click **Authentication** in the left sidebar
2. Click **Providers** tab

### Step 3: Enable Anonymous Sign-In

1. Scroll down to find **Anonymous Sign-ins** section
2. Toggle the switch to **ON** (enable it)
3. Click **Save** button

### Step 4: (Optional) Configure Anonymous Settings

You can also configure:
- **Session duration** - How long anonymous sessions last
- **Auto-cleanup** - Automatically delete old anonymous users

### Step 5: Test It

1. Go back to your app: http://localhost:5173/
2. Click **"👤 Continue anonymously"** button
3. It should now work! ✅

---

## 🎯 What Anonymous Sign-In Does

When enabled, users can:
- ✅ Use the app without providing email/password
- ✅ Get a temporary session ID
- ✅ Have their data saved (but tied to anonymous ID)
- ✅ Convert to full account later (optional feature)

---

## 🔒 Security Considerations

**Anonymous users:**
- Get a unique UUID identifier
- Can access the app temporarily
- Data is still protected by Row Level Security
- Sessions expire after configured duration
- Can be converted to permanent accounts

**Best practices:**
- Set reasonable session duration (e.g., 7 days)
- Enable auto-cleanup for old anonymous users
- Consider adding "Convert to Account" feature later

---

## 🛠️ Alternative: Disable Anonymous Button

If you don't want to enable anonymous sign-in, you can hide the button:

### Option 1: Comment Out the Button

Edit `src/pages/Auth.jsx`:

```javascript
{/* Temporarily disabled anonymous login
<div style={s.divider}>or</div>
<button style={s.anonBtn} onClick={handleAnonymous} disabled={loading}>
    👤 Continue anonymously
</button>
<div style={s.privacyNote}>
    🔒 Anonymous mode uses only a temporary session ID. No email, no name, no trace.
</div>
*/}
```

### Option 2: Show a Message Instead

Replace the anonymous button with:

```javascript
<div style={s.divider}>or</div>
<div style={{
    padding: '14px',
    background: 'rgba(107,143,113,.07)',
    borderRadius: 12,
    fontSize: 13,
    color: 'var(--text-muted)',
    textAlign: 'center'
}}>
    💡 Anonymous sign-in is currently disabled. Please create an account to continue.
</div>
```

---

## ✅ Recommended: Enable It

Anonymous sign-in is a great feature for mental health apps because:
- 🔒 **Privacy** - Users can try without sharing personal info
- 🚀 **Lower barrier** - Easier onboarding
- 💙 **Trust** - Shows you respect user privacy
- 📊 **Better conversion** - Users can upgrade to full account later

---

## 📸 Visual Guide

**Where to find it in Supabase:**

```
Dashboard
  └─ Your Project
      └─ Authentication (left sidebar)
          └─ Providers (tab)
              └─ Anonymous Sign-ins (scroll down)
                  └─ Toggle ON ✅
                      └─ Save
```

---

## 🧪 After Enabling

Test the flow:
1. Click "Continue anonymously"
2. Select age group
3. Select profession
4. Check Supabase Table Editor
5. You'll see a user with `is_anonymous = true` ✅

---

**That's it! Enable anonymous sign-in in Supabase and your users can start using the app without registration!** 🎉

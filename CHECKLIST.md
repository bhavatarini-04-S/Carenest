# ✅ Anonymous Sign-In Enablement Checklist

## Quick Checklist - Follow in Order:

- [ ] **Step 1:** Open https://supabase.com/dashboard
- [ ] **Step 2:** Click on your CareNest project
- [ ] **Step 3:** Click "Authentication" in left sidebar
- [ ] **Step 4:** Click "Providers" tab at the top
- [ ] **Step 5:** Scroll down to find "Anonymous Sign-ins"
- [ ] **Step 6:** Toggle the switch to ON (should turn green/blue)
- [ ] **Step 7:** Click "Save" button
- [ ] **Step 8:** Verify toggle stays ON after saving
- [ ] **Step 9:** Test at http://localhost:5173/ - click "Continue anonymously"
- [ ] **Step 10:** Verify you can proceed through age/profession selection

---

## 🎯 Expected Result:

After completing all steps:
- ✅ Anonymous button works in your app
- ✅ Users can sign in without email/password
- ✅ Anonymous users appear in Supabase with `is_anonymous = true`

---

## ❌ Troubleshooting:

### "Anonymous sign-ins are disabled"
→ Go back to Supabase and verify toggle is ON and saved

### "Failed to sign in anonymously"
→ Check browser console (F12) for detailed error
→ Verify your Supabase URL and keys in `.env` file

### Toggle won't stay ON
→ Make sure you clicked "Save" button
→ Check if you have proper permissions on the project

### Button still doesn't work after enabling
→ Hard refresh your browser (Ctrl+Shift+R)
→ Clear browser cache
→ Restart dev server

---

## 📞 Still Stuck?

If you're having trouble finding the setting:

1. **Alternative path:** 
   - Dashboard → Project Settings → Authentication → Enable Anonymous sign-ins

2. **Search feature:**
   - Use Supabase dashboard search (Ctrl+K)
   - Type "anonymous"
   - Click on the result

3. **Documentation:**
   - Visit: https://supabase.com/docs/guides/auth/auth-anonymous
   - Official guide with screenshots

---

## ✨ After Enabling:

Your app will support:
- 🔒 Privacy-first onboarding
- 🚀 Zero-friction user experience
- 💙 Trust-building for mental health users
- 📊 Better user conversion rates

---

**Ready? Start with Step 1 and check off each item as you go!** 🚀

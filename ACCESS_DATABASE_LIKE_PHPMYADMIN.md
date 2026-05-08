# 🗄️ Access Your Database (Like phpMyAdmin)

## Supabase = phpMyAdmin for PostgreSQL

Just like you use **phpMyAdmin** for MySQL databases, Supabase has a **built-in visual database manager** called **Table Editor**.

---

## 🚀 Quick Access (3 Steps):

### Step 1: Open Supabase Dashboard
```
Go to: https://supabase.com/dashboard
```

### Step 2: Select Your Project
```
Click on: "CareNest" (your project)
```

### Step 3: Click "Table Editor"
```
Left Sidebar → Click "Table Editor" 📊
```

**That's it!** You now have a phpMyAdmin-like interface! 🎉

---

## 📊 What You'll See (Just Like phpMyAdmin):

### Left Sidebar - Your Tables:
```
📁 Tables
  ├─ auth.users (built-in)
  ├─ user_profiles (your table)
  └─ user_sessions (your table)
```

### Main Area - Table Data:
- View all rows (like phpMyAdmin's "Browse")
- Add new rows (like "Insert")
- Edit rows (like "Edit")
- Delete rows (like "Delete")
- Filter and search
- Export data

---

## 🎯 Comparison: phpMyAdmin vs Supabase

| Feature | phpMyAdmin | Supabase Table Editor |
|---------|------------|----------------------|
| **Access** | http://localhost/phpmyadmin | https://supabase.com/dashboard |
| **View Tables** | Left sidebar | Left sidebar |
| **Browse Data** | Click table → Browse | Click table → View rows |
| **Add Row** | Insert tab | "+ Insert row" button |
| **Edit Row** | Edit icon | Click on cell to edit |
| **Delete Row** | Delete icon | Right-click → Delete |
| **Run SQL** | SQL tab | SQL Editor (separate) |
| **Export** | Export tab | Export button |
| **Import** | Import tab | Not available (use SQL) |

---

## 🔍 Detailed Access Guide:

### Method 1: Table Editor (Visual - Like phpMyAdmin)

**Path:**
```
https://supabase.com/dashboard
  → Your Project (CareNest)
    → Table Editor (left sidebar) 📊
      → Click any table to view data
```

**What You Can Do:**
- ✅ View all data in spreadsheet format
- ✅ Add new rows by clicking "+ Insert row"
- ✅ Edit cells by clicking on them
- ✅ Delete rows by right-clicking
- ✅ Filter data using the filter bar
- ✅ Search across columns
- ✅ Sort by any column
- ✅ Export to CSV

**Example:**
1. Click "user_profiles" in left sidebar
2. See all users in a table
3. Click any cell to edit
4. Click "+ Insert row" to add new user

---

### Method 2: SQL Editor (For Queries - Like phpMyAdmin SQL Tab)

**Path:**
```
https://supabase.com/dashboard
  → Your Project (CareNest)
    → SQL Editor (left sidebar) </>
      → Write SQL queries
```

**What You Can Do:**
- ✅ Run custom SQL queries
- ✅ Create tables
- ✅ Modify schema
- ✅ Run complex joins
- ✅ Save queries for later

**Example Queries:**
```sql
-- View all users
SELECT * FROM user_profiles;

-- Count users by age group
SELECT age_group, COUNT(*) 
FROM user_profiles 
GROUP BY age_group;

-- View recent logins
SELECT * FROM user_sessions 
WHERE session_type = 'login' 
ORDER BY created_at DESC 
LIMIT 10;
```

---

### Method 3: Database (Schema View - Like phpMyAdmin Structure Tab)

**Path:**
```
https://supabase.com/dashboard
  → Your Project (CareNest)
    → Database (left sidebar) 🗄️
      → Tables
```

**What You Can Do:**
- ✅ View table structure
- ✅ See column types
- ✅ View indexes
- ✅ See relationships
- ✅ Modify schema

---

## 🖥️ Alternative: Desktop Tools (Like phpMyAdmin Desktop)

If you prefer a desktop application, you can use:

### 1. **pgAdmin** (Official PostgreSQL GUI)
- Download: https://www.pgadmin.org/download/
- Free and open-source
- Most similar to phpMyAdmin

**Connection Details:**
```
Host: [Your Supabase Host from .env]
Port: 5432
Database: postgres
Username: postgres
Password: [Your Supabase Password]
```

### 2. **DBeaver** (Universal Database Tool)
- Download: https://dbeaver.io/download/
- Free and supports many databases
- Modern interface

### 3. **TablePlus** (Modern GUI)
- Download: https://tableplus.com/
- Beautiful interface
- Free tier available

---

## 📱 Mobile Access

You can also access Supabase Table Editor from:
- ✅ Mobile browser
- ✅ Tablet
- ✅ Any device with internet

Just go to: https://supabase.com/dashboard

---

## 🎯 Quick Actions (Like phpMyAdmin):

### View All Users:
```
Dashboard → Table Editor → user_profiles
```

### Add New User:
```
Dashboard → Table Editor → user_profiles → "+ Insert row"
```

### Edit User:
```
Dashboard → Table Editor → user_profiles → Click on cell → Edit
```

### Delete User:
```
Dashboard → Table Editor → user_profiles → Right-click row → Delete
```

### Run SQL Query:
```
Dashboard → SQL Editor → Write query → Run
```

### Export Data:
```
Dashboard → Table Editor → user_profiles → Export button → CSV
```

---

## 🔗 Direct Links:

Once logged in to Supabase, bookmark these:

**Table Editor:**
```
https://supabase.com/dashboard/project/[YOUR-PROJECT-ID]/editor
```

**SQL Editor:**
```
https://supabase.com/dashboard/project/[YOUR-PROJECT-ID]/sql
```

**Database:**
```
https://supabase.com/dashboard/project/[YOUR-PROJECT-ID]/database/tables
```

---

## 💡 Pro Tips:

1. **Bookmark Table Editor** - It's your main database interface
2. **Use SQL Editor** for complex queries
3. **Use Database section** to view schema
4. **Export regularly** - Use export feature for backups
5. **Use filters** - Filter data instead of scrolling

---

## 🆚 Key Differences from phpMyAdmin:

| Aspect | phpMyAdmin | Supabase |
|--------|------------|----------|
| **Location** | Local (localhost) | Cloud (online) |
| **Database** | MySQL/MariaDB | PostgreSQL |
| **Access** | Need local server | Access anywhere |
| **Security** | Local only | Built-in auth |
| **Backups** | Manual | Automatic |
| **Scaling** | Manual | Automatic |

---

## ✅ Summary:

**To access your database like phpMyAdmin:**

1. Go to: **https://supabase.com/dashboard**
2. Click: **Your CareNest Project**
3. Click: **"Table Editor"** in left sidebar
4. **Done!** You now have a visual database interface

**It's even better than phpMyAdmin because:**
- ✅ Access from anywhere (not just localhost)
- ✅ Automatic backups
- ✅ Built-in security
- ✅ Real-time updates
- ✅ API automatically generated
- ✅ No server setup needed

---

**Start here:** https://supabase.com/dashboard → Your Project → Table Editor 📊

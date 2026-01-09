# Reset Admin Password - Quick Guide

## Method 1: Use Supabase Dashboard (EASIEST)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Users**
4. Find the user `admin@terredezellige.com`
5. Click the **3 dots menu** (⋮) next to the user
6. Click **"Send Password Recovery Email"** OR **"Reset Password"**
7. Check your email inbox for the reset link
8. Click the link and set a new password
9. Login at `http://localhost:3000/admin-login`

## Method 2: Use SQL to Reset Password (ADVANCED)

If you don't have access to the email, run this SQL in Supabase SQL Editor:

```sql
-- Get the user ID first
SELECT id, email FROM auth.users WHERE email = 'admin@terredezellige.com';

-- Then update the password (replace 'NEW_PASSWORD_HERE' with your desired password)
-- Note: This requires the Service Role key, which you may not have access to
UPDATE auth.users 
SET encrypted_password = crypt('NEW_PASSWORD_HERE', gen_salt('bf'))
WHERE email = 'admin@terredezellige.com';
```

⚠️ **Warning**: Method 2 requires Service Role access and may not work with the anon key.

## Method 3: Create New Admin (RECOMMENDED FOR YOU)

Since you already have `admin2@terredezellige.com`:

1. Login at `http://localhost:3000/login` with `admin2@terredezellige.com`
2. Go to `http://localhost:3000/admin/setup-orders`
3. Copy the SQL command shown in the blue box
4. Run it in Supabase SQL Editor
5. Now you can access `/admin-login` with `admin2@terredezellige.com`

---

**Which method do you prefer?** I recommend Method 3 since you already created the new account.

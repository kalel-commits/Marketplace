# Troubleshooting Firebase 400 Error on Sign-Up

## Error: `identitytoolkit.googleapis.com/v1/accounts:signUp` returns 400

This error means **Firebase Authentication is not properly enabled** or configured.

## ✅ Solution: Enable Email/Password Authentication

### Step 1: Go to Firebase Console
Visit: **https://console.firebase.google.com/project/marketplace-a0872/authentication**

### Step 2: Enable Authentication
1. If you see **"Get started"** button, click it
2. This will initialize Authentication for your project

### Step 3: Enable Email/Password Provider
1. Click on the **"Sign-in method"** tab
2. Find **"Email/Password"** in the list
3. Click on it
4. Toggle **"Enable"** to **ON**
5. Click **"Save"**

### Step 4: Verify Firestore is Created
1. Go to: **https://console.firebase.google.com/project/marketplace-a0872/firestore**
2. If you see "Create database", click it
3. Choose **"Start in test mode"** (for MVP)
4. Select a location and click **"Enable"**

### Step 5: Restart Dev Server
```powershell
# Stop server (Ctrl+C)
npm run dev
```

## Common Error Codes

After enabling Authentication, you might see these errors:

- **auth/weak-password**: Password must be at least 6 characters
- **auth/email-already-in-use**: Email is already registered
- **auth/invalid-email**: Invalid email format
- **auth/operation-not-allowed**: Authentication method not enabled (this is your current issue)

## Still Getting Errors?

1. **Check API Key Restrictions**
   - Go to: https://console.cloud.google.com/apis/credentials?project=marketplace-a0872
   - Find your API key
   - Make sure there are no HTTP referrer restrictions blocking localhost

2. **Verify Firestore Security Rules**
   - Go to Firestore > Rules
   - Make sure users can write to the `users` collection
   - For MVP, you can use test mode rules

3. **Clear Browser Cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

## Test After Fixing

1. Try signing up with a new email
2. Check browser console for any new errors
3. Verify the user appears in Firebase Console > Authentication > Users


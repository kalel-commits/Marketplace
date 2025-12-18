# Enable Firebase Authentication

The 400 error from `identitytoolkit.googleapis.com` usually means **Firebase Authentication is not enabled** in your Firebase project.

## Quick Fix: Enable Email/Password Authentication

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/project/marketplace-a0872/authentication

2. **Enable Authentication**
   - Click **"Get started"** (if you see this button)
   - Or go to the **"Sign-in method"** tab

3. **Enable Email/Password**
   - Click on **"Email/Password"** provider
   - Toggle **"Enable"** to ON
   - Click **"Save"**

4. **Restart Your Dev Server**
   ```powershell
   # Stop server (Ctrl+C), then:
   npm run dev
   ```

## Also Check:

### Firestore Database
Make sure Firestore is created:
- Go to: https://console.firebase.google.com/project/marketplace-a0872/firestore
- Click **"Create database"** if you haven't already
- Choose **"Start in test mode"** for MVP

### API Key Restrictions (if still getting errors)
If you still get 400 errors after enabling Auth:
1. Go to: https://console.cloud.google.com/apis/credentials?project=marketplace-a0872
2. Find your API key
3. Check if there are any restrictions
4. For development, you can temporarily remove restrictions

## After Enabling:
- The 400 error should disappear
- You'll be able to sign up and log in
- All authentication features will work


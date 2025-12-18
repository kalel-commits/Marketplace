# How to Get Your Firebase Web App Configuration

## Important Note
The file `marketplace-a0872-firebase-adminsdk-fbsvc-1b8c1d2fa8.json` is a **service account** key (for server-side/admin operations). 

For your Next.js app, you need the **Web App** configuration instead.

## Steps to Get Web App Config:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/project/marketplace-a0872/settings/general
   - Sign in with your Google account

2. **Navigate to Project Settings**
   - Click the ⚙️ (gear) icon next to "Project Overview"
   - Select **Project Settings**

3. **Find or Create Web App**
   - Scroll down to the **"Your apps"** section
   - Look for a web app (icon: `</>`)
   - **If you don't see one:**
     - Click the **Web icon** (`</>`)
     - Register your app (name it "Marketplace Web" or similar)
     - Click **Register app**

4. **Copy the Config**
   - You'll see a `firebaseConfig` object that looks like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "marketplace-a0872.firebaseapp.com",
     projectId: "marketplace-a0872",
     storageBucket: "marketplace-a0872.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abc123def456"
   };
   ```

5. **Add to .env.local**
   - Open `.env.local` in your project root
   - Add these lines (replace with your actual values):
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...your_actual_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=marketplace-a0872.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=marketplace-a0872
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=marketplace-a0872.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
   ```

6. **Restart Dev Server**
   - Stop your dev server (Ctrl+C)
   - Run: `npm run dev`

## Quick Reference
- **Service Account JSON** = Server-side/admin operations (what you have)
- **Web App Config** = Client-side browser operations (what you need)

The web app config is safe to expose in the browser - that's why it uses `NEXT_PUBLIC_` prefix.


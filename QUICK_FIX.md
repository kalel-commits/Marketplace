# Quick Fix: Get Your Firebase Web App Config

## The Problem
You're using the service account `private_key_id` as the API key, but you need the **Web App API Key** instead.

## Solution: Get Web App Config from Firebase Console

### Step 1: Open Firebase Console
Go to: **https://console.firebase.google.com/project/marketplace-a0872/settings/general**

### Step 2: Find Your Web App
1. Scroll down to **"Your apps"** section
2. Look for an app with the **Web icon** (`</>`)
3. **If you don't see one**, click the **Web icon** (`</>`) to create a new web app

### Step 3: Copy the Config
You'll see a code block like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",  // ← This is what you need (starts with AIza)
  authDomain: "marketplace-a0872.firebaseapp.com",
  projectId: "marketplace-a0872",
  storageBucket: "marketplace-a0872.appspot.com",
  messagingSenderId: "123456789012",  // ← Numbers only
  appId: "1:123456789012:web:abc123def456"  // ← Format: 1:numbers:web:letters
};
```

### Step 4: Update .env.local
Open `.env.local` and replace with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...your_full_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=marketplace-a0872.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=marketplace-a0872
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=marketplace-a0872.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

### Step 5: Restart Dev Server
```powershell
# Stop server (Ctrl+C), then:
npm run dev
```

## Important Notes
- ❌ **Service Account JSON** = Server-side only (what you have)
- ✅ **Web App Config** = Client-side browser (what you need)
- The API key should start with **"AIza"** and be ~39 characters long
- The value `1b8c1d2fa85aaebf05c181864edc3844a17ff606` is NOT the API key


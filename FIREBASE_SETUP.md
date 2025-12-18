# Firebase Setup Guide

## Step 1: Get Firebase Web Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **marketplace-a0872** (or create a new one)
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select **Project Settings**
5. Scroll down to **Your apps** section
6. If you don't have a web app yet:
   - Click the **Web icon** (`</>`)
   - Register your app (you can name it "Marketplace Web")
   - Click **Register app**
7. Copy the `firebaseConfig` object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "marketplace-a0872.firebaseapp.com",
  projectId: "marketplace-a0872",
  storageBucket: "marketplace-a0872.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 2: Create Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=marketplace-a0872
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

Replace the values with the ones from your Firebase config.

## Step 3: Enable Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Click on **Email/Password**
5. Enable it and click **Save**

## Step 4: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **Create database**
3. Select **Start in test mode** (for MVP - you can add security rules later)
4. Choose a location closest to your users
5. Click **Enable**

## Step 5: Set Firestore Security Rules

1. Go to **Firestore Database** > **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true; // Anyone can read user profiles
      allow write: if request.auth != null && request.auth.uid == userId; // Users can only update their own profile
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      allow read: if resource.data.status == 'open' || 
                     (request.auth != null && resource.data.business_owner_id == request.auth.uid);
      allow create: if request.auth != null && 
                       request.resource.data.business_owner_id == request.auth.uid;
      allow update: if request.auth != null && 
                       resource.data.business_owner_id == request.auth.uid;
    }
    
    // Applications collection
    match /applications/{applicationId} {
      allow read: if request.auth != null && (
        resource.data.freelancer_id == request.auth.uid ||
        get(/databases/$(database)/documents/tasks/$(resource.data.task_id)).data.business_owner_id == request.auth.uid
      );
      allow create: if request.auth != null && 
                       request.resource.data.freelancer_id == request.auth.uid;
      allow update: if request.auth != null && 
                       get(/databases/$(database)/documents/tasks/$(resource.data.task_id)).data.business_owner_id == request.auth.uid;
    }
  }
}
```

3. Click **Publish**

## Step 6: Create Firestore Indexes

Firestore will automatically prompt you to create indexes when needed. When you see an error link, click it to create the index automatically.

Alternatively, manually create these composite indexes in **Firestore Database** > **Indexes**:

1. **Collection**: `tasks`
   - Fields: `status` (Ascending), `created_at` (Descending)
   - Query scope: Collection

2. **Collection**: `applications`
   - Fields: `task_id` (Ascending), `created_at` (Descending)
   - Query scope: Collection

3. **Collection**: `applications`
   - Fields: `freelancer_id` (Ascending), `created_at` (Descending)
   - Query scope: Collection

## Step 7: Install Dependencies and Run

```bash
npm install
npm run dev
```

Your app should now be running at http://localhost:3000!

## Troubleshooting

- **"Firebase not initialized" error**: Make sure your `.env.local` file has all the required variables
- **Authentication errors**: Verify Email/Password is enabled in Firebase Console
- **Permission denied errors**: Check your Firestore security rules
- **Missing index errors**: Click the error link to create the index automatically


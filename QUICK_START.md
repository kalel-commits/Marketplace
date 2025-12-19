# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account (for backend)

## Step 1: Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

## Step 2: Set Up Firebase (Required)

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)

2. **Get your Firebase config:**
   - Go to Project Settings (gear icon) > General tab
   - Scroll to "Your apps" section
   - Click the Web icon (`</>`) to add a web app
   - Copy the configuration values

3. **Create `.env.local` file** in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Enable Firebase Authentication:**
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
   - Click Save

5. **Create Firestore Database:**
   - Go to Firestore Database
   - Click "Create database"
   - Start in **test mode** (for development)
   - Choose a location

## Step 3: Run Development Server

```bash
npm run dev
```

Or using yarn:
```bash
yarn dev
```

The app will be available at: **http://localhost:3000**

## Step 4: Build for Production

```bash
npm run build
npm start
```

Or using yarn:
```bash
yarn build
yarn start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Troubleshooting

### Firebase Not Initialized Error
- Make sure `.env.local` file exists with all required variables
- Restart the development server after creating/updating `.env.local`

### Port Already in Use
- Change the port: `npm run dev -- -p 3001`

### Module Not Found Errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again

## First Time Setup Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Firebase project created
- [ ] `.env.local` file created with Firebase config
- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] Development server running (`npm run dev`)

## Next Steps

1. Visit http://localhost:3000
2. Sign up as a Business Owner or Freelancer
3. Start using the marketplace!

For detailed setup instructions, see [README.md](./README.md)

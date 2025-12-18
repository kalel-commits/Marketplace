# Create Admin User

To create an admin user, you have two options:

## Option 1: Create via Firebase Console (Recommended)

1. **Sign up as a regular user** through the app (can be any role)
2. **Go to Firebase Console**: https://console.firebase.google.com/project/marketplace-a0872/firestore
3. **Navigate to Firestore Database**
4. **Find the `users` collection**
5. **Find your user document** (by email or user ID)
6. **Edit the document** and change the `role` field from `business_owner` or `freelancer` to `admin`
7. **Save**

## Option 2: Create Admin Account Directly

1. **Sign up** through the app with email: `admin@marketplace.com` (or any email you want)
2. **Go to Firebase Console** > Firestore
3. **Find the user** you just created
4. **Change `role` to `admin`**

## After Creating Admin:

1. **Log out** from the app
2. **Log in** with your admin credentials
3. You'll be redirected to `/dashboard/admin`
4. You'll see:
   - All users
   - All tasks
   - All applications
   - System statistics

## Admin Credentials (Example)

- **Email**: admin@marketplace.com (or your chosen email)
- **Password**: (your chosen password)
- **Role**: `admin` (set in Firestore)

## Security Note

For production, consider:
- Adding admin-only routes protection
- Implementing role-based access control
- Adding admin creation restrictions


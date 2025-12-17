# Firebase Setup Guide for CorteYa Barbershop Management System

## 🔥 Firebase Project Configuration

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `corteya-barbershop`
4. Enable Google Analytics (recommended)
5. Choose or create Analytics account

### 2. Configure Firebase Services

#### Authentication Setup
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Configure authorized domains (add your production domain)
4. Set up custom authentication rules if needed

#### Firestore Database Setup
1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (configure rules later)
3. Select your preferred region
4. Create the following collections structure:

```
/businesses/{businessId}
├── userId: string
├── businessName: string
├── address: string
├── city: string
├── postalCode: string
├── province: string
├── phone: string
├── email: string
├── website: string
├── description: string
├── services: array
├── openingHours: object
├── profilePhotoUrl: string
├── coverPhotoUrl: string
├── profilePhotoPath: string
├── coverPhotoPath: string
├── createdAt: timestamp
└── updatedAt: timestamp
```

#### Firebase Storage Setup
1. Go to **Storage** → **Get started**
2. Choose security rules (start in test mode)
3. Select storage location (same region as Firestore)
4. Create folder structure:
```
/business-photos/{businessId}/
├── profile/
└── cover/
```

#### Security Rules Configuration

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Businesses collection - users can only access their own businesses
    match /businesses/{businessId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Business photos - users can manage their own business photos
    match /business-photos/{businessId}/{photoType}/{fileName} {
      allow read: if true; // Public read for business photos
      allow write, delete: if request.auth != null &&
        // Check if user owns the business (implement custom claim or check Firestore)
        request.auth.token.admin == true || 
        request.auth.uid == getBusinessOwner(businessId);
    }
    
    // Helper function to check business ownership
    function getBusinessOwner(businessId) {
      return get(/databases/(default)/documents/businesses/$(businessId)).data.userId;
    }
  }
}
```

### 3. Get Firebase Configuration

1. Go to **Project Settings** → **General**
2. Scroll to **Your apps** section
3. Click **Web app** icon (</>) 
4. Register app name: `corteya-web`
5. Copy the configuration object:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

### 4. Environment Variables Setup

Update your `.env` file with the Firebase configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 5. Authentication Configuration

#### For Testing (Admin/Owner Accounts)
Create user accounts for testing:
```javascript
// In Firebase Console → Authentication → Users
Email: admin@corteya.com
Email: propietario@corteya.com
```

#### Production Authentication
- Configure custom authentication logic
- Set up user roles and permissions
- Implement proper session management

### 6. Data Migration (if applicable)

If migrating from Supabase:
1. Export existing data from Supabase
2. Transform data structure to match Firebase
3. Import data using Firebase Admin SDK
4. Update photo URLs and paths

### 7. Testing Your Setup

1. Run your application: `npm run dev`
2. Test authentication with created accounts
3. Test photo upload functionality
4. Verify data persistence in Firestore
5. Check file uploads in Storage

### 8. Production Deployment

#### Hosting (Optional)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build app: `npm run build`
5. Deploy: `firebase deploy`

#### Security Checklist
- [ ] Update Firestore security rules for production
- [ ] Update Storage security rules for production
- [ ] Configure proper CORS settings
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategies
- [ ] Set up proper user authentication flow

### 9. Monitoring and Analytics

1. Enable **Performance Monitoring**
2. Set up **Crashlytics** (for error tracking)
3. Configure **Analytics** events for user interactions
4. Set up **Functions** for server-side logic (if needed)

## 🚨 Important Notes

1. **Security**: Never commit your actual Firebase config to version control
2. **Costs**: Monitor Firebase usage to avoid unexpected charges
3. **Backup**: Set up regular backups for Firestore data
4. **Testing**: Use Firebase Emulator Suite for local development
5. **Performance**: Optimize Firestore queries and Storage access patterns

## 📋 Post-Setup Tasks

1. Replace mock user/business IDs with real authentication
2. Implement proper error handling
3. Add loading states and user feedback
4. Set up data validation
5. Configure proper image optimization
6. Implement caching strategies
7. Add offline support (if needed)

Your Firebase backend is now ready for the CorteYa barbershop management system! 🎉
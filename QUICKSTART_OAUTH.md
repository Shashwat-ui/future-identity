# Quick Start Guide - OAuth Integration

## ✅ What's Been Implemented

### 1. Database Schema
- Added NextAuth tables: `User`, `Account`, `Session`, `VerificationToken`
- Updated `UserProfile` with verification fields:
  - `emailVerified`, `instagramVerified`, `facebookVerified`, `linkedinVerified`
  - Foreign key relationship to `User` table

### 2. Authentication System
- **Google OAuth**: Auto-fills email, name, and photo
- **Facebook OAuth**: Connects and verifies Facebook profile
- **LinkedIn OAuth**: Connects and verifies LinkedIn profile
- **Instagram**: UI ready (requires Meta Business verification for full OAuth)

### 3. Profile Modal Enhancements
- "Connect" buttons for email, Instagram, Facebook, LinkedIn fields
- Verification badges (green checkmark) for verified accounts
- Auto-fill profile data from connected accounts

### 4. API Endpoints
- `/api/oauth/connect` - Connect OAuth accounts
- `/api/oauth/verify` - Get verification status
- `/api/auth/[...nextauth]` - NextAuth OAuth flows

## 🚀 Setup Steps

### 1. Install Dependencies (Already Done ✓)
```bash
npm install @next-auth/prisma-adapter
```

### 2. Database Migration (Already Done ✓)
The schema is updated with OAuth support.

### 3. Configure OAuth Providers

#### Get OAuth Credentials:

**Google:**
1. Visit: https://console.cloud.google.com/
2. Create project → Enable Google+ API
3. Credentials → OAuth 2.0 Client ID
4. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

**Facebook:**
1. Visit: https://developers.facebook.com/
2. Create App → Add Facebook Login
3. Valid OAuth Redirect URI: `http://localhost:3000/api/auth/callback/facebook`

**LinkedIn:**
1. Visit: https://www.linkedin.com/developers/apps
2. Create App → Products: Sign In with LinkedIn
3. Authorized redirect URL: `http://localhost:3000/api/auth/callback/linkedin`

### 4. Update .env File
Add these environment variables to your `.env`:

```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"

# LinkedIn OAuth
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 5. Restart Development Server
```bash
npm run dev
```

## 📱 How Users Will Use It

### Connect & Verify Accounts:

1. **Click Profile Avatar** → Opens Profile Modal

2. **Edit Tab** → Each social field has a "Connect" button:
   - **Email field**: "Connect" with Google icon
   - **Facebook field**: "Connect" with Facebook icon
   - **LinkedIn field**: "Connect" with LinkedIn icon
   - **Instagram field**: "Connect" with Instagram icon

3. **Click "Connect"** → Redirects to OAuth provider

4. **Authorize the app** → Returns to profile with:
   - ✅ Green "Verified" badge
   - Auto-filled profile information
   - Data pulled from their actual account

5. **Share with Confidence**: Recipients see verified badges, trusting the information is authentic

## 🎯 Key Features

### Auto-Fill Magic
- **Google login**: Name, email, and profile photo automatically populated
- **Facebook connect**: Profile ID and verification status
- **LinkedIn connect**: Profile URL and verification status

### Visual Verification
- Green checkmark badges on verified fields
- "Verified" button replaces "Connect" after authentication
- Recipients can trust verified information

### Security
- OAuth tokens encrypted in database
- Never exposed to client-side
- Secure session management
- HTTPS required for production

## 🐛 Troubleshooting

### "Failed to connect" error
- Check `.env` file has all OAuth credentials
- Verify redirect URIs match in OAuth provider settings

### "Callback URL mismatch"
- Ensure exact match: `http://localhost:3000/api/auth/callback/{provider}`
- No trailing slashes
- Include both dev and production URLs

### Database errors
The schema migration completed successfully. If you see any Prisma errors:
```bash
npx prisma generate
npx prisma db push
```

## 📸 Screenshot Flow

**Before Connection:**
```
Email: [____________] [Connect 🔗]
```

**After Connection:**
```
Email: [user@gmail.com] [✅ Verified]
```

## Next Steps

1. Get OAuth credentials from Google, Facebook, LinkedIn
2. Add them to `.env` file
3. Restart dev server
4. Test the "Connect" buttons
5. Watch auto-fill magic happen! ✨

---

**Need Help?** Check [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed provider setup instructions.

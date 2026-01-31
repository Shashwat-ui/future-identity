# OAuth Integration Setup Guide

## Overview
This application now supports OAuth authentication for Google, Facebook, LinkedIn, and Instagram, allowing users to:
- Auto-fill their profile information from connected accounts
- Verify ownership of their social accounts
- Access data directly from their accounts

## Setup Instructions

### 1. Install Required Package
```bash
npm install @next-auth/prisma-adapter
```

### 2. Update Database Schema
Run the Prisma migration to add the new tables and fields:
```bash
npx prisma migrate dev --name add_oauth_support
npx prisma generate
```

### 3. Configure OAuth Providers

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Configure consent screen
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret to `.env`

#### Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook` (development)
   - `https://yourdomain.com/api/auth/callback/facebook` (production)
5. Copy App ID and App Secret to `.env`

#### LinkedIn OAuth Setup
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Create a new app
3. Add Sign In with LinkedIn product
4. Configure OAuth 2.0 redirect URLs:
   - `http://localhost:3000/api/auth/callback/linkedin` (development)
   - `https://yourdomain.com/api/auth/callback/linkedin` (production)
5. Copy Client ID and Client Secret to `.env`

### 4. Environment Variables
Copy `.env.example` to `.env` and fill in all the OAuth credentials:
```bash
cp .env.example .env
```

Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 5. Start Development Server
```bash
npm run dev
```

## Features

### For Users
1. **Profile Edit Tab**:
   - Click "Connect" button next to email, Facebook, LinkedIn fields
   - Authenticate with the respective provider
   - Profile information is auto-filled and verified

2. **Verification Badges**:
   - Green checkmark appears on verified fields
   - Verified status shown in profile modal

3. **Auto-Fill**:
   - Google: Email, Name, Photo
   - Facebook: Profile ID, verification status
   - LinkedIn: Profile URL, verification status

## How It Works

1. **OAuth Flow**:
   - User clicks "Connect" button
   - Redirects to OAuth provider
   - User authorizes the app
   - App receives access token and profile data
   - Data is stored in database with verified status

2. **Data Storage**:
   - OAuth tokens stored in `Account` table
   - Verified status stored in `UserProfile` table
   - Session managed via `Session` table

3. **Verification**:
   - Once connected, field is marked as verified
   - Verification badge appears in UI
   - Recipients can trust verified information

## API Endpoints

- `POST /api/oauth/connect` - Connect a new OAuth account
- `GET /api/oauth/verify` - Get verification status for all fields
- `/api/auth/[...nextauth]` - NextAuth endpoints for OAuth flows

## Security Notes

- All OAuth tokens are encrypted in database
- Tokens are never exposed to client-side code
- Session uses secure database strategy
- HTTPS required for production

## Troubleshooting

### "Callback URL mismatch" error
- Ensure redirect URIs match exactly in OAuth provider settings
- Include both http://localhost:3000 and production URLs

### "Invalid credentials" error
- Verify environment variables are set correctly
- Check client ID and secret match OAuth provider

### Database connection issues
- Ensure DATABASE_URL is correct in .env
- Run `npx prisma migrate dev` to apply schema changes

## Future Enhancements

- Instagram OAuth (requires Facebook Business verification)
- Twitter/X OAuth integration
- Automatic profile sync on login
- Two-factor authentication via OAuth providers

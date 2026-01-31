# OAuth Redirect URIs - CRITICAL CHECKLIST

## ⚠️ MUST ADD THESE EXACT URIs TO EACH PROVIDER

### Google Cloud Console
**Location**: APIs & Services → Credentials → Your OAuth 2.0 Client ID → Authorized redirect URIs

Add BOTH:
```
http://localhost:3000/api/auth/callback/google
https://future-identity.vercel.app/api/auth/callback/google
```

### Facebook Developers
**Location**: App Dashboard → Facebook Login → Settings → Valid OAuth Redirect URIs

Add BOTH:
```
http://localhost:3000/api/auth/callback/facebook
https://future-identity.vercel.app/api/auth/callback/facebook
```

### LinkedIn Developers
**Location**: App Settings → Auth → OAuth 2.0 settings → Redirect URLs

Add BOTH:
```
http://localhost:3000/api/auth/callback/linkedin
https://future-identity.vercel.app/api/auth/callback/linkedin
```

---

## Common Issues and Fixes

### Issue 1: "Error 401: invalid_client"
**Cause**: Redirect URI not added or doesn't match exactly
**Fix**: 
1. Check that URIs are added WITHOUT trailing slashes
2. Ensure lowercase "callback" (not "Callback")
3. Save changes in provider console
4. Wait 1-2 minutes for changes to propagate

### Issue 2: "redirect_uri_mismatch"
**Cause**: The URI in your OAuth config doesn't match what's registered
**Fix**: Copy and paste the URIs exactly as shown above

### Issue 3: "App not verified" (Google)
**Fix**: 
1. Add test users in OAuth consent screen
2. Or publish the app (requires verification for production)

### Issue 4: Environment variables not loading
**Fix**: 
1. Restart dev server completely
2. Check .env file has no extra spaces
3. Verify file is named exactly `.env` (not `.env.txt`)

---

## Verification Steps

1. **Restart Everything**:
   ```bash
   # Kill all node processes
   # Delete .next folder
   # Restart dev server
   ```

2. **Test Each Provider**:
   - Click sign in button
   - Should redirect to provider
   - After auth, should return to your app
   - Check browser console for errors

3. **Check Environment Variables**:
   ```javascript
   // Add this temporarily to app/api/auth/[...nextauth]/route.js
   console.log({
     GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...',
     HAS_SECRET: !!process.env.GOOGLE_CLIENT_SECRET
   });
   ```

---

## Current Configuration Status

Based on your .env file:
- ✅ Google Client ID: `553785370647-v346np1hafic6j8dkja0c7g713allv7o.apps.googleusercontent.com`
- ✅ Facebook App ID: `1253329330004783`
- ✅ LinkedIn Client ID: `86331dhbjooavb`
- ✅ NextAuth URL: `http://localhost:3000`
- ✅ NextAuth Secret: Set

**Next Steps**: Verify redirect URIs are added to each provider's console.

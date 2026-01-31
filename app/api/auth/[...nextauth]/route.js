import NextAuth from "next-auth";
import { authOptions } from '@/lib/auth';

// Debug: Log environment variables on server start
if (process.env.NODE_ENV === 'development') {
  console.log('🔐 NextAuth Configuration:');
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
  console.log('Facebook Client ID:', process.env.FACEBOOK_CLIENT_ID ? '✅ Set' : '❌ Missing');
  console.log('LinkedIn Client ID:', process.env.LINKEDIN_CLIENT_ID ? '✅ Set' : '❌ Missing');
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import LinkedIn from "next-auth/providers/linkedin";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "email,public_profile"
        }
      }
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email"
        }
      },
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
      issuer: "https://www.linkedin.com/oauth",
      wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      async profile(profile) {
        console.log('LinkedIn profile data:', profile);
        
        // LinkedIn OpenID doesn't provide vanity name - use sub as identifier
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          vanityName: profile.sub, // Fallback to sub ID
        };
      },
    })
  ],
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      if (session.user) {
        (session.user as unknown as { id: string }).id = user.id;
      }
      return session;
    },
    async signIn() {
      // Allow sign in even without email (Instagram users may not provide email)
      return true;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Always redirect to home page after OAuth
      // Prevents malformed callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signIn({ user, account, profile }: { user: any; account: any; profile: any }) {
      // Auto-update profile with OAuth data AFTER user is created
      if (account && profile && user.id) {
        try {
          // Small delay to ensure user record is committed
          await new Promise(resolve => setTimeout(resolve, 100));
          
          await prisma.userProfile.upsert({
            where: { userId: user.id },
            update: {
              ...(account.provider === 'google' && {
                email: user.email || undefined,
                emailVerified: true,
                name: user.name || undefined,
                photo: user.image || undefined,
              }),
              ...(account.provider === 'facebook' && {
                facebook: `https://facebook.com/${account.providerAccountId}`,
                facebookVerified: true,
              }),
              ...(account.provider === 'linkedin' && {
                // Don't auto-fill LinkedIn URL - will prompt after OAuth
                linkedinVerified: true,
              }),
            },
            create: {
              userId: user.id,
              email: user.email || null,
              emailVerified: account.provider === 'google',
              name: user.name || undefined,
              photo: user.image || undefined,
              ...(account.provider === 'facebook' && {
                facebook: `https://facebook.com/${account.providerAccountId}`,
                facebookVerified: true,
              }),
              ...(account.provider === 'linkedin' && {
                // Don't auto-fill LinkedIn URL - will prompt after OAuth
                linkedinVerified: true,
              }),
            },
          });
        } catch (error) {
          console.error('Failed to create/update user profile:', error);
        }
      }
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "database",
  },
};
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // getServerSession returns a Session | null; we treat both options and result as any to keep types simple here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = (await getServerSession(authOptions as any)) as any;
    const userId = session?.user?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all connected accounts for the user
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: {
        provider: true,
        providerAccountId: true,
      },
    });

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    return NextResponse.json({ 
      accounts,
      verifications: {
        email: profile?.emailVerified || false,
        instagram: profile?.instagramVerified || false,
        facebook: profile?.facebookVerified || false,
        linkedin: profile?.linkedinVerified || false,
      }
    });
  } catch (error) {
    console.error('Error fetching OAuth verifications:', error);
    return NextResponse.json({ error: 'Failed to fetch verifications' }, { status: 500 });
  }
}

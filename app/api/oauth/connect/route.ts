import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // getServerSession returns a Session | null; we treat both options and result as any to keep types simple here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = (await getServerSession(authOptions as any)) as any;
    const userId = session?.user?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { provider, accountId, verified } = await request.json();

    // Update the user profile with the connected account
    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        ...(provider === 'instagram' && {
          instagram: accountId,
          instagramVerified: verified || false,
        }),
        ...(provider === 'facebook' && {
          facebook: accountId,
          facebookVerified: verified || false,
        }),
        ...(provider === 'linkedin' && {
          linkedin: accountId,
          linkedinVerified: verified || false,
        }),
      },
      create: {
        userId,
        ...(provider === 'instagram' && {
          instagram: accountId,
          instagramVerified: verified || false,
        }),
        ...(provider === 'facebook' && {
          facebook: accountId,
          facebookVerified: verified || false,
        }),
        ...(provider === 'linkedin' && {
          linkedin: accountId,
          linkedinVerified: verified || false,
        }),
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error connecting OAuth account:', error);
    return NextResponse.json({ error: 'Failed to connect account' }, { status: 500 });
  }
}

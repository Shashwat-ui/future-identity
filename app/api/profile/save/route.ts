import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId, ...profileData } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Verify user exists first
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        ...profileData,
        // Ensure null values are properly handled for cleared fields
        email: profileData.email || null,
        linkedin: profileData.linkedin || null,
        facebook: profileData.facebook || null,
        instagram: profileData.instagram || null,
        // Clear verification flags if field is empty
        emailVerified: profileData.email ? profileData.emailVerified : false,
        linkedinVerified: profileData.linkedin ? profileData.linkedinVerified : false,
        facebookVerified: profileData.facebook ? profileData.facebookVerified : false,
        instagramVerified: profileData.instagram ? profileData.instagramVerified : false,
        updatedAt: new Date(),
      },
      create: {
        userId,
        email: profileData.email || null,
        ...profileData,
      },
    });

    return NextResponse.json({ profile, success: true });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

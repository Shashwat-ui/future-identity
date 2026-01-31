import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('📝 Profile save request received:', body);
    
    const { userId, ...profileData } = body;
    
    if (!userId) {
      console.error('❌ Missing userId in request');
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    console.log('🔍 Checking if user exists:', userId);
    // Create anonymous user if doesn't exist
    let userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      console.log('👤 Creating anonymous user:', userId);
      userExists = await prisma.user.create({
        data: {
          id: userId,
          email: `${userId}@anonymous.local`, // Dummy email for anonymous users
          name: profileData.name || 'Anonymous User',
        },
      });
      console.log('✅ Anonymous user created');
    }

    console.log('✅ User found/created, upserting profile...');
    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        ...profileData,
        updatedAt: new Date(),
      },
      create: {
        userId,
        ...profileData,
      },
    });

    console.log('✅ Profile saved successfully:', profile);
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('❌ Error saving profile:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

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
    // Verify user exists first
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      console.error('❌ User not found:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ User found, upserting profile...');
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

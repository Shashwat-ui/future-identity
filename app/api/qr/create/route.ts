import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { payload } = await request.json();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const token = await prisma.qRToken.create({
      data: {
        payload,
        expiresAt,
      },
    });

    return NextResponse.json({ id: token.id });
  } catch (error) {
    console.error('Error creating QR token', error);
    return NextResponse.json({ error: 'Failed to create token' }, { status: 500 });
  }
}

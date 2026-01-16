import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    const token = await prisma.qRToken.findUnique({
      where: { id },
    });

    if (!token) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (token.revoked || token.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Expired' }, { status: 410 });
    }

    return NextResponse.json({ payload: token.payload });
  } catch (error) {
    console.error('Error validating QR token', error);
    return NextResponse.json({ error: 'Failed to validate token' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.character) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { gender } = body;

    const validGenders = ['MALE', 'FEMALE', 'NON_BINARY'];
    if (!validGenders.includes(gender)) {
      return NextResponse.json({ error: 'Invalid gender' }, { status: 400 });
    }

    const updatedCharacter = await prisma.character.update({
      where: { userId: user.id },
      data: { gender },
    });

    return NextResponse.json({
      success: true,
      character: updatedCharacter,
    });
  } catch (error) {
    console.error('Error updating character gender:', error);
    return NextResponse.json({ error: 'Failed to update character' }, { status: 500 });
  }
}

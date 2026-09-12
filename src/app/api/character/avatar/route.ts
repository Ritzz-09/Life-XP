import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getAvatarById, isAvatarUnlocked } from '@/lib/avatar-data';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { avatar } = body;

    if (!avatar || typeof avatar !== 'string') {
      return NextResponse.json({ error: 'Avatar ID is required' }, { status: 400 });
    }

    const avatarObj = getAvatarById(avatar);
    const unlocked = isAvatarUnlocked(avatarObj, user.character);

    if (!unlocked) {
      return NextResponse.json(
        {
          error: `Avatar is locked: ${avatarObj.unlockLabel}`,
          locked: true,
          requirement: avatarObj.unlockLabel,
        },
        { status: 403 }
      );
    }

    // Update user's avatar in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { avatar: avatarObj.id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        characterTitle: true,
      },
    });

    return NextResponse.json({
      success: true,
      avatar: updatedUser.avatar,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error equipping gamer avatar:', error);
    return NextResponse.json({ error: 'Failed to update avatar profile picture' }, { status: 500 });
  }
}

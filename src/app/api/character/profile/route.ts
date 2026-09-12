import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.character) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { username, characterTitle, gender } = body;

    const userData: { username?: string; characterTitle?: string } = {};
    const characterData: { gender?: string } = {};

    if (username !== undefined) {
      const cleanUsername = String(username).trim();
      if (cleanUsername.length < 2 || cleanUsername.length > 30) {
        return NextResponse.json(
          { error: 'Username must be between 2 and 30 characters' },
          { status: 400 }
        );
      }
      userData.username = cleanUsername;
    }

    if (characterTitle !== undefined) {
      const cleanTitle = String(characterTitle).trim();
      if (cleanTitle.length > 40) {
        return NextResponse.json(
          { error: 'Character title cannot exceed 40 characters' },
          { status: 400 }
        );
      }
      userData.characterTitle = cleanTitle || 'Realm Adventurer';
    }

    if (gender !== undefined) {
      const validGenders = ['MALE', 'FEMALE', 'NON_BINARY'];
      if (!validGenders.includes(gender)) {
        return NextResponse.json({ error: 'Invalid gender archetype' }, { status: 400 });
      }
      characterData.gender = gender;
    }

    // Execute atomic update
    const [updatedUser, updatedCharacter] = await prisma.$transaction([
      prisma.user.update({
        where: { id: currentUser.id },
        data: userData,
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          characterTitle: true,
        },
      }),
      prisma.character.update({
        where: { userId: currentUser.id },
        data: characterData,
      }),
    ]);

    return NextResponse.json({
      success: true,
      user: updatedUser,
      character: updatedCharacter,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

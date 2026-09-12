import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeedData } from '@/lib/ensure-seed';

export async function GET() {
  try {
    await ensureSeedData();

    const user = await getCurrentUser();
    if (!user || !user.character) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Fetch equipped items details
    const equippedWeapon = user.character.equippedWeaponId
      ? await prisma.item.findUnique({ where: { id: user.character.equippedWeaponId } })
      : null;

    const equippedArmor = user.character.equippedArmorId
      ? await prisma.item.findUnique({ where: { id: user.character.equippedArmorId } })
      : null;

    const equippedBadge = user.character.equippedBadgeId
      ? await prisma.item.findUnique({ where: { id: user.character.equippedBadgeId } })
      : null;

    // Recent activity completions for heatmaps / logs
    const recentLogs = await prisma.questCompletionLog.findMany({
      where: { userId: user.id },
      orderBy: { completedAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        characterTitle: user.characterTitle,
      },
      character: {
        ...user.character,
        equippedWeapon,
        equippedArmor,
        equippedBadge,
      },
      recentLogs,
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ authenticated: false, error: 'Failed to verify session' }, { status: 500 });
  }
}

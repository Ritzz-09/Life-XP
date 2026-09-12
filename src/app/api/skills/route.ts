import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { SKILL_TREE_DATA } from '@/lib/skills-data';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.character) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const character = user.character;
    let unlockedSkills: string[] = [];
    try {
      unlockedSkills = JSON.parse(character.unlockedSkills || '[]');
    } catch {
      unlockedSkills = [];
    }

    // Auto-calculate available skill points if character leveled up and points weren't initialized
    // Total points earned throughout lifetime = character.level - 1.
    const lifetimePointsEarned = Math.max(0, character.level - 1);
    const spentPoints = unlockedSkills.length;
    const computedAvailable = Math.max(0, lifetimePointsEarned - spentPoints);
    const skillPoints = Math.max(character.skillPoints, computedAvailable);

    if (skillPoints !== character.skillPoints) {
      await prisma.character.update({
        where: { userId: user.id },
        data: { skillPoints },
      });
    }

    return NextResponse.json({
      skills: SKILL_TREE_DATA,
      unlockedSkillIds: unlockedSkills,
      skillPoints,
      level: character.level,
    });
  } catch (error) {
    console.error('Failed to get skills:', error);
    return NextResponse.json({ error: 'Failed to retrieve skills' }, { status: 500 });
  }
}

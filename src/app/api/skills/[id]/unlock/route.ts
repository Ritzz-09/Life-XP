import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { SKILL_TREE_DATA } from '@/lib/skills-data';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.character) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: skillId } = await params;
    const skill = SKILL_TREE_DATA.find((s) => s.id === skillId);
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    const character = user.character;
    let unlockedSkills: string[] = [];
    try {
      unlockedSkills = JSON.parse(character.unlockedSkills || '[]');
    } catch {
      unlockedSkills = [];
    }

    if (unlockedSkills.includes(skillId)) {
      return NextResponse.json({ error: 'Skill already mastered' }, { status: 400 });
    }

    // Check prerequisites
    if (skill.prerequisiteId && !unlockedSkills.includes(skill.prerequisiteId)) {
      return NextResponse.json({ error: 'Prerequisite skill not yet unlocked' }, { status: 400 });
    }

    // Check available points
    const lifetimePoints = Math.max(0, character.level - 1);
    const availablePoints = Math.max(character.skillPoints, lifetimePoints - unlockedSkills.length);
    if (availablePoints < 1) {
      return NextResponse.json({ error: 'Not enough skill points. Level up to earn more!' }, { status: 400 });
    }

    // Apply stat bonus if any
    const statUpdates: Record<string, number> = {};
    if (skill.statBonus) {
      if (skill.statBonus.strength) statUpdates.strength = character.strength + skill.statBonus.strength;
      if (skill.statBonus.intellect) statUpdates.intellect = character.intellect + skill.statBonus.intellect;
      if (skill.statBonus.vitality) statUpdates.vitality = character.vitality + skill.statBonus.vitality;
      if (skill.statBonus.agility) statUpdates.agility = character.agility + skill.statBonus.agility;
      if (skill.statBonus.spirit) statUpdates.spirit = character.spirit + skill.statBonus.spirit;
      if (skill.statBonus.maxHp) statUpdates.maxHp = character.maxHp + skill.statBonus.maxHp;
      if (skill.statBonus.maxMana) statUpdates.maxMana = character.maxMana + skill.statBonus.maxMana;
    }

    const newUnlocked = [...unlockedSkills, skillId];
    const newSkillPoints = Math.max(0, availablePoints - 1);

    const updatedCharacter = await prisma.character.update({
      where: { userId: user.id },
      data: {
        skillPoints: newSkillPoints,
        unlockedSkills: JSON.stringify(newUnlocked),
        ...statUpdates,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Unlocked talent: ${skill.name}!`,
      unlockedSkillIds: newUnlocked,
      skillPoints: newSkillPoints,
      character: updatedCharacter,
    });
  } catch (error) {
    console.error('Failed to unlock skill:', error);
    return NextResponse.json({ error: 'Failed to unlock skill' }, { status: 500 });
  }
}

import prisma from './prisma';
import { DEFAULT_ITEMS, DEFAULT_BOSS } from './seed-data';

export async function ensureSeedData() {
  try {
    // 1. Seed items
    for (const item of DEFAULT_ITEMS) {
      await prisma.item.upsert({
        where: { name: item.name },
        update: {},
        create: item,
      });
    }

    // 2. Ensure active boss encounter exists
    const existingBoss = await prisma.bossEncounter.findFirst({
      where: { isActive: true },
    });

    if (!existingBoss) {
      await prisma.bossEncounter.create({
        data: DEFAULT_BOSS,
      });
    }
  } catch (err) {
    console.error('Error ensuring seed data:', err);
  }
}

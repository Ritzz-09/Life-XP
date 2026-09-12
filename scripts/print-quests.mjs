import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const quests = await prisma.quest.findMany({
    select: { title: true, attribute: true, type: true, difficulty: true },
    distinct: ['title'],
  });
  console.log('Quests in Database:');
  quests.forEach(q => console.log(`- [${q.attribute}] (${q.type} - ${q.difficulty}) ${q.title}`));
  await prisma.$disconnect();
}

main();

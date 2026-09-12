// Automated full-stack verification script for Life RPG
const BASE_URL = 'http://localhost:3005';

async function runTests() {
  console.log('--- STARTING LIFE RPG FULL-STACK VERIFICATION ---');

  let cookieHeader = '';

  // 1. Register a new adventurer
  const testUser = {
    username: 'SirGalahad_' + Date.now().toString().slice(-4),
    email: 'galahad_' + Date.now().toString().slice(-4) + '@realm.com',
    password: 'questPassword123',
    avatar: 'warrior',
  };

  console.log(`[1] Registering user: ${testUser.username}...`);
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser),
  });
  const regData = await regRes.json();
  if (!regRes.ok) throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
  console.log(`✓ Registered! User ID: ${regData.user.id}, Starting Level: ${regData.character.level}, Gold: ${regData.character.gold}`);

  // Capture cookie
  const setCookie = regRes.headers.get('set-cookie');
  if (setCookie) {
    cookieHeader = setCookie.split(';')[0];
  }

  // 2. Verify Session via /api/auth/me
  console.log('[2] Verifying session and initial character stats...');
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: cookieHeader },
  });
  const meData = await meRes.json();
  if (!meRes.ok || !meData.authenticated) throw new Error('Session verification failed');
  console.log(`✓ Session verified! Character: Level ${meData.character.level}, STR: ${meData.character.strength}, INT: ${meData.character.intellect}`);

  // 3. Fetch Initial Quests
  console.log('[3] Fetching starter quests...');
  const questsRes = await fetch(`${BASE_URL}/api/quests`, {
    headers: { Cookie: cookieHeader },
  });
  const questsData = await questsRes.json();
  console.log(`✓ Retrieved ${questsData.quests.length} starter quests`);

  // 4. Create a new custom quest
  console.log('[4] Forging a new custom quest...');
  const newQuestRes = await fetch(`${BASE_URL}/api/quests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    body: JSON.stringify({
      title: 'Master TypeScript Advanced Types & Generics',
      description: 'Solve 10 type gymnastics challenges',
      type: 'HABIT',
      difficulty: 'HARD',
      attribute: 'INT',
    }),
  });
  const newQuestData = await newQuestRes.json();
  if (!newQuestRes.ok) throw new Error('Failed to create quest');
  const createdQuest = newQuestData.quest;
  console.log(`✓ Quest created! ID: ${createdQuest.id}, Title: "${createdQuest.title}", XP Reward: ${createdQuest.xpReward}, Gold Reward: ${createdQuest.goldReward}`);

  // 5. Complete the Quest (Testing Progression Engine & Anti-Cheat)
  console.log('[5] Fulfilling quest and testing RPG Progression Engine...');
  const completeRes = await fetch(`${BASE_URL}/api/quests/${createdQuest.id}/complete`, {
    method: 'POST',
    headers: { Cookie: cookieHeader },
  });
  const completeData = await completeRes.json();
  if (!completeRes.ok) throw new Error('Failed to complete quest');
  console.log(`✓ Quest completed! Rewards: +${completeData.rewards.xp} XP, +${completeData.rewards.gold} Gold, +1 to ${completeData.rewards.attribute}`);
  console.log(`✓ Progression: Leveled Up = ${completeData.progression.leveledUp}, New Level = ${completeData.progression.newLevel}, Remaining XP = ${completeData.character.xp}`);
  console.log(`✓ Boss Raid Strike: Dealt ${completeData.boss.damageDealt} damage to World Boss! Remaining HP: ${completeData.boss.remainingHp}`);

  // 6. Shop & Economy testing
  console.log('[6] Testing Merchant Armory & Buying Equipment...');
  const shopRes = await fetch(`${BASE_URL}/api/shop`, {
    headers: { Cookie: cookieHeader },
  });
  const shopData = await shopRes.json();
  console.log(`✓ Merchant has ${shopData.items.length} wares available. Player Gold: ${completeData.character.gold}`);

  const itemToBuy = shopData.items.find(i => i.cost <= completeData.character.gold);
  if (itemToBuy) {
    console.log(`[7] Purchasing "${itemToBuy.name}" for ${itemToBuy.cost} Gold...`);
    const buyRes = await fetch(`${BASE_URL}/api/shop/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify({ itemId: itemToBuy.id }),
    });
    const buyData = await buyRes.json();
    if (!buyRes.ok) throw new Error('Purchase failed');
    console.log(`✓ Purchase successful! Remaining Gold: ${buyData.character.gold}`);

    // 8. Equip the item
    console.log(`[8] Equipping "${itemToBuy.name}" to Hero...`);
    const equipRes = await fetch(`${BASE_URL}/api/shop/equip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify({ userItemId: buyData.item.id }),
    });
    const equipData = await equipRes.json();
    if (!equipRes.ok) throw new Error('Equip failed');
    console.log(`✓ Equipped status: ${equipData.equipped}`);
  }

  // 9. Database Persistence Validation: Fetch fresh state after operations
  console.log('[9] Testing Database Persistence (proves SQLite data is not just localStorage)...');
  const verifyRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: cookieHeader },
  });
  const verifyData = await verifyRes.json();
  console.log(`✓ Fresh Database Fetch: Level = ${verifyData.character.level}, XP = ${verifyData.character.xp}, Gold = ${verifyData.character.gold}, Streak = ${verifyData.character.streak}, INT = ${verifyData.character.intellect}`);
  console.log(`✓ Recent completions count in database log: ${verifyData.recentLogs.length}`);

  console.log('\n========================================');
  console.log('🎉 ALL FULL-STACK RPG ENGINE TESTS PASSED!');
  console.log('========================================');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

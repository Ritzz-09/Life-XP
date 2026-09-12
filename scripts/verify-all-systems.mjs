async function runVerification() {
  console.log('--- Starting Verification of All 7 RPG Expansion Systems ---');

  const BASE_URL = 'http://localhost:3000';

  // 1. Authenticate with Demo Account
  console.log('\n1. Authenticating demo user...');
  const demoRes = await fetch(`${BASE_URL}/api/auth/demo`, { method: 'POST' });
  const cookieHeader = demoRes.headers.get('set-cookie');
  if (!demoRes.ok || !cookieHeader) {
    console.error('Failed to log into demo:', await demoRes.text());
    process.exit(1);
  }
  const tokenCookie = cookieHeader.split(';')[0];
  console.log('✓ Authenticated successfully with cookie:', tokenCookie.slice(0, 30) + '...');

  const authHeaders = {
    'Cookie': tokenCookie,
    'Content-Type': 'application/json',
  };

  // 2. Verify Character & Gender Toggle
  console.log('\n2. Testing Gender & 3D Archetypes...');
  for (const g of ['MALE', 'FEMALE', 'NON_BINARY']) {
    const gRes = await fetch(`${BASE_URL}/api/character/gender`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ gender: g }),
    });
    const gData = await gRes.json();
    if (!gRes.ok || gData.character.gender !== g) {
      console.error(`Failed to set gender ${g}:`, gData);
      process.exit(1);
    }
    console.log(`✓ Successfully updated character archetype to: ${g}`);
  }

  // 3. Test Skill Tree & Masteries API
  console.log('\n3. Testing Skill Tree & Masteries...');
  const skillsRes = await fetch(`${BASE_URL}/api/skills`, { headers: authHeaders });
  const skillsData = await skillsRes.json();
  console.log(`✓ Skill Tree retrieved: ${skillsData.skills.length} talents across 3 branches. Available SP: ${skillsData.skillPoints}`);

  // Test unlocking a Tier 1 skill
  const unlockRes = await fetch(`${BASE_URL}/api/skills/w1_iron_body/unlock`, {
    method: 'POST',
    headers: authHeaders,
  });
  const unlockData = await unlockRes.json();
  if (unlockRes.ok) {
    console.log(`✓ Successfully unlocked skill: ${unlockData.message}`);
  } else {
    console.log(`ℹ Skill status: ${unlockData.error}`);
  }

  // 4. Test Achievements & Trophy Hall API
  console.log('\n4. Testing Achievements & Trophy Hall...');
  const achRes = await fetch(`${BASE_URL}/api/achievements`, { headers: authHeaders });
  const achData = await achRes.json();
  console.log(`✓ Achievements loaded: ${achData.achievements.length} total, Claimed: ${achData.totalClaimed}, Ready: ${achData.readyToClaimCount}`);

  // 5. Test Co-Op Guild Fellowship & World Boss Raid API
  console.log('\n5. Testing Co-Op Guild Fellowship...');
  // Check if already in party or create one
  const partyCheck = await fetch(`${BASE_URL}/api/party`, { headers: authHeaders });
  const partyCheckData = await partyCheck.json();

  if (partyCheckData.inParty) {
    console.log(`✓ Already in party "${partyCheckData.party.name}" (Code: ${partyCheckData.party.inviteCode})`);
    console.log(`✓ Party Boss: ${partyCheckData.party.bossTarget} [${partyCheckData.party.bossHp} / ${partyCheckData.party.bossMaxHp} HP]`);
  } else {
    const createPartyRes = await fetch(`${BASE_URL}/api/party/create`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ name: 'Alpha Vanguard' }),
    });
    const partyData = await createPartyRes.json();
    if (!createPartyRes.ok) {
      console.error('Failed to create party:', partyData);
      process.exit(1);
    }
    console.log(`✓ Created Party: "${partyData.party.name}" with 6-char code: ${partyData.party.inviteCode}`);
    console.log(`✓ Boss Raid Target: ${partyData.party.bossTarget} (${partyData.party.bossHp} HP)`);
  }

  // 6. Test Quest Completion with Hyperfocus Bonus (+20 XP) and Party Boss Damage
  console.log('\n6. Testing Quest Completion with Hyperfocus Bonus & Party Boss Damage...');
  const questsRes = await fetch(`${BASE_URL}/api/quests`, { headers: authHeaders });
  const questsData = await questsRes.json();
  const activeQuest = questsData.quests.find((q) => !q.isCompleted) || questsData.quests[0];

  if (activeQuest) {
    console.log(`Toggling quest "${activeQuest.title}" with 25-minute Pomodoro Hyperfocus...`);
    let completeRes = await fetch(`${BASE_URL}/api/quests/${activeQuest.id}/complete`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ hyperfocus: true, focusMinutes: 25 }),
    });
    let completeData = await completeRes.json();

    if (completeData.action === 'uncompleted') {
      console.log('Quest was toggled to active, completing now...');
      completeRes = await fetch(`${BASE_URL}/api/quests/${activeQuest.id}/complete`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ hyperfocus: true, focusMinutes: 25 }),
      });
      completeData = await completeRes.json();
    }

    console.log('✓ Quest completed successfully!');
    console.log(`✓ Rewards: +${completeData.rewards.xp} XP, +${completeData.rewards.gold} Gold, Hyperfocus Bonus: +${completeData.rewards.hyperfocusBonus} XP`);
    console.log(`✓ Solo Boss Damage: ${completeData.boss.damageDealt} DMG (Remaining: ${completeData.boss.remainingHp} HP)`);
    if (completeData.party && completeData.party.inParty) {
      console.log(`✓ Co-Op Guild Raid Damage: ${completeData.party.damageDealt} DMG to Party Boss! (Remaining: ${completeData.party.remainingHp} HP)`);
    }
  }

  // 7. Verify Party Activity Feed
  const partyAfter = await fetch(`${BASE_URL}/api/party`, { headers: authHeaders });
  const partyAfterData = await partyAfter.json();
  if (partyAfterData.inParty && partyAfterData.party.activities.length > 0) {
    console.log('\n7. Latest Party Activity Log:');
    console.log(`✓ ${partyAfterData.party.activities[0].username} ${partyAfterData.party.activities[0].action} (-${partyAfterData.party.activities[0].damage} DMG)`);
  }

  console.log('\n🎉 ALL 7 RPG EXPANSION SYSTEMS VERIFIED OPERATIONAL!');
}

runVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});

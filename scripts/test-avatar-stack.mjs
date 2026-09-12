// Automated verification script for Life RPG Game Avatar Stack System
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function runAvatarTests() {
  console.log('=== TESTING GAME AVATAR STACK & PROFILE PIC SYSTEM ===');

  let cookieHeader = '';

  // 1. Register a new user
  const testUser = {
    username: 'GamerHero_' + Date.now().toString().slice(-4),
    email: 'gamer_' + Date.now().toString().slice(-4) + '@gamer.com',
    password: 'password123',
    avatar: 'crimson-avenger',
    gender: 'MALE',
  };

  console.log(`[1] Registering user ${testUser.username} with starter avatar '${testUser.avatar}'...`);
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser),
  });
  const regData = await regRes.json();
  if (!regRes.ok) throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
  console.log(`✓ Registered! Initial Avatar: ${regData.user.avatar}`);

  const setCookie = regRes.headers.get('set-cookie');
  if (setCookie) {
    cookieHeader = setCookie.split(';')[0];
  }

  // 2. Verify Session
  console.log('[2] Verifying session via /api/auth/me...');
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: cookieHeader },
  });
  const meData = await meRes.json();
  if (!meRes.ok || !meData.authenticated) throw new Error('Session failed');
  console.log(`✓ Session confirmed: User: ${meData.user.username}, Avatar: ${meData.user.avatar}`);

  // 3. Attempt to equip a level-locked avatar (Cosmic Titan requires level 10)
  console.log('[3] Attempting to equip locked avatar "cosmic-titan" at Level 1...');
  const lockedRes = await fetch(`${BASE_URL}/api/character/avatar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    body: JSON.stringify({ avatar: 'cosmic-titan' }),
  });
  const lockedData = await lockedRes.json();
  if (lockedRes.status === 403 && lockedData.locked) {
    console.log(`✓ Properly rejected with 403 Forbidden! Message: "${lockedData.error}"`);
  } else {
    throw new Error(`Expected 403 for locked avatar, got ${lockedRes.status}: ${JSON.stringify(lockedData)}`);
  }

  // 4. Equip an unlocked free starter avatar ("cyber-ninja")
  console.log('[4] Equipping unlocked starter avatar "cyber-ninja"...');
  const equipRes = await fetch(`${BASE_URL}/api/character/avatar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    body: JSON.stringify({ avatar: 'cyber-ninja' }),
  });
  const equipData = await equipRes.json();
  if (!equipRes.ok || equipData.avatar !== 'cyber-ninja') {
    throw new Error(`Failed to equip cyber-ninja: ${JSON.stringify(equipData)}`);
  }
  console.log(`✓ Successfully equipped! New User Avatar: ${equipData.avatar}`);

  // 5. Verify persistence via /api/auth/me
  console.log('[5] Verifying persistent database update via /api/auth/me...');
  const verifyRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: cookieHeader },
  });
  const verifyData = await verifyRes.json();
  if (verifyData.user.avatar !== 'cyber-ninja') {
    throw new Error(`Avatar did not persist! Expected 'cyber-ninja', got '${verifyData.user.avatar}'`);
  }
  console.log(`✓ Persistent avatar confirmed in DB: "${verifyData.user.avatar}"`);

  // 6. Equip another unlocked avatar ("pixel-hero")
  console.log('[6] Equipping retro avatar "pixel-hero"...');
  const pixelRes = await fetch(`${BASE_URL}/api/character/avatar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    body: JSON.stringify({ avatar: 'pixel-hero' }),
  });
  const pixelData = await pixelRes.json();
  if (!pixelRes.ok || pixelData.avatar !== 'pixel-hero') {
    throw new Error(`Failed to equip pixel-hero: ${JSON.stringify(pixelData)}`);
  }
  console.log(`✓ Successfully switched to: ${pixelData.avatar}`);

  console.log('\n======================================================');
  console.log('🎉 GAME AVATAR STACK SYSTEM FULLY VERIFIED & WORKING! 🎉');
  console.log('======================================================\n');
}

runAvatarTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

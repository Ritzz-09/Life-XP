# ⚔️ Life RPG: The Gamified Discipline & Progression Web App

> **Turn mundane real-world tasks into an engaging virtual progression system.**  
> Built with Next.js 16 App Router, TypeScript, Tailwind CSS, Prisma ORM, SQLite/PostgreSQL, and pure Web Audio micro-interactions. Responsive across mobile phones and desktop laptops.

---

## 🌟 1. Overview & Creative Direction

Traditional habit trackers and to-do lists feel like chores due to the **delayed gratification problem**: going to the gym, reading a book, or coding take months to show physical results. Video games solve this through **immediate feedback loops**, clear progression ladders, and tangible rewards.

**Life RPG** bridges this gap:
- **Alive & Tactile**: Instant Web Audio chime feedback on task completion, celebratory level-up fanfare, and canvas particle confetti.
- **Thematically Cohesive**: Cyber-Arcane / Dark Fantasy RPG aesthetic. Tasks are **Quests**, currency is **Gold**, character growth happens across **5 Core Attributes** (Strength, Intellect, Vitality, Agility, Spirit), and tasks deal damage to an active **World Raid Boss**.
- **Cross-Device Responsive**: Dedicated mobile bottom dock layout for smartphones and multi-column command deck for laptops.
- **Anti-Cheat & True Persistence**: Server-validated XP calculations, non-linear leveling mathematics, and full relational database persistence (Prisma ORM with SQLite for zero-config local runs, PostgreSQL-ready for cloud deployments).

---

## 🏗️ 2. Full-Stack Architecture & Tech Stack

```
+---------------------------------------------------------------------------------------+
|                                    LIFE RPG SYSTEM                                    |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|  [ Client Layer ]                                                                     |
|  - Framework: Next.js 16 (App Router, React 19, TypeScript)                           |
|  - Styling: Tailwind CSS (v4) Dark Fantasy palette                                   |
|  - Audio Engine: Synthesized Web Audio API (zero external assets, <5ms latency)       |
|  - FX: Canvas Confetti particle explosions                                            |
|  - Navigation: Multi-column Command Center (Laptop) & Tactile Bottom Dock (Mobile)    |
|                                                                                       |
|                                 HTTP / REST API                                       |
|                                        v                                              |
|  [ Backend API Routes ]                                                               |
|  - /api/auth/register, /api/auth/login, /api/auth/demo, /api/auth/me, /api/auth/logout|
|  - /api/quests (GET list, POST create)                                                |
|  - /api/quests/[id] (PUT update, DELETE quest)                                        |
|  - /api/quests/[id]/complete (Server-side XP, Level Up, Attribute & Streak math)     |
|  - /api/shop (GET wares & inventory), /api/shop/buy, /api/shop/equip, /api/shop/use   |
|  - /api/boss (Active raid boss, weakness multiplier, combat logs)                     |
|                                                                                       |
|                                   Prisma ORM                                          |
|                                        v                                              |
|  [ Database Layer ]                                                                   |
|  - User, Character, Quest, QuestCompletionLog, Item, UserItem, BossEncounter          |
|  - Local: SQLite (dev.db) | Production: PostgreSQL / Supabase / Neon                  |
+---------------------------------------------------------------------------------------+
```

---

## 🎮 3. Core Features Checklist

### 🛡️ User Authentication & Security
- Secure signup, login, and session cookies (`bcryptjs` password hashing, signed JWTs).
- Isolated data per user: players can only read and mutate their own quests and inventory.
- **1-Click Evaluator Demo**: Instant guest login option to test a pre-configured Level 3 character with preloaded gear and quests.

### 📐 Relational Database Schema & Full CRUD
- **Create**: Forge custom quests with Title, Description, Type (Daily, Habit, To-Do, Boss), Difficulty, Attribute, and Due Date.
- **Read**: Dynamic filtering by Type (Daily, Habit, To-Do, Boss), Attribute (STR, INT, VIT, AGI, SPR), and instant text search.
- **Update**: Edit quest properties, toggle statuses.
- **Delete**: Abandon quests with 1-click removal.

### ⚡ The Non-Linear RPG Progression Engine
- Non-linear leveling curve where each subsequent level demands more effort:
  $$\text{XP Required for Level } L = \lfloor 100 \times L^{1.5} \rfloor$$
  - Level 1 → 2: 100 XP
  - Level 2 → 3: 282 XP
  - Level 3 → 4: 519 XP
  - Level 4 → 5: 800 XP
  - Level 10: 3,162 XP
- Full HP restoration upon level-up and unlockable celebratory modal.

### 📊 5 Core Character Attributes
1. **STR (Strength)**: Gym, strength training, physical stamina, manual labor.
2. **INT (Intellect)**: Coding, studying, algorithm practice, reading.
3. **VIT (Vitality)**: 8h sleep, hydration, healthy meals, mental recovery. (+5 Max HP per point).
4. **AGI (Agility)**: Quick errands, rapid communication, inbox zero.
5. **SPR (Spirit)**: Meditation, gratitude journaling, mindfulness, reflection.

### 🔥 Consecutive Streak System
- Tracks daily activity with local date normalization.
- Consecutive days grant a **Streak Multiplier**: $+5\%$ reward bonus per consecutive day up to $+50\%$ at 10 days.
- Visual **28-Day Discipline Heatmap** demonstrating database log persistence.

### 💰 Virtual Economy, Armory & Inventory
- Earn **Gold** by completing quests.
- Visit the **Merchant Armory** to purchase:
  - **Weapons**: Wooden Practice Blade, Ancient Algorithms Tome, Quicksilver Daggers.
  - **Armor**: Vanguard Iron Plate, Archmage Robes, Titanium Exosuit.
  - **Consumables**: Vitality Tonics (restores 50 HP) & Elixirs of Enlightenment (+150 XP burst).
  - **Badges**: Insignias and flairs.
- Equip and unequip gear to boost character stats.

### 🐉 World Raid Boss: Chronos the Procrastinator
- High-stakes world raid boss with real-time health bar.
- Every quest completed deals damage to the boss.
- **Critical Weakness Mechanic**: Matching tasks to the boss's weakness (e.g. Intellect) deals **1.5x Critical Damage**!

---

## 📱 4. Mobile & Laptop Responsive UI

- **Laptop / Desktop (≥ 1024px)**:
  - **3-Column Command Center**: Hero Character Deck (Vitals, XP, Attributes, Gear) on the left, Quest Journal in center, World Boss Raid & Discipline Matrix on the right.
  - **Keyboard Shortcuts**: Press `N` to quickly forge a new quest from anywhere, `Esc` to dismiss modals.
- **Mobile (< 1024px)**:
  - Sticky Top HUD with Level, XP progress bar, Gold balance, and Streak flame.
  - Tactile **Bottom Dock Navigation** with tabs for *Quests*, *Hero*, *Armory*, and *Boss*.
  - Floating Action Button (`+`) for rapid one-thumb quest creation.

---

## 🚀 5. Quick Start & Setup Instructions

### Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/your-username/life-rpg.git
cd life-rpg
npm install
```

### 2. Configure Environment
Copy the example environment file:
```bash
cp .env.example .env
```
*(Default `.env` is configured for local SQLite with zero external dependencies)*

### 3. Initialize Database
Push the Prisma schema to generate the SQLite database and Prisma Client:
```bash
npx prisma db push
```

### 4. Run the Application
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 6. Automated Full-Stack Verification

Run the included end-to-end verification script:
```bash
node scripts/test-engine.mjs
```
This tests:
1. User registration & session issuance
2. Relational database persistence
3. Non-linear XP leveling mathematics
4. Attribute growth & streak multipliers
5. Boss damage calculation with weakness bonus
6. Gold balance deduction & armory equipment

---

## 📹 7. Walkthrough Video Demonstration Script (90–180s)

To record your demonstration video for submission:
1. **0:00 - 0:25 | Authentication & Entrance**:
   - Show the landing page and click **"Enter as Demo Hero"** (or register a new user).
   - Point out the Hero HUD (Level, HP, Mana, Gold, Streak flame).
2. **0:25 - 0:55 | Quest Management (CRUD)**:
   - Click **"Forge Quest"** (or press `N`).
   - Create a task: *"Master System Design Interview"* (Type: Habit, Attribute: Intellect, Difficulty: Hard).
   - Show the newly added quest card with its +120 XP and +80 Gold rewards.
3. **0:55 - 1:20 | Fulfilling Quests & Level Up**:
   - Check off the newly created quest.
   - Observe the Web Audio chime, confetti explosion, floating reward pill, and the celebratory **"LEVEL UP!"** modal.
   - Show how the character's Intellect stat increased and HP restored.
4. **1:20 - 1:45 | Merchant Armory & Economy**:
   - Switch to the **Merchant Armory** tab.
   - Spend earned gold to purchase a weapon or armor piece (e.g. *Tome of Ancient Algorithms*).
   - Go to your Bag and click **"Equip to Hero"**.
   - Show the equipped item reflected on the Hero Card.
5. **1:45 - 2:05 | Database Persistence Proof & Mobile Responsiveness**:
   - Refresh the page (`F5`) to prove that all stats, inventory, streak, and completed status persist from the database.
   - Open Chrome DevTools (`Ctrl+Shift+M`) to show the responsive mobile version with the bottom navigation dock.

---

## 📄 License
MIT License. Built with passion for gamified self-improvement.

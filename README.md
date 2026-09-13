# ⚔️ Life-XP: The Gamified Discipline & Progression Web App
### 🏆 Official Submission for Tech Zephyr 4.0 Web Hackathon (September 12–13, 2026)

> **Turn mundane real-world tasks into an engaging virtual progression system.**  
> Built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Prisma ORM, SQLite/PostgreSQL, and pure Web Audio micro-interactions. Responsive across mobile phones, tablets, and desktop laptops.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4.1-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📋 Hackathon Disclosures & Compliance (Tech Zephyr 4.0)

In strict accordance with **Tech Zephyr 4.0 Development Guidelines & Rules**:
- **Originality & Authorship**: 100% original codebase written during the hackathon period. **Zero downloaded UI templates or pre-packaged boilerplates** were used.
- **Third-Party Libraries & Frameworks Disclosed**:
  - `next` (v16.3.5) & `react` (v19.2.8) - Core full-stack App Router architecture
  - `@prisma/client` & `prisma` (v6.4.1) - Database ORM & schema management
  - `bcryptjs` (v3.0.3) & `jsonwebtoken` (v9.0.3) - Password salting & signed session cookies
  - `canvas-confetti` (v1.9.4) - Celebratory particle physics
  - `lucide-react` (v1.45.0) - UI iconography
  - `Web Audio API` (native browser) - Real-time synthesized tactile game chimes (<5ms latency, zero external MP3 assets)
- **AI Tool Assistance Disclosed**: Developed with AI pair-programming assistance (Google DeepMind Antigravity / Gemini) for architectural scaffolding, automated test suites, and performance optimization.

---

## 🎯 Judging Criteria Alignment Matrix

| Criteria (Weight) | Implementation in Life-XP | Verification Point |
|---|---|---|
| **Functionality & Execution (30%)** | 41 active routes, zero broken links, full CRUD, dynamic RPG leveling mathematics, real-time boss raid damage, habit streak multipliers, and custom reward redemptions. | Run `node scripts/test-engine.mjs` (passes 100%) |
| **Technical Implementation (30%)** | Next.js 16 Turbopack, Prisma relational database, 2FA Email OTP with cryptographic TTL and 3-attempt brute-force lockout, dual SQLite/PostgreSQL 1-click switcher, and Schema.org JSON-LD SEO. | Verified with `npm run build` (41/41 routes 0 errors) |
| **UI / UX Design (15%)** | Dark cyberpunk fantasy aesthetic, glassmorphic HUD, dedicated 3-column desktop command center, responsive smartphone bottom dock, PWA offline installability, and light/dark theme toggles. | Fully responsive across mobile, tablet, and desktop |
| **Innovation & Creativity (10%)** | Externalizing procrastination as a tangible World Raid Boss (`Chronicus`), micro-habit attribute affinities (STR, INT, VIT, AGI, SPR), and guilt-free real-world incentive store. | Interactive gameplay mechanics & habit stacking engine |
| **Adherence to Theme (10%)** | Transforms daily discipline, fitness, study, and procrastination management into a compelling role-playing progression loop. | Directly solves the real-world habit retention problem |
| **Code Quality & Conduct (5%)** | Strictly typed TypeScript, modular component architecture, sanitization against XSS/SQLi, clean git history. | Clean GitHub repository on `main` branch |

---

## 🌟 1. Overview & Creative Direction

Traditional habit trackers and to-do lists feel like chores due to the **delayed gratification problem**: going to the gym, reading a book, or coding take months to show physical results. Video games solve this through **immediate feedback loops**, clear progression ladders, and tangible rewards.

**Life-XP** bridges this gap:
- **Alive & Tactile**: Instant Web Audio chime feedback on task completion, celebratory level-up fanfare, and canvas particle confetti.
- **Thematically Cohesive**: Cyber-Arcane / Dark Fantasy RPG aesthetic. Tasks are **Quests**, currency is **Gold**, character growth happens across **5 Core Attributes** (Strength, Intellect, Vitality, Agility, Spirit), and tasks deal damage to an active **World Raid Boss**.
- **Cross-Device Responsive**: Dedicated mobile bottom dock layout for smartphones and multi-column command deck for laptops.
- **Anti-Cheat & True Persistence**: Server-validated XP calculations, non-linear leveling mathematics, and full relational database persistence (Prisma ORM with SQLite for zero-config local runs, PostgreSQL-ready for cloud deployments).

---

## 🏗️ 2. Full-Stack Architecture & Tech Stack

```
+---------------------------------------------------------------------------------------+
|                                    LIFE-XP SYSTEM                                     |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|  [ Client Layer ]                                                                     |
|  - Framework: Next.js 16 (App Router, React 19, TypeScript)                           |
|  - Styling: Tailwind CSS Dark Fantasy & Cyberpunk palette                             |
|  - Audio Engine: Synthesized Web Audio API (zero external assets, <5ms latency)       |
|  - FX: Canvas Confetti particle explosions                                            |
|  - Navigation: Multi-column Command Center (Laptop) & Tactile Bottom Dock (Mobile)    |
|                                                                                       |
|                                 HTTP / REST API                                       |
|                                        v                                              |
|  [ Backend API Routes ]                                                               |
|  - /api/auth/register, /api/auth/register/send-otp, /api/auth/login, /api/auth/demo   |
|  - /api/auth/forgot-password, /api/auth/reset-password, /api/auth/me                  |
|  - /api/quests (GET list, POST create, PUT edit, DELETE abandon)                      |
|  - /api/quests/[id]/complete (Server-side XP, Level Up, Attribute & Streak math)     |
|  - /api/shop (GET wares & inventory), /api/shop/buy, /api/shop/equip, /api/shop/use   |
|  - /api/rewards (Custom real-life incentive rewards store & claim)                    |
|  - /api/boss (Active raid boss, weakness multiplier, combat damage logs)              |
|  - /api/party (Co-op accountability guild parties, invite codes, and raid feed)       |
|                                                                                       |
|                                   Prisma ORM                                          |
|                                        v                                              |
|  [ Database Layer ]                                                                   |
|  - User, Character, Quest, QuestCompletionLog, Item, UserItem, BossEncounter, Reward  |
|  - Local: SQLite (dev.db) | Production: PostgreSQL / Supabase / Neon                  |
+---------------------------------------------------------------------------------------+
```

---

## 🎮 3. Core Features & Mechanics

### 🛡️ User Authentication & Security
- **Email OTP Verification**: Cryptographic 6-digit confirmation codes with 5-minute TTL and 3-attempt brute-force lockout.
- **Secure Password Auth**: Salted hashing with `bcryptjs` and signed HTTP-only JWT cookies.
- **Password Recovery**: Self-service encrypted reset token recovery flow.

### 📐 Relational Database Schema & Full CRUD
- **Create**: Forge custom quests with Title, Description, Type (Daily, Habit, To-Do, Boss), Difficulty, Attribute, and Due Date.
- **Read**: Dynamic filtering by Type, Attribute (STR, INT, VIT, AGI, SPR), and instant text search.
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
1. **STR (Strength)**: Gym, strength training, physical stamina.
2. **INT (Intellect)**: Coding, studying, algorithm practice, reading.
3. **VIT (Vitality)**: Sleep, hydration, healthy meals (+5 Max HP per point).
4. **AGI (Agility)**: Quick errands, rapid communication, inbox zero.
5. **SPR (Spirit)**: Meditation, mindfulness, reflection.

### 🔥 Consecutive Streak System
- Tracks daily activity with local date normalization.
- Consecutive days grant a **Streak Multiplier**: $+5\%$ reward bonus per consecutive day up to $+50\%$ at 10 days.
- Visual **28-Day Discipline Heatmap** demonstrating database log persistence.

### 💰 Virtual Economy, Armory & Custom Rewards
- Earn **Gold** by completing quests.
- Visit the **Merchant Armory** to purchase weapons, armor, elixirs, and badges.
- **Custom Real-World Rewards**: Create your own rewards (e.g. coffee, video games) and redeem hard-earned gold guilt-free.

### 🐉 World Raid Boss: Chronicus the Procrastinator
- High-stakes world raid boss with real-time health bar.
- Every quest completed deals damage to the boss with a **1.5x Critical Weakness Bonus**.

---

## 📱 4. Responsive Design & Public Pages

- **Public Landing Showcase**: High-converting hero banner, 6-card feature matrix, interactive "How It Works" 3-step guide, verified testimonials, and interactive FAQ accordion.
- **Dedicated Content & Legal Pages**:
  - `/about` - Guild Manifesto, origin story, and core pillars.
  - `/faq` - Searchable, categorized knowledge base.
  - `/contact` - Support inquiry dispatch form and Discord invite.
  - `/privacy` - GDPR-compliant privacy policy and zero ad-tracker guarantee.
  - `/terms` - Terms of Service and Guild Code of Conduct.
- **Laptop / Desktop (≥ 1024px)**: 3-column command center with keyboard shortcuts (`N` to forge quest, `Esc` to dismiss).
- **Mobile (< 1024px)**: Sticky Top HUD, tactile Bottom Navigation Dock, and thumb-friendly Floating Action Button (`+`).

---

## 🚀 5. Quick Start & Setup Instructions

### Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/Ritzz-09/Life-XP.git
cd Life-XP
npm install
```

### 2. Configure Environment
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

Run the included automated end-to-end verification test suite:
```bash
node scripts/test-engine.mjs
```
This automatically verifies:
1. User registration with 2FA Email OTP dispatch & verification
2. Relational database persistence
3. Non-linear XP leveling mathematics & attribute growth
4. Dynamic character gender switching (`MALE`, `FEMALE`, `NON_BINARY`)
5. Boss damage calculation with weakness bonus
6. Custom incentive reward store creation & gold balance deduction

---

## 📄 License
MIT License. Built with passion for Tech Zephyr 4.0 Hackathon.

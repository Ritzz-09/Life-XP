# ⚔️ Life-XP: Turn Your Life Into an RPG
### Built for Tech Zephyr 4.0 Hackathon (September 12–13, 2026)

> **Stop procrastinating. Turn daily discipline, fitness, and study into an RPG progression system.**  
> Built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Prisma ORM (SQLite / PostgreSQL), and native Web Audio synthesis. Responsive across mobile phones, tablets, and desktop.

[![Live Demo](https://img.shields.io/badge/Live_Demo-life--xp--bice.vercel.app-00dfa2?style=for-the-badge&logo=vercel)](https://life-xp-bice.vercel.app)
[![Walkthrough Video](https://img.shields.io/badge/Walkthrough_Video-demo.mp4-red?style=for-the-badge)](https://github.com/Ritzz-09/Life-XP/raw/main/demo.mp4)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4.1-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> 🌐 **Live Website**: [https://life-xp-bice.vercel.app](https://life-xp-bice.vercel.app)  
> 🎬 **Walkthrough Video**: [Watch / Download demo.mp4 (2 mins 15s)](https://github.com/Ritzz-09/Life-XP/raw/main/demo.mp4) *(Full HD 1080p demo walkthrough, zero login required)*  
> 🗄️ **Production Database**: Neon Serverless PostgreSQL (`aws-us-east-2`)

---

## 📋 Hackathon Disclosures & Compliance

In accordance with the **Tech Zephyr 4.0 Development Guidelines**:
- **Original Codebase**: 100% bespoke code written during the hackathon. No pre-built website templates or downloaded UI kits were used.
- **Third-Party Libraries & Frameworks**:
  - `next` (v16.3.5) & `react` (v19.2.8) - Full-stack React App Router
  - `@prisma/client` & `prisma` (v6.4.1) - Type-safe database ORM
  - `bcryptjs` (v3.0.3) & `jsonwebtoken` (v9.0.3) - Password hashing & signed JWT auth
  - `canvas-confetti` (v1.9.4) - Level-up celebration particle physics
  - `lucide-react` (v1.45.0) - UI icons
  - `Web Audio API` (native browser) - Real-time synthesized 8-bit sound chimes (<5ms latency, 0 external audio files)
- **AI Tool Usage**: Developed with Google DeepMind Antigravity / Gemini as an AI pair-programmer for scaffolding, algorithmic leveling curves, and test scripts.

---

## 💡 Why We Built Life-XP

Most productivity apps fail because they treat habit tracking like an administrative chore. Going to the gym, studying data structures, or drinking enough water have **delayed feedback loops**—you don't see results for weeks or months. In contrast, games keep us engaged because every action yields immediate visual, auditory, and numerical feedback.

Life-XP brings that same psychological feedback loop to real life:
- **Instant Audio-Tactile Feedback**: Browser-synthesized 8-bit sound effects and confetti celebrations when tasks are completed.
- **Externalizing Procrastination**: Rather than feeling guilty about resistance, you fight **Chronicus the Procrastinator**—a boss whose health depletes with your daily tasks.
- **Micro-Habit Stacking**: Attribute points (STR, INT, VIT, AGI, SPR) map directly to real-world self-improvement areas.
- **Guilt-Free Rewards**: Earn in-game Gold to redeem real-life incentives you set for yourself (like gaming sessions or favorite treats).

---

## 🏗️ Architecture & Tech Stack

```
+---------------------------------------------------------------------------------------+
|                                    LIFE-XP SYSTEM                                     |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|  [ Client Layer ]                                                                     |
|  - Next.js 16 (App Router, React 19, TypeScript)                                      |
|  - Tailwind CSS Dark Fantasy & Cyberpunk palette                                      |
|  - Web Audio API (Synthesized chimes, <5ms latency, 0 external audio assets)          |
|  - Responsive Desktop HUD (3-column deck) & Mobile Viewport (Tactile bottom dock)     |
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

## 🎮 Core Features & Mechanics

### 🛡️ Authentication & Account Security
- **Live Gmail SMTP OTP Verification**: Real-time 6-digit confirmation codes dispatched via Gmail SMTP (`nodemailer`) with Google App Passwords to any user or judge's email inbox within 1–2 seconds.
- **Frictionless Hero Registration & Security**: Instant character creation, input sanitization, and password salting with `bcryptjs`.
- **Password Security & Sessions**: Signed HTTP-only JWT cookies for persistent cross-session authentication.
- **Guest Demo Mode**: One-click preview account to explore Level 3 Hero mechanics immediately.

### 📐 Quest Engine & Full CRUD
- **Create**: Forge custom quests with Title, Description, Type (Daily, Habit, To-Do, Boss), Difficulty, Attribute, and Due Date.
- **Filter & Search**: Dynamic filtering by Type, Attribute (STR, INT, VIT, AGI, SPR), and instant text search.
- **Edit & Abandon**: Full editing and 1-click abandon support.

### ⚡ Non-Linear RPG Progression Engine
- Character progression governed by an exponential curve:
  $$\text{XP Required for Level } L = \lfloor 100 \times L^{1.5} \rfloor$$
  - Level 1 → 2: 100 XP
  - Level 2 → 3: 282 XP
  - Level 3 → 4: 519 XP
  - Level 4 → 5: 800 XP
  - Level 10: 3,162 XP
- Full HP restoration upon level-up with audio-visual celebration fanfare.

### 📊 5 Core Character Attributes
1. **STR (Strength)**: Gym, strength training, physical stamina.
2. **INT (Intellect)**: Coding, studying, algorithm practice, reading.
3. **VIT (Vitality)**: Sleep, hydration, healthy meals (+5 Max HP per point).
4. **AGI (Agility)**: Quick errands, rapid communication, inbox zero.
5. **SPR (Spirit)**: Meditation, mindfulness, reflection.

### 🔥 Consecutive Streak System
- Consecutive days grant a **Streak Multiplier**: $+5\%$ reward bonus per consecutive day up to $+50\%$ at 10 days.
- Visual **28-Day Discipline Heatmap** demonstrating database log persistence.

### 💰 Virtual Economy & Custom Real-World Rewards
- Earn **Gold** by completing quests.
- Visit the **Merchant Armory** to purchase weapons, armor, elixirs, and cosmetic badges.
- **Custom Rewards**: Set your own real-world rewards (e.g. coffee, gaming session) and spend your hard-earned gold guilt-free.

### 🐉 World Raid Boss: Chronicus the Procrastinator
- High-stakes world raid boss with real-time health bar.
- Completing quests inflicts damage to the boss with a **1.5x Critical Weakness Bonus** when using the boss's current weakness attribute.

---

## 📱 Responsive Design & Public Pages

- **Landing Showcase**: Feature overview, 3-step onboarding preview, live Chronicus combat showcase, and interactive FAQ.
- **Public & Legal Pages**:
  - `/about` - The philosophy behind turning discipline into an RPG.
  - `/faq` - Frequently asked questions about quests, XP math, and rewards.
  - `/contact` - Direct contact and feedback channel.
  - `/privacy` - Privacy policy and local data handling statement.
  - `/terms` - Terms of Service and community guidelines.
- **Desktop (≥ 1024px)**: 3-column command center with keyboard shortcuts (`N` to forge quest, `Esc` to dismiss).
- **Mobile (< 1024px)**: Sticky Top HUD, tactile Bottom Navigation Dock, and thumb-friendly Floating Action Button (`+`).

---

## 🚀 Quick Start & Setup Instructions

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

## 🧪 Automated Full-Stack Verification

Run the included automated end-to-end verification test suite:
```bash
node scripts/test-engine.mjs
```
This automatically verifies:
1. User registration & secure JWT session issuance
2. Relational database persistence
3. Non-linear XP leveling mathematics & attribute growth
4. Dynamic character gender switching (`MALE`, `FEMALE`, `NON_BINARY`)
5. Boss damage calculation with weakness bonus
6. Custom incentive reward store creation & gold balance deduction

---

## 📄 License
MIT License. Built with passion for Tech Zephyr 4.0 Hackathon.

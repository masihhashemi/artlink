# Art Link

Social network for art alumni — profiles, skills, looking-for / offering posts, skill-based recommendations, connections, messaging, and a feed with likes & comments.

**Live demo:** [https://artlink-tau.vercel.app](https://artlink-tau.vercel.app) — try `maya@artlink.demo` / `demo1234`

**Monorepo layout**

- Website + REST API — Next.js at the repo root
- iOS app — Expo in [`mobile/`](./mobile)

## Quick start (demo mode)

Demo mode runs fully locally with a file-backed store (no Supabase account required).

### Website

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### iOS app (Expo)

Keep the website running on port 3000, then in another terminal:

```bash
cd mobile
npm install
npm run ios
```

Or `npm start` and press `i` for the iOS Simulator.

The app talks to `http://localhost:3000/api/*` (iOS Simulator). On a physical device, point it at your Mac’s LAN IP:

```bash
# mobile/.env
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000
```

Then restart Expo (`npx expo start -c`).

### Demo accounts

| Email | Password |
| --- | --- |
| maya@artlink.demo | demo1234 |
| jordan@artlink.demo | demo1234 |
| sam@artlink.demo | demo1234 |
| aisha@artlink.demo | demo1234 |

Seed data lives in `.data/store.json` (created on first run). Delete that file to reset.

## Features

- **Profiles** — picture, description, education/university, skills, experiences, portfolio gallery
- **Posts** — looking for, offering, or updates (with skill tags + feed filters)
- **Notifications** — skill-match alerts when someone needs what you have
- **Discover** — recommendation scores from shared / complementary skills + university
- **Network** — connect requests, accept/decline
- **Messages** — DMs between accepted connections (web)
- **Feed social** — likes and comments (web); Apply on skill-match posts (web + iOS)
- **iOS** — sign in, feed + Apply, discover, network accept/connect, profiles

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Expo Router + React Native (iOS)
- Local demo store by default (`NEXT_PUBLIC_DEMO_MODE=true`)
- Mobile auth: `Authorization: Bearer <userId>` against `/api/*`
- Supabase SQL schema + seed ready for production migration (`supabase/`)

## Supabase (optional / later)

1. Create a Supabase project
2. Run `supabase/migrations/001_initial.sql` then `supabase/seed.sql`
3. Copy `.env.example` → `.env.local` and set:

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Client helpers are in `src/lib/supabase/`. The prototype currently serves traffic through the demo store so you can pitch and test immediately; wire the same schema to Supabase when you are ready to host.

## Scripts

**Root (web)**

- `npm run dev` — local development (+ `/api` for mobile)
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — ESLint

**mobile/**

- `npm start` — Expo dev server
- `npm run ios` — open iOS Simulator
- `npm run android` — Android emulator
- `npm run web` — Expo web

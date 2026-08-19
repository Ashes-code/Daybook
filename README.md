# Daybook

A phone journal / diary app built with **Expo (SDK 57)** and **React Native**.  
Not a generic notes app — life is organized by **days**, with **multiple entries per day**, mood, titles, and search. Auth and cloud sync from day one (Supabase).

## Product idea

Open a day. Write. Flip through time like a paper diary.

- **Days** are the spine (calendar + day list)
- **Multiple entries per day** (morning, night, quick thoughts)
- **Full diary feel**: title, mood, body text, search
- **Account + cloud** so entries follow you across devices

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Expo SDK 57 + Expo Router |
| UI | React Native |
| Language | TypeScript |
| Local cache | AsyncStorage (+ SecureStore for secrets) |
| Auth & DB | Supabase (email auth, Postgres, RLS) |
| Client state | Zustand |
| Dates | date-fns |

Docs for this exact SDK: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)

## Project docs

| File | Purpose |
| --- | --- |
| [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) | Vision, features, data model, milestones |
| [AGENTS.md](./AGENTS.md) | Rules for AI agents working on this repo |
| [CODEBASE_MAP.md](./CODEBASE_MAP.md) | What each folder/file is for + changelog of work done |

## Prerequisites

- Node.js **22.13+** (SDK 57 requirement)
- npm
- Expo Go on a phone, or Android emulator / iOS simulator

## Setup

```bash
npm install
npx expo start
```

Then press `a` (Android), `i` (iOS), `w` (web), or scan the QR code with Expo Go.

### Environment (later milestones)

Copy when we wire Supabase:

```bash
# .env (do not commit secrets)
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Start Expo dev server |
| `npm run android` | Start and open Android |
| `npm run ios` | Start and open iOS |
| `npm run web` | Start web |
| `npm run lint` | ESLint via `expo lint` |

## Current status

**Milestone 0 in progress** — Expo upgraded to SDK 57, core deps installed, project docs created.  
App UI is still the Expo starter (tabs Home / About). Diary screens come next.

See [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) for the full roadmap.

# CODEBASE_MAP — What exists and what it is for

Living map of the Daybook repository. **Update this file** when folders/files gain real meaning or milestones complete.

---

## What has been done

### 2026-08-19 — Milestone 0 (partial)

- Redefined project from Expo "StickerSmash" tutorial sample → **Daybook** journal product direction.
- Product choices locked: full diary feel, multiple entries per day, auth + cloud from day one.
- Upgraded **Expo SDK 54 → 57** (current stable at time of work).
- Ran `npx expo install --fix` so React, RN, Expo modules, Router, Reanimated, etc. match SDK 57.
- Installed app-facing libraries planned for later milestones:
  - `@supabase/supabase-js`
  - `zustand`
  - `@react-native-async-storage/async-storage`
  - `expo-secure-store`
  - `date-fns`
- Created / replaced project docs:
  - `README.md`
  - `PROJECT_DOCUMENTATION.md`
  - `AGENTS.md`
  - `CODEBASE_MAP.md` (this file)
  - `LEARNING.md`
- Updated `app.json` name/slug/scheme toward Daybook; removed schema-invalid keys flagged by expo-doctor.
- **Not done yet:** diary UI, folder structure (`lib/`, `components/`, …), Supabase project, replacing starter tab screens.

### 2026-08-20 — Milestone 0 Complete + M1 Shell UI

- Created folder structure: `components/`, `constants/`, `hooks/`, `lib/`, `services/`, `stores/`, `types/`
- Defined `Entry` type and `Mood` union type in `types/entry.ts`
- Created theme tokens (colors, spacing, typography) in `constants/theme.ts`
- Created mood constants in `constants/moods.ts`
- Set up tab navigation with Expo Router: Today, Calendar, Search, Profile
- Built placeholder screens for all tabs
- Created mock data in `lib/mock.ts`
- Built reusable components: `EntryCard`, `DayHeader`, `MoodBadge`
- Built Today screen with real entries list
- Built Calendar screen with month grid and entry dots
- Built Search screen with text filtering
- Built Profile screen (placeholder)
- Created New Entry modal screen with title, body, mood picker
- Added safe area insets to all tabs for proper spacing
- Added filled icons for active tab
- Added mood filter to search
- Added Analytics, Favorites, About to Profile
- Added calendar vertical scroll for desktop

---

## Top-level files

| Path | Purpose |
| --- | --- |
| `package.json` | npm scripts and dependencies |
| `package-lock.json` | Locked dependency tree |
| `app.json` | Expo app config (name, icons, plugins, scheme) |
| `tsconfig.json` | TypeScript compiler options |
| `eslint.config.js` | ESLint flat config (expo) |
| `expo-env.d.ts` | Auto Expo TS env references |
| `.gitignore` | Git ignore rules |
| `README.md` | Human quick start + overview |
| `PROJECT_DOCUMENTATION.md` | Vision, data model, milestones |
| `AGENTS.md` | Rules for AI agents |
| `CODEBASE_MAP.md` | This map + progress log |
| `LEARNING.md` | Step-by-step roadmap |
| `CLAUDE.md` | Points at AGENTS.md for Claude |

---

## `app/` — Expo Router routes (screens)

File-based routing. The file tree **is** the navigation tree.

| Path | Purpose | Status |
| --- | --- | --- |
| `app/_layout.tsx` | Root layout: Stack + StatusBar | M0 complete |
| `app/index.tsx` | Redirects to (tabs) | M0 complete |
| `app/(tabs)/_layout.tsx` | Tab navigator layout | M1 complete |
| `app/(tabs)/index.tsx` | Today screen | M1 complete |
| `app/(tabs)/calendar.tsx` | Calendar screen | M1 complete |
| `app/(tabs)/search.tsx` | Search screen | M1 complete |
| `app/(tabs)/profile.tsx` | Profile screen | M1 complete |
| `app/entry/new.tsx` | New entry modal | M1 complete |

---

## `components/` — Reusable UI

| Path | Purpose |
| --- | --- |
| `components/EntryCard.tsx` | Card showing entry title, mood, body preview |
| `components/DayHeader.tsx` | Date + entry count header |
| `components/MoodBadge.tsx` | Visual mood indicator pill |
| `components/index.ts` | Placeholder for future exports |

---

## `constants/` — Theme and config

| Path | Purpose |
| --- | --- |
| `constants/theme.ts` | Colors (light/dark), Spacing, Typography |
| `constants/moods.ts` | MOODS array + MOOD_COLORS mapping |

---

## `lib/` — Utilities

| Path | Purpose |
| --- | --- |
| `lib/mock.ts` | Mock diary entries for testing |
| `lib/index.ts` | Placeholder for future exports |

---

## `types/` — TypeScript types

| Path | Purpose |
| --- | --- |
| `types/entry.ts` | Entry type + Mood union type |

---

## Other folders (not yet created)

| Path | Purpose |
| --- | --- |
| `hooks/` | Custom React hooks (useAuth, useEntries) |
| `services/` | API/data access (auth.ts, entries.ts) |
| `stores/` | Zustand state stores |

---

## Dependencies (why they are here)

### Runtime (selected)

| Package | Why |
| --- | --- |
| `expo` | Framework / SDK 57 |
| `expo-router` | File-based navigation |
| `react` / `react-native` | UI runtime |
| `react-native-reanimated` | Animations |
| `react-native-gesture-handler` | Gestures |
| `react-native-screens` | Native screen containers |
| `react-native-safe-area-context` | Safe areas |
| `@expo/vector-icons` | Icons |
| `expo-secure-store` | Secure session storage |
| `@react-native-async-storage/async-storage` | Lightweight local cache |
| `@supabase/supabase-js` | Auth + database client |
| `zustand` | Simple client state |
| `date-fns` | Date formatting / calendar math |
| `expo-haptics` | Tactile feedback on actions |
| `expo-splash-screen` | Splash control |
| `expo-status-bar` | Status bar style |
| `expo-font` / `expo-image` | Fonts / images |

### Dev

| Package | Why |
| --- | --- |
| `typescript` | Types |
| `eslint` + `eslint-config-expo` | Lint |
| `@types/react` | React types |

---

## Scripts

| npm script | Meaning |
| --- | --- |
| `start` | `expo start` |
| `android` / `ios` / `web` | Platform entry |
| `lint` | `expo lint` |
| `reset-project` | Expo template helper (avoid once diary structure lands) |

---

## Environment variables (planned)

| Name | Purpose |
| --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public, RLS-protected) |

Never commit real values. Never use the **service role** key in the mobile app.

---

## How to keep this file honest

After each meaningful session:

1. Add a dated bullet under **What has been done**
2. Update table rows when a file's purpose changes
3. Move items from "planned" to real paths when created

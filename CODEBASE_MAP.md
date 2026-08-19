# CODEBASE_MAP — What exists and what it is for

Living map of the Daybook repository. **Update this file** when folders/files gain real meaning or milestones complete.

---

## What has been done

### 2026-08-19 — Milestone 0 (partial)

- Redefined project from Expo “StickerSmash” tutorial sample → **Daybook** journal product direction.
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
- Updated `app.json` name/slug/scheme toward Daybook; removed schema-invalid keys flagged by expo-doctor (`newArchEnabled`, `edgeToEdgeEnabled`).
- **Not done yet:** diary UI, folder structure (`lib/`, `components/`, …), Supabase project, replacing starter tab screens.

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
| `CLAUDE.md` | Points at AGENTS.md for Claude |

---

## `app/` — Expo Router routes (screens)

File-based routing. The file tree **is** the navigation tree.

| Path | Purpose | Status |
| --- | --- | --- |
| `app/_layout.tsx` | Root layout: Stack + StatusBar | Starter; will gain auth providers later |
| `app/+not-found.tsx` | 404 / unknown route screen | Starter |
| `app/(tabs)/_layout.tsx` | Tab navigator layout | Starter tabs; will become Today/Calendar/Search/Profile |
| `app/(tabs)/index.tsx` | Home tab screen | Starter placeholder (will become Today / journal home) |
| `app/(tabs)/about.tsx` | About tab | Starter leftover; will be removed or replaced |

**Planned (not created yet):**

- `app/(auth)/` — sign-in, sign-up
- `app/entry/[id].tsx` — edit entry
- `app/entry/new.tsx` — create entry
- Day route or query param for selected date

---

## `assets/`

| Path | Purpose |
| --- | --- |
| `assets/images/` | App icon, splash, adaptive icons, favicon |

Will later hold any diary-specific illustrations/fonts if added.

---

## Folders not created yet (planned)

| Path | Purpose |
| --- | --- |
| `components/` | Reusable UI (EntryCard, MoodPicker, DayHeader, …) |
| `constants/` | Colors, spacing, mood list |
| `hooks/` | `useAuth`, `useEntries`, etc. |
| `lib/` | Supabase client, date helpers |
| `services/` | `entries.ts`, `auth.ts` data access |
| `stores/` | Zustand stores |
| `types/` | `entry.ts`, etc. |
| `supabase/` | SQL migrations & RLS |

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
2. Update table rows when a file’s purpose changes
3. Move items from “planned” to real paths when created

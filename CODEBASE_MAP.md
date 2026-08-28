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

### 2026-08-28 — Pass 2B Complete (Entry Interactions)

- Updated entry form to support edit mode (prefill with existing entry data)
- Wired entry card taps in Today screen to open form in edit mode
- Created day entries modal (`app/day/[date].tsx`) for Calendar
- Day modal shows entries for selected day with add/edit capability
- Empty day state shows "Write something" button
- Wired calendar day taps to day entries modal
- All interactions pass lint

### 2026-08-28 — Profile Features (Analytics, Favorites, Themes, About)

- Created Analytics screen with mockup data (entry counts, mood breakdown, streaks, habits)
- Created Favorites screen to show favorited entries
- Added context menu to EntryCard (long-press: edit, favorite, delete)
- Added `favorited` field to Entry type
- Updated theme system with 3 themes: Brown Paper (warm earthy), Dark (clean black/white), Light (bright with blue accents)
- Created theme store (`stores/theme.ts`) with Zustand for theme persistence
- Created entries store (`stores/entries.ts`) for managing entry state
- Created Appearance screen to switch themes with live preview
- Created About screen with app summary + version
- Wired Profile buttons to all new screens
- All screens use theme store for consistent theming
- Updated all screens to use entries store instead of mock data directly
- Lint passes clean

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
| `app/_layout.tsx` | Root layout: Stack + StatusBar + theming | M0 complete |
| `app/index.tsx` | Redirects to (tabs) | M0 complete |
| `app/(tabs)/_layout.tsx` | Tab navigator layout | M1 complete |
| `app/(tabs)/index.tsx` | Today screen | M1+2B complete |
| `app/(tabs)/calendar.tsx` | Calendar screen | M1+2B complete |
| `app/(tabs)/search.tsx` | Search screen | M1+2B complete |
| `app/(tabs)/profile.tsx` | Profile screen | M1+2B complete |
| `app/entry/new.tsx` | Entry form (create + edit) | M1+2B complete |
| `app/day/[date].tsx` | Day entries modal | M1+2B complete |
| `app/analytics/index.tsx` | Analytics with mockup data | Profile features |
| `app/favorites/index.tsx` | Favorited entries list | Profile features |
| `app/appearance/index.tsx` | Theme switcher (3 themes) | Profile features |
| `app/about/index.tsx` | App summary + version | Profile features |

---

## `components/` — Reusable UI

| Path | Purpose |
| --- | --- |
| `components/EntryCard.tsx` | Card with context menu (edit, favorite, delete) |
| `components/DayHeader.tsx` | Date + entry count header |
| `components/MoodBadge.tsx` | Visual mood indicator pill |
| `components/index.ts` | Placeholder for future exports |

---

## `constants/` — Theme and config

| Path | Purpose |
| --- | --- |
| `constants/theme.ts` | 3 themes (brownPaper, dark, light), Spacing, Typography |
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
| `types/entry.ts` | Entry type (with favorited), Mood union, ThemeName union |

---

## Other folders (not yet created)

| Path | Purpose |
| --- | --- |
| `hooks/` | Custom React hooks (useAuth, useEntries) |
| `services/` | API/data access (auth.ts, entries.ts) |

---

## `stores/` — Zustand state stores

| Path | Purpose |
| --- | --- |
| `stores/theme.ts` | Theme selection (brownPaper, dark, light) |
| `stores/entries.ts` | Entry state management (favorites, delete) |

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

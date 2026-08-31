# LEARNING.md — Our step-by-step roadmap

This file is our living plan. We've worked through it **part by part**, checking off items as we go.

---

## Pass 1: Project Skeleton (M0 — Foundation) ✅

Goal: Empty folders → real folder structure → tab navigation that renders.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Create folder structure (`components/`, `constants/`, `hooks/`, `lib/`, `services/`, `stores/`, `types/`) | ✅ | Done |
| 2 | Define `Entry` type in `types/entry.ts` | ✅ | Done |
| 3 | Create theme tokens in `constants/theme.ts` (colors, spacing, typography) | ✅ | Done |
| 4 | Create mood constants in `constants/moods.ts` | ✅ | Done |
| 5 | Set up `(tabs)/` route group with layout | ✅ | Done |
| 6 | Build placeholder screens: Today, Calendar, Search, Profile | ✅ | Done |
| 7 | Verify app runs cleanly on Expo Go / emulator | ✅ | Done |

---

## Pass 2: Shell UI with Mock Data (M1) ✅

Goal: Fake data → real-feeling diary screens. No backend yet.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 8 | Create mock data in `lib/mock.ts` | ✅ | Later removed (entries start empty) |
| 9 | Build `EntryCard` component in `components/EntryCard.tsx` | ✅ | With context menu, fade-in animation, heart bounce |
| 10 | Build Today screen with mock entries list | ✅ | Done |
| 11 | Build Calendar screen with month grid | ✅ | With entry dots, day tap → modal |
| 12 | Build Search screen over mock data | ✅ | Now searches real entries with mood filter |
| 13 | Build Profile screen (placeholder) | ✅ | Now shows email, sign out, links to sub-screens |
| 14 | Add "New Entry" button/modal | ✅ | Done |
| 15 | Build entry form screen (title, body, mood) | ✅ | With auto-focus, word count, haptics |
| 16 | Verify full navigation flow end-to-end | ✅ | Done |

---

## Pass 2B: Entry Interactions (M1 polish) ✅

Goal: Tap entry → edit it. Tap calendar day → see entries for that day.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 17 | Update entry form to support edit mode | ✅ | Same screen, prefill with existing entry data |
| 18 | Wire entry card taps to open form in edit mode | ✅ | Pass entry ID, title, body, mood |
| 19 | Create day entries modal for Calendar | ✅ | Modal with entry list |
| 20 | Wire calendar day taps to appropriate modals | ✅ | Day with entries → list, empty day → empty state |
| 21 | Run lint and verify all interactions work | ✅ | Done |

---

## Pass 3: Auth + Welcome Flow (M2) ✅

Goal: Real auth with Supabase. Welcome screen → sign in/sign up → app.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 22 | Create Supabase project at supabase.com | ✅ | Done in browser |
| 23 | Set up `.env` with Supabase credentials | ✅ | `.env` excluded from git |
| 24 | Create Supabase client in `lib/supabase.ts` | ✅ | With SecureStore session persistence |
| 25 | Build Welcome/Splash screen | ✅ | Book icon, tagline, Get Started + Sign In |
| 26 | Build empty state design for Today screen | ✅ | Illustration + prompt |
| 27 | Build sign up screen (email + password) | ✅ | With success modal |
| 28 | Build sign in screen (email + password) | ✅ | With eye toggle for password |
| 29 | Set up auth gate in root layout | ✅ | Redirect unauthenticated users |
| 30 | Wire sign out to Profile screen | ✅ | Show user email + sign out |
| 31 | Test auth flow end-to-end | ✅ | Sign up → stay signed in → sign out |
| 32 | Theme persistence across app restarts | ✅ | AsyncStorage + Zustand |

---

## Pass 4: Cloud CRUD + Sync (M3) ✅

Goal: Entries stored in Supabase, synced across devices, offline-friendly.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 33 | SQL migration: `entries` table + RLS policies | ✅ | `supabase/migrations/001_create_entries.sql` |
| 34 | Create entries service (`services/entries.ts`) | ✅ | CRUD + pending ops queue + platform-aware storage |
| 35 | Wire entry form to Supabase (create + update) | ✅ | Online → Supabase, offline → queue |
| 36 | Wire delete to Supabase | ✅ | Delete remote + queue if offline |
| 37 | Wire favorite toggle to Supabase | ✅ | Update remote on toggle |
| 38 | Load entries from Supabase on login | ✅ | Root layout fetches remote, syncs pending ops |
| 39 | Pull-to-refresh on Today, Search, Favorites | ✅ | Re-fetches remote + syncs pending ops |
| 40 | Offline queue with retry | ✅ | Pending ops stored in AsyncStorage, replayed on reconnect |
| 41 | Network status toasts | ✅ | Offline/online/sync notifications |
| 42 | Sync favorites across devices | ✅ | Favorited state synced to Supabase |
| 43 | Custom email templates in Supabase | ✅ | Done in Supabase dashboard |

---

## Pass 5: Polish + Release Prep (M4 + M5) ✅

Goal: Make it feel like a real diary app, then prepare for release.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 44 | Loading states on main screens | ✅ | ActivityIndicator on Today, Search, Favorites |
| 45 | Entry writing UX improvements | ✅ | Auto-focus body, word count, haptic on save |
| 46 | Favorite heart animation | ✅ | Spring bounce on toggle |
| 47 | Entry card fade-in animation | ✅ | 300ms fade on mount |
| 48 | App icon (custom book on brown paper) | ✅ | SVG → PNG, all sizes in `assets/images/` |
| 49 | Splash screen | ✅ | Custom with brown paper background |
| 50 | Theme system (3 themes) | ✅ | Brown paper (default), dark, light |
| 51 | Toast notification system | ✅ | Animated toasts for offline/online/sync |
| 52 | `.gitignore` audit | ✅ | `.env` excluded |
| 53 | `eas.json` for EAS Build | ✅ | development, preview, production profiles |
| 54 | Error handling in service layer | ✅ | User-facing alerts on sync failure |
| 55 | Clean up dead code | ✅ | Removed MoodBadge, DayHeader, mock.ts, unused packages |
| 56 | Analytics with real data | ✅ | Streaks, weekly habits, mood breakdown |

---

## What we learned

| Milestone | Key concepts |
|---|---|
| M0 | Expo project layout, SDK upgrades, `expo install` |
| M1 | Expo Router, lists, navigation params, controlled inputs |
| M2 | Auth flows, secure storage, protected routes, Zustand stores |
| M3 | Postgres, RLS, async data fetching, offline-first design |
| M4 | UX details, animations (Animated API), haptics, accessibility |
| M5 | Shipping mindset, EAS config, error handling, code cleanup |

---

## Commands we use often

```bash
npx expo start          # Start the dev server
npx expo start --clear  # Clear cache if something breaks
npm run lint            # Check code quality
npx expo install <pkg>  # Install compatible native packages
```

---

## What's next?

The core app is feature-complete for V1. Potential next steps:
- Google OAuth (requires Google Cloud Console setup)
- Automated tests (Jest + React Native Testing Library)
- Privacy policy + account deletion path
- EAS Build submission to app stores
- Rich text editor (V2)
- Entry attachments / photos (V2)

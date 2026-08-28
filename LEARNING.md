# LEARNING.md — Our step-by-step roadmap

This file is our living plan. We'll work through it **part by part**, checking off items as we go. Each part is small enough to follow along with.

---

## Pass 1: Project Skeleton (M0 — Finish Foundation)

Goal: Empty folders → real folder structure → tab navigation that renders.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Create folder structure (`components/`, `constants/`, `hooks/`, `lib/`, `services/`, `stores/`, `types/`) | ✅ | Done |
| 2 | Define `Entry` type in `types/entry.ts` | ✅ | Done |
| 3 | Create theme tokens in `constants/theme.ts` (colors, spacing, typography) | ✅ | Done |
| 4 | Create mood constants in `constants/moods.ts` | ✅ | Done |
| 5 | Set up `(tabs)/` route group with layout | ✅ | Done |
| 6 | Build placeholder screens: Today, Calendar, Search, Profile | ✅ | Done |
| 7 | Verify app runs cleanly on Expo Go / emulator | ⬜ | `npx expo start` |

---

## Pass 2: Shell UI with Mock Data (M1)

Goal: Fake data → real-feeling diary screens. No backend yet.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 8 | Create mock data in `lib/mock.ts` | ✅ | Done |
| 9 | Build `EntryCard` component in `components/EntryCard.tsx` | ✅ | Done |
| 10 | Build `DayHeader` component in `components/DayHeader.tsx` | ✅ | Done |
| 11 | Build `MoodBadge` component in `components/MoodBadge.tsx` | ✅ | Done |
| 12 | Build Today screen with mock entries list | ✅ | Done |
| 13 | Build Calendar screen with month grid | ✅ | Done |
| 14 | Build Search screen over mock data | ✅ | Done |
| 15 | Build Profile screen (placeholder) | ✅ | Done |
| 16 | Add "New Entry" button/modal | ✅ | Done |
| 17 | Build entry form screen (title, body, mood) | ✅ | Done |
| 18 | Verify full navigation flow end-to-end | ✅ | Done |

---

## Pass 2B: Entry Interactions (M1 polish)

Goal: Tap entry → edit it. Tap calendar day → see entries for that day.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 29 | Update entry form to support edit mode (prefill with existing entry data) | ✅ | Same screen, different behavior based on whether entry is passed |
| 30 | Wire entry card taps in Today screen to open form in edit mode | ✅ | Pass entry ID to form, prefill fields |
| 31 | Create day entries modal for Calendar (entries for selected day) | ✅ | Modal with entry list, tapping one opens edit form |
| 32 | Create empty day modal for Calendar (no entries + add button) | ✅ | "No entries" message + "+" to create one for that day |
| 33 | Wire calendar day taps to appropriate modals | ✅ | Day with entries → list modal, empty day → empty modal |
| 34 | Run lint and verify all interactions work | ✅ | Test full flow |

---

## Pass 3: Auth + Welcome Flow (M2)

Goal: Real auth with Supabase. Welcome screen → sign in/sign up → app.

Design notes:
- Welcome/splash screen opens the app
- Auth designed for email/password first, Google later
- Empty state mockup when no entries exist yet
- **App logo:** Use the book icon (`Ionicons name="book"`) from the About page consistently across splash screen and app icon

| # | Task | Status | Notes |
|---|------|--------|-------|
| 19 | Create Supabase project at supabase.com | ⬜ | You do this in browser |
| 20 | Set up `.env` with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` | ⬜ | Never commit secrets |
| 21 | Create Supabase client in `lib/supabase.ts` | ⬜ | Configured with SecureStore for session persistence |
| 22 | Build Welcome/Splash screen | ⬜ | App intro — app name, tagline, "Get Started" + "Sign In" buttons. Use book icon |
| 23 | Build empty state design for Today screen | ⬜ | Illustration + prompt when no entries exist |
| 24 | Build sign up screen (email + password) | ⬜ | Designed so Google sign-in can be added below later |
| 25 | Build sign in screen (email + password) | ⬜ | Designed so Google sign-in can be added below later |
| 26 | Set up auth gate in root layout | ⬜ | Redirect unauthenticated users to welcome/auth |
| 27 | Wire sign out to Profile screen | ⬜ | Show user email + sign out button |
| 28 | Test auth flow end-to-end | ⬜ | Sign up → stay signed in → sign out → back to welcome |
| 35 | Update app icon to use book icon | ⬜ | Match the About page book icon |
| 36 | Update splash screen to use book icon | ⬜ | Consistent branding |

---

## How to use this file

1. Tell me which numbered item to tackle next
2. I'll build it, explain what's happening, and mark it done
3. We run lint after code changes to keep things clean
4. We update this file as we go

### Commands you'll use often

```bash
npx expo start          # Start the dev server
npx expo start --clear  # Clear cache if something breaks
npm run lint            # Check code quality
```

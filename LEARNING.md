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
| 8 | Create mock data in `lib/mock.ts` | ⬜ | Entries across several days with moods |
| 9 | Build `EntryCard` component in `components/EntryCard.tsx` | ⬜ | Shows title, mood, body preview |
| 10 | Build `DayHeader` component in `components/DayHeader.tsx` | ⬜ | Date + entry count |
| 11 | Build `MoodBadge` component in `components/MoodBadge.tsx` | ⬜ | Visual mood indicator |
| 12 | Build Today screen with mock entries list | ⬜ | FlatList, empty state |
| 13 | Build Calendar screen with month grid | ⬜ | "Has entries" dots on dates |
| 14 | Build Search screen over mock data | ⬜ | Text input → filter entries |
| 15 | Build Profile screen (placeholder) | ⬜ | Sign in/out stub for M2 |
| 16 | Add "New Entry" button/modal | ⬜ | Opens entry form (local state only) |
| 17 | Build entry form screen (title, body, mood) | ⬜ | Controlled inputs, save to local mock |
| 18 | Verify full navigation flow end-to-end | ⬜ | Tab switch → day → entry → search |

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

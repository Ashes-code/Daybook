# Daybook — Project Documentation

## 1. Vision

Daybook turns a paper journal into a calm phone experience:

- You think in **days**, not folders of random notes
- You can write **more than once per day**
- The app feels personal (mood, titles, soft UI) — not like a work notes tool
- Your diary is **yours across devices** via auth + cloud

**Working name:** Daybook  
**Platforms:** iOS, Android, Web (Expo)

---

## 2. Product principles

1. **Day-first navigation** — calendar and “today” are primary, not a flat note list alone.
2. **Low friction writing** — open app → write quickly; polish optional.
3. **Privacy-minded** — user-owned data, Row Level Security, no public diary by default.
4. **Learn by shipping** — small milestones; each milestone teaches one Expo/RN idea.
5. **Teachable codebase** — clear folders, typed models, comments only when they teach.

---

## 3. V1 feature set (“full diary feel”)

### Must have

| Feature | Description |
| --- | --- |
| Auth | Sign up, sign in, sign out (email + password via Supabase) |
| Session restore | Stay logged in across app restarts |
| Today | Default landing: today’s day view |
| Day view | All entries for one date, newest or chronological |
| Multiple entries / day | Create, edit, delete entries under a date |
| Entry fields | Title (optional), body (required), mood (optional), timestamps |
| Calendar / day browser | Jump to any date; mark days that have writing |
| Search | Search title + body across entries |
| Cloud sync | Entries stored in Supabase Postgres for the signed-in user |
| Offline-friendly cache | Read last-known data offline; queue or clear messaging when offline write fails (v1: honest errors OK) |

### Explicit non-goals for V1

- Sharing entries publicly
- Collaborative journals
- Rich text / markdown editor (plain text first)
- AI writing features
- End-to-end encryption (may be a later milestone)
- Attachments / photos (later)

---

## 4. Data model (target)

### User

Handled by Supabase Auth (`auth.users`).

### Entry

| Field | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `user_id` | uuid | FK → auth.users, RLS |
| `entry_date` | date | Calendar day the entry belongs to (local day intent) |
| `title` | text nullable | Short label |
| `body` | text | Main writing |
| `mood` | text / enum nullable | e.g. great, good, okay, low, rough |
| `created_at` | timestamptz | Server default |
| `updated_at` | timestamptz | Updated on edit |

**Rule:** Many entries may share the same `entry_date` for one user.

### Indexes (planned)

- `(user_id, entry_date)`
- Full-text or `ilike` search on `title`, `body` for V1

---

## 5. App structure (target navigation)

```
Auth stack (logged out)
  ├── sign-in
  └── sign-up

App tabs / stack (logged in)
  ├── Today / Day view
  ├── Calendar
  ├── Search
  └── Profile / settings
      └── sign out

Modals / stacks
  ├── entry/new?date=
  └── entry/[id]
```

Exact route files will live under `app/` (Expo Router file-based routing).

---

## 6. Technical architecture

```
┌─────────────────────────────────────────┐
│  Expo Router screens (app/)             │
│  UI components (components/)            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Stores (Zustand) + hooks               │
│  Auth session, entries cache, UI state  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Services                               │
│  supabase client, entries API, auth API │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Supabase                               │
│  Auth + Postgres + RLS                  │
└─────────────────────────────────────────┘
```

### Stack versions (pinned by Expo)

- Expo **SDK 57**
- React **19.2.x**
- React Native **0.86.x**
- Expo Router **~57**

Always install native modules with:

```bash
npx expo install <package>
```

Always read versioned docs:

https://docs.expo.dev/versions/v57.0.0/

---

## 7. Milestones

### Milestone 0 — Foundation ✅

- [x] Upgrade Expo to current stable (SDK 57)
- [x] Align all Expo-related dependencies
- [x] Install planned libraries (Supabase, Zustand, AsyncStorage, SecureStore, date-fns)
- [x] Project documentation set (README, PROJECT_DOCUMENTATION, AGENTS, CODEBASE_MAP)
- [x] Baseline folder structure for diary app (`components/`, `lib/`, `types/`, etc.)
- [x] App runs cleanly on Expo Go / emulator after cleanup

**Learning focus:** Expo project layout, SDK upgrades, `expo install`.

---

### Milestone 1 — Shell UI (no backend) ✅

- [x] Diary-themed design tokens (colors, typography spacing)
- [x] Tab layout: Today, Calendar, Search, Profile
- [x] Mock data: multiple entries across several days
- [x] Day view list + entry detail/edit screens (local state only)
- [x] Calendar month grid with "has entries" dots
- [x] Search over mock data

**Learning focus:** Expo Router, lists, navigation params, controlled inputs.

---

### Milestone 2 — Auth + Supabase project ✅

- [x] Create Supabase project
- [x] Env vars (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`)
- [x] Supabase client with SecureStore session persistence
- [x] Welcome/Splash screen
- [x] Empty state design for Today screen
- [x] Sign up screen (email + password, designed for Google later)
- [x] Sign in screen (email + password, designed for Google later)
- [x] Auth gate: redirect unauthenticated users
- [x] Profile shows email + sign out
- [x] Test auth flow end-to-end

**Learning focus:** Auth flows, secure storage, protected routes.

---

### Milestone 3 — Cloud entries CRUD ✅

- [x] SQL migration: `entries` table + RLS policies
- [x] Create / read / update / delete entries for current user
- [x] Wire Today, Calendar, Search to real data
- [x] Loading / empty / error states
- [x] Pull-to-refresh

**Learning focus:** Postgres, RLS, async data fetching, mutations.

---

### Milestone 4 — Polish diary feel ✅

- [x] Mood picker UX (haptic feedback on selection)
- [x] Better calendar interactions
- [x] Soft animations (fade-in cards, heart bounce on favorite)
- [x] Haptics on save / delete
- [x] Dark mode parity
- [x] Keyboard-friendly writing screen (auto-focus, word count)

**Learning focus:** UX details, accessibility basics, platform polish.

---

### Milestone 5 — Reliability & release prep ✅

- [x] Offline messaging / retry strategy (pragmatic V1)
- [x] EAS project config (`eas.json`)
- [x] App icon / splash final (custom book icon on brown paper)
- [x] Error handling in service layer (user-facing alerts on sync failure)

**Learning focus:** Shipping mindset, store readiness.

---

## 8. Success criteria for “V1 done”

1. New user can register and log in.
2. User can add several entries on today and on past days.
3. Calendar shows which days have writing; tapping opens that day.
4. Search finds text across entries.
5. Data persists after kill/relaunch and on another device with same account.
6. User can sign out; another account cannot see their entries (RLS).

---

## 9. Risks & decisions

| Topic | Decision | Notes |
| --- | --- | --- |
| Backend | Supabase | Fast auth + Postgres + RLS for learners |
| Entry timezones | Store `entry_date` as calendar date chosen in UI | Avoid “UTC midnight shifted my day” bugs |
| Rich text | Plain text V1 | Simpler; add later if needed |
| Encryption | Not E2E in V1 | Rely on HTTPS + RLS; document clearly |
| App name | Daybook (working) | Can rebrand before store |

---

## 10. How we work (human + AI)

- Build in **small vertical slices** (one milestone at a time).
- Prefer teaching moments: explain *why* a file exists when we add it.
- After each milestone, update **CODEBASE_MAP.md** “What has been done”.
- Do not commit secrets. Do not force-push. Commit only when the human asks.

---

## 11. Changelog (docs / foundation)

| Date | Change |
| --- | --- |
| 2026-08-19 | Project redefined as Daybook journal app; milestones written |
| 2026-08-19 | Expo upgraded SDK 54 → 57; core deps installed |

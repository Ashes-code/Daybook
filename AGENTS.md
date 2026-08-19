# AGENTS.md — Rules for AI agents on Daybook

This file is the contract for any AI coding agent (OpenCode, Claude, Cursor, etc.) working in this repository.

## 1. Product context (do not forget)

- App name (working): **Daybook**
- Genre: **personal journal / diary**, not a generic notes app
- Spine: **days** (calendar + today)
- Entries: **multiple per day**
- V1: title, body, mood, search, **auth + cloud (Supabase)**
- Learning project: explain important choices briefly when introducing new patterns

Canonical product detail: `PROJECT_DOCUMENTATION.md`  
Folder meanings + progress log: `CODEBASE_MAP.md`  
Human overview: `README.md`

## 2. Expo / React Native rules

1. **Read versioned docs before writing Expo code**  
   https://docs.expo.dev/versions/v57.0.0/
2. Install compatible native packages with:
   ```bash
   npx expo install <package>
   ```
   Do **not** blindly `npm install` Expo modules at random versions.
3. Prefer **Expo Router** file-based routes under `app/`.
4. Prefer **TypeScript** for all new code.
5. After meaningful code changes, run `npm run lint` when practical.
6. Do not assume libraries exist — check `package.json` first.
7. New Architecture is whatever Expo 57 defaults; do not flip native flags casually.

## 3. Architecture conventions

Target layout (create folders when needed, do not invent parallel systems):

```
app/                 # routes only (screens, layouts)
components/          # reusable UI
constants/           # theme, moods, config constants
hooks/               # React hooks
lib/                 # supabase client, utilities
services/            # API / data access functions
stores/              # Zustand stores
types/               # shared TypeScript types
assets/              # images, fonts
supabase/            # SQL migrations, policies (when added)
```

Rules:

- Screens stay thin: UI + hooks; heavy logic in `services/` or `hooks/`.
- One Supabase client module (`lib/supabase.ts` when created).
- Types for `Entry` and auth-related shapes live in `types/`.
- No business secrets in source. Use `EXPO_PUBLIC_*` only for anon/public keys.
- Session tokens: **SecureStore** (or Supabase-recommended RN storage), not plain files.

## 4. Security & privacy

- Never commit `.env`, service role keys, or user diary content fixtures that look real/personal.
- Always plan **RLS** so `user_id = auth.uid()` on entry rows.
- Never log access tokens or passwords.
- No exploits, malware, or attack scripts — ever.

## 5. Coding style

- Match existing style in the repo.
- **No drive-by refactors** outside the requested task.
- **No comments unless** they teach a non-obvious constraint (prefer clear names).
- Do not add markdown docs the user did not ask for (except updating the four project docs when work changes reality).
- Keep UI calm and readable; diary aesthetic over flashy chrome.
- Avoid premature abstraction (no mega design system on day one).

## 6. Git

- Commit **only** when the human explicitly asks.
- Never update git config, skip hooks, or force-push unless explicitly requested.
- Do not commit `node_modules`, `.expo`, or secrets.

## 7. Milestone discipline

Work against milestones in `PROJECT_DOCUMENTATION.md`:

| Order | Focus |
| --- | --- |
| M0 | Foundation, upgrade, docs, baseline structure |
| M1 | Shell UI + mock data |
| M2 | Auth + Supabase client |
| M3 | Cloud CRUD + RLS |
| M4 | Polish |
| M5 | Reliability / release prep |

Do not jump to M3 UI polish while M1 navigation is unfinished unless the human redirects.

When a milestone slice finishes:

1. Update checkboxes in `PROJECT_DOCUMENTATION.md` if applicable  
2. Append a short entry under **What has been done** in `CODEBASE_MAP.md`  
3. Note new folders/files in the map

## 8. Teaching mode (this repo’s human is learning)

When introducing a new concept (Router layouts, RLS, Zustand, etc.):

- 2–5 sentences on **what** and **why** is enough
- Point to the file path with `path:line` when referencing code
- Prefer small diffs the human can read end-to-end

Do not dump giant lectures unprompted. Do not refuse to explain.

## 9. Tooling commands agents should know

```bash
npm install
npx expo start
npx expo install <pkg>
npx expo install --fix
npx expo-doctor
npm run lint
```

## 10. Explicitly out of scope unless asked

- Rewriting the app in another framework
- Adding AI features
- E2E encryption design
- Store submission without human go-ahead
- Renaming the git remote / publishing packages

## 11. Conflict resolution

Priority order when instructions conflict:

1. Human’s latest message  
2. This `AGENTS.md`  
3. `PROJECT_DOCUMENTATION.md`  
4. Existing code patterns  
5. General Expo best practices  

## 12. Definition of done for a task

- Requested behavior works or is clearly blocked with next step  
- No secrets added  
- Lint clean if you touched TS/TSX meaningfully  
- Docs map updated if structure or milestone progress changed  

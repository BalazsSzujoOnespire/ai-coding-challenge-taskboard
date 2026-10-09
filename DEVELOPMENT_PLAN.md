# Development Plan – AI Coding Challenge Taskboard

Source: *AI Coding Challenge – Feladatlap* (sections 1–3, plus the time box, cost measurement and delivery rules from sections 4–8).

**Goal:** a working, simple project-management web app (Kanban taskboard + KPI dashboard) built in **90 minutes** with AI-assisted coding, using as few tokens / as little estimated API cost as possible.

**Stack:** React + TypeScript + Vite · Python FastAPI · SQLite · REST · existing Claude Design design system · Claude Code · fully local (no Docker, auth or external services).

**Scoring:** functionality 40% · token efficiency / cost 30% · design-system fidelity 20% · code quality & simplicity 10%.

---

## Time plan

| Time (min) | Activity | Work packages |
|---|---|---|
| 0–10 | Think through, plan, measurement baseline | WP0 |
| 10–35 | Backend | WP1 |
| 35–65 | Frontend | WP2–WP7 |
| 65–70 | Local run + docs | WP8 |
| 70–90 | Acceptance test, bug fixes, GitHub push, SUMMARY.md | WP9–WP11 |

> The 90 minutes include the GitHub upload and the summary.

---

## Token-efficiency rules (apply throughout)

- Fresh project folder and fresh Claude Code session; **don't use Claude Code for other projects** meanwhile.
- Use **Sonnet** as the default; Haiku for small edits; Opus only for hard bugs. Keep `/effort` low.
- Prompt with concrete data model, endpoints and acceptance criteria (copy from this plan) – one prompt per WP.
- `/clear` between independent WPs (files persist; all sessions still count toward measurement).
- Fix bugs in a targeted way; never regenerate the whole backend/frontend.
- Do trivial edits and terminal commands by hand.
- No Docker, CI/CD, service layers, long architecture docs, or extra features (drag & drop, confirm dialogs, mobile view give no extra points).

---

## WP0 – Preparation & baseline (0–10 min)

Steps:
1. Confirm Claude Code uses the **company Claude Team subscription**, not an API key.
2. Create the project directory (`ai-coding-challenge-taskboard`) and start a **new** Claude Code session there; note the **start time**.
3. Run `npx ccusage@latest claude daily` and `npx ccusage@latest claude session`; save the baseline output.
4. Obtain the **Claude Design design system** (colors, typography, button/input/card styles) and note the tokens (CSS variables) to reuse.
5. Decide final structure and write a short plan (this document is enough):
   ```
   ai-coding-challenge-taskboard/
     backend/   main.py, requirements.txt
     frontend/  Vite React TS app
     README.md, SUMMARY.md, .gitignore
   ```
6. Init git, add `.gitignore` (`node_modules`, `.venv`, `*.db`, `.env`, `__pycache__`, `dist`).

Done when: baseline saved, start time noted, design tokens at hand.

---

## WP1 – Backend: FastAPI + SQLite (spec 2.7)

**Data model – `tasks` table**

| Field | Type | Rule |
|---|---|---|
| `id` | integer PK autoincrement | unique, immutable |
| `title` | text | required, trimmed, non-empty |
| `description` | text | optional (default empty/null) |
| `priority` | text | `Low` / `Medium` / `High`, default `Medium` |
| `status` | text | `To Do` / `In Progress` / `Done`, default `To Do` |

**Endpoints**

| Method | Path | Behavior | Codes |
|---|---|---|---|
| GET | `/tasks` | return all tasks | 200 |
| POST | `/tasks` | create task | **201**, 422 on invalid |
| PATCH | `/tasks/{id}` | partial update of title/description/priority/status | 200, **404**, 422 |
| DELETE | `/tasks/{id}` | delete task | 204, **404** |
| – | `/docs` | automatic FastAPI docs | – |

Steps:
1. Create `backend/requirements.txt` (`fastapi`, `uvicorn`) and a Python venv.
2. Write `backend/main.py` (single file) using stdlib `sqlite3`:
   - On startup create the DB file and `tasks` table if missing (`CREATE TABLE IF NOT EXISTS`).
   - Pydantic models with `Literal` types for priority/status; title validator that **strips whitespace and rejects empty**.
   - Create model defaults: status `To Do`, priority `Medium`.
   - Update model with all-optional fields (PATCH); empty/whitespace title rejected if provided.
3. Implement the four endpoints with the status codes above.
4. Add CORS middleware for the Vite dev origin (`http://localhost:5173`).
5. Smoke-test via `/docs` / curl: create, empty title → 422, invalid enum → 422, patch, delete, 404 on unknown id, restart → data persists.

Done when: all rules in 2.7 verified; DB file is created automatically on first run.

---

## WP2 – Frontend scaffold & design system (spec 2.8, section 3)

Steps:
1. Scaffold with `npm create vite@latest frontend -- --template react-ts`; install deps.
2. Add design-system **tokens as CSS variables** (colors, font family/sizes, radii, spacing) in a global stylesheet; import the design-system font.
3. Define base styles for **buttons, inputs/selects/textarea, cards, badges** per the design system.
4. Configure API base URL via env (`VITE_API_URL`, default `http://localhost:8000`) or Vite proxy.
5. Define shared types: `Task`, `Priority`, `Status`.
6. Create a minimal API client (`api.ts`): `getTasks`, `createTask`, `updateTask`, `deleteTask` (fetch + error handling).

Done when: app boots, styles reflect the design system, API client compiles.

---

## WP3 – Task loading & Kanban board (spec 2.2)

Steps:
1. In `App`, load tasks from `GET /tasks` on mount; keep them in state (single source of truth).
2. Render three columns **To Do / In Progress / Done**; each task appears in exactly one column according to its status.
3. `TaskCard`: show **title** and **priority** badge (distinct color per priority); show description when filled (inline or expandable).
4. Per-column **empty state** message.
5. Show basic loading/error state (backend unreachable).
6. Use only real backend data – no mocks/hardcoded tasks.

Done when: after a page refresh, tasks reload from the backend and sit in the correct columns.

---

## WP4 – Create task (spec 2.1)

Steps:
1. Add "New task" form (inline or modal) with: Title (required), Description (optional), Priority select (Low/Medium/High, default Medium), Status select (To Do/In Progress/Done, default To Do).
2. Client-side validation: block submit when title is empty or whitespace-only (show message); backend validation remains authoritative.
3. Submit via `POST /tasks`; on success add the returned task to state so it appears **immediately** in the right column; reset the form.
4. Show API errors if any.

Done when: acceptance steps 2–4 behave correctly.

---

## WP5 – Edit task (spec 2.3)

Steps:
1. Add an "Edit" action on each card opening a form (reuse the create form component) pre-filled with title, description, priority, status.
2. Same non-empty-title validation.
3. Save via `PATCH /tasks/{id}`; replace the task in state with the response (id unchanged); the card moves column if status changed.
4. Changes persist after refresh (guaranteed by the backend).

Done when: acceptance step 6 works (rename + priority + status in one edit).

---

## WP6 – Quick status change (spec 2.4)

Steps:
1. Add a **status dropdown** (or move buttons) on each card allowing any status → any status.
2. On change call `PATCH /tasks/{id}` with `{status}`; update state from the response so the card appears in the new column.
3. KPIs update automatically (derived from state – see WP7).
4. Drag & drop is **optional and earns no extra points – skip it**.

Done when: acceptance step 5 works.

---

## WP7 – Delete task & KPI dashboard (specs 2.5, 2.6)

Steps:
1. Add a **Delete** button on every card → `DELETE /tasks/{id}`; on success remove from state. Confirmation dialog is not required – skip.
2. Build the dashboard with three KPI cards at the top, **derived from the fetched task list** (no extra endpoint):
   - **Összes feladat / Total** = `tasks.length`
   - **Folyamatban / In Progress** = count of `status === "In Progress"`
   - **Elkészült / Done** = count of `status === "Done"`
3. Because KPIs derive from state they refresh on create, edit/status change and delete, and are correct after refresh.

Done when: acceptance steps 9–10 and all KPI values behave correctly.

---

## WP8 – Local run & documentation (spec 2.9)

Steps:
1. Write `README.md` with:
   - Prerequisites (Python version, Node version).
   - Backend: create venv, `pip install -r requirements.txt`, `uvicorn main:app --reload --port 8000`.
   - Frontend: `npm install`, `npm run dev`.
   - Environment settings (`VITE_API_URL`, DB file location/name) and URLs (app, `/docs`).
   - Note: DB and table are created automatically, no manual DB setup.
2. Verify a clean-clone install works using only the README commands.
3. Ensure `requirements.txt` and `package.json` are complete and committed.

Done when: someone can run both parts from the README alone.

---

## WP9 – Final acceptance test (spec 2.10)

Run **through the UI only** (no manual DB edits, no direct API calls to substitute missing UI features), starting with an empty database:

| # | Step | Expected |
|---|---|---|
| 1 | Start app with empty DB | 3 columns, all KPIs 0 |
| 2 | Create task with empty title | Save blocked |
| 3 | Create "Backend API", High, default status | To Do; total 1 |
| 4 | Create "Frontend UI", Medium | To Do; total 2 |
| 5 | Set "Backend API" → In Progress | In Progress column; in-progress 1 |
| 6 | Edit "Frontend UI" → title "Frontend kész", Low, Done | Changes shown; done 1 |
| 7 | Refresh browser | Both tasks show saved values |
| 8 | Restart backend (refresh if needed) | Data persists |
| 9 | Delete "Backend API" | Total 1; in-progress 0 |
| 10 | Refresh again | Only "Frontend kész" in Done, Low priority |

Fix failures with **targeted** prompts/edits; record the pass count (needs 10/10).

---

## WP10 – AI usage measurement & SUMMARY.md (spec sections 5, 7)

Steps:
1. Re-run `npx ccusage@latest claude daily` and `... session`; save output/screenshot (exclude other projects' data).
2. Sum **all sessions** belonging to this task (planning, dev, bug fixing): input, output, cache read, cache creation, total tokens.
3. Record estimated API cost (USD) and actual extra cost (USD; 0 if everything fit in the Team subscription).
4. Note any Claude Design generation separately (may not appear in ccusage).
5. Write `SUMMARY.md` (**max. 1 page**):
   - Implemented features and gaps; acceptance tests passed (x/10).
   - Development time (minutes); models used and for which tasks.
   - Input / output / cache read / cache creation / total tokens.
   - Estimated API cost and actual extra cost (USD).
   - Strategy, token-saving methods, lessons learned.
   - ccusage screenshot or output.

---

## WP11 – GitHub delivery (section 8)

Steps:
1. Check the repo contents: full frontend + backend source, `README.md`, `SUMMARY.md`, dependency files, shareable design-system elements.
2. Ensure **no** `node_modules`, Python venv, local SQLite DB, API keys or sensitive data are committed.
3. Create a **public** repo named `ai-coding-challenge-taskboard` in the personal GitHub account; push.
4. Add the organizer as **Collaborator** (Settings → Collaborators, Write access).
5. Send the repository link.

---

## Definition of done

- All 10 acceptance tests pass via the UI.
- Backend: 4 endpoints with correct codes (201 / 404 / validation errors), auto-created SQLite DB, `/docs` available.
- Frontend: Kanban board, create/edit/status change/delete, KPI cards, empty states, design-system styling.
- README, SUMMARY.md, dependency files and clean public repo delivered within the 90-minute limit.

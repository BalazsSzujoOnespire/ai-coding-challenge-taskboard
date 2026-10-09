# SUMMARY

## Result
- **Implemented:** FastAPI + SQLite backend (`GET/POST /tasks`, `PATCH/DELETE /tasks/{id}`, auto-created DB, `/docs`); React + TypeScript + Vite frontend with a 3-column Kanban board (To Do / In Progress / Done), create / edit / status change / delete, KPI cards, empty-column state, and styling from the Claude Design tokens (`frontend/src/styles/tokens.css`).
- **Gaps:** none known, but no automated tests, no drag & drop and no delete confirmation (all out of scope).
- **Acceptance tests (UI, 10 scenarios in `DEVELOPMENT_PLAN.md`):** **not recorded – x/10 to be filled in after the manual run (WP9).**
- **Claude Design:** the design-system generation was done outside Claude Code and does not appear in ccusage (usage not measured).

## Time and models
- Development time: **~35 min** of Claude Code activity (13:34–14:08 local, 2026-10-09), from the first to the last session of this project. Total wall-clock time incl. manual steps: *to be filled in*.
- Models: **Sonnet 5.5 only** (planning, backend, frontend, docs). No Opus or Haiku in this project.

## Tokens (ccusage, this project only, 12 sessions)
| Input | Output | Cache read | Cache creation | **Total** |
|---:|---:|---:|---:|---:|
| 182 | 41,724 | 4,442,654 | 290,930 | **4,775,490** |

- **Estimated API cost: ~$2.03.** **Actual extra cost: $0** (everything ran inside the Team subscription; to be confirmed against the account's usage page).
- Totals include the session that wrote this file. Sessions of other projects (`ai-page`, `ai-landing-page`) are excluded.

## Strategy, token saving, lessons
- Plan first (`DEVELOPMENT_PLAN.md`): fixed data model, endpoints and acceptance criteria, so each prompt was one concrete work package.
- Sonnet as the default model, `/clear` between independent work packages, and a small file layout (`main.py`, four components) so each session read little context.
- Targeted edits instead of regenerating files; trivial edits and commands done by hand.
- No Docker, auth, service layers or extra features.
- Lesson: ~93% of the tokens are cache reads, so the number of sessions and the context carried into each matter more than output length. Many short, focused sessions kept the cost low.

## ccusage output (`npx ccusage@latest claude session`, filtered to `ai-coding-test`)
| Session (first 8 chars) | Model | Total tokens | Cost |
|---|---|---:|---:|
| ff9c1c06 | sonnet-5-5 | 573,417 | $0.29 |
| bf5307db | sonnet-5-5 | 450,744 | $0.23 |
| b0c21531 | sonnet-5-5 | 609,014 | $0.20 |
| 1798d537 | sonnet-5-5 | 416,549 | $0.19 |
| ae0e1893 | sonnet-5-5 | 464,504 | $0.18 |
| 282241e1 | sonnet-5-5 | 351,353 | $0.16 |
| 304b0868 | sonnet-5-5 | 500,973 | $0.16 |
| 727b61d6 | sonnet-5-5 | 253,616 | $0.15 |
| 58675fdf | sonnet-5-5 | 381,692 | $0.14 |
| 705a3faf | sonnet-5-5 | 298,609 | $0.14 |
| 82a0c402 | sonnet-5-5 | 343,833 | $0.14 |
| 7649f692 | sonnet-5-5 | 131,186 | $0.06 |
| **Total** | | **4,775,490** | **$2.03** |

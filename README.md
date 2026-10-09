# AI Coding Challenge Taskboard

A small Kanban-style task board: a FastAPI + SQLite backend and a React (Vite, TypeScript) frontend.
Tasks live in three columns (To Do / In Progress / Done) and a KPI dashboard shows the totals.

## Prerequisites

- Python 3.10+ (developed with 3.13)
- Node.js 20+ and npm

## Run the backend

From the repository root:

```bash
cd backend
python -m venv .venv
# Windows (PowerShell):  .venv\Scripts\Activate.ps1
# Windows (cmd):         .venv\Scripts\activate.bat
# macOS / Linux:         source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API is now at <http://localhost:8000>, with interactive docs at <http://localhost:8000/docs>.

## Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the app at <http://localhost:5173>.

## Configuration

| Setting | Where | Default |
|---|---|---|
| `VITE_API_URL` | `frontend/.env` (copy from `frontend/.env.example`) | `http://localhost:8000` |
| Database file | `backend/taskboard.db` (set by `DB_PATH` in `backend/main.py`) | created next to `main.py` |

Only set `VITE_API_URL` if the backend runs on a different host or port; restart `npm run dev` after changing it.
The backend allows CORS from `http://localhost:5173` and `http://127.0.0.1:5173`.

## Database

No manual database setup is needed. On startup the backend creates the SQLite file and the `tasks` table
if they don't exist. To start from an empty board, stop the backend and delete `backend/taskboard.db`.

## API

| Method | Path | Purpose |
|---|---|---|
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Create a task (`title` required) |
| PATCH | `/tasks/{id}` | Update any of title, description, priority, status |
| DELETE | `/tasks/{id}` | Delete a task |

## Other frontend commands

```bash
npm run build   # type-check and build for production
npm run lint    # oxlint
```

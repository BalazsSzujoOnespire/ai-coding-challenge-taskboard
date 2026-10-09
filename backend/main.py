import sqlite3
from contextlib import asynccontextmanager, closing
from pathlib import Path
from typing import Literal, Optional

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

DB_PATH = Path(__file__).parent / "taskboard.db"

Priority = Literal["Low", "Medium", "High"]
Status = Literal["To Do", "In Progress", "Done"]


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@asynccontextmanager
async def lifespan(_: FastAPI):
    with closing(connect()) as conn, conn:
        conn.execute(
            """CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL DEFAULT '',
                priority TEXT NOT NULL DEFAULT 'Medium',
                status TEXT NOT NULL DEFAULT 'To Do'
            )"""
        )
    yield


app = FastAPI(title="Taskboard API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def strip_title(v: Optional[str]) -> Optional[str]:
    if v is None:
        return v
    v = v.strip()
    if not v:
        raise ValueError("title must not be empty")
    return v


class TaskCreate(BaseModel):
    title: str
    description: str = ""
    priority: Priority = "Medium"
    status: Status = "To Do"

    _strip_title = field_validator("title")(strip_title)


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[Priority] = None
    status: Optional[Status] = None

    _strip_title = field_validator("title")(strip_title)


@app.get("/tasks")
def list_tasks():
    with closing(connect()) as conn:
        return [dict(r) for r in conn.execute("SELECT * FROM tasks ORDER BY id")]


@app.post("/tasks", status_code=201)
def create_task(task: TaskCreate):
    with closing(connect()) as conn, conn:
        cur = conn.execute(
            "INSERT INTO tasks (title, description, priority, status) VALUES (?, ?, ?, ?)",
            (task.title, task.description, task.priority, task.status),
        )
        return dict(conn.execute("SELECT * FROM tasks WHERE id = ?", (cur.lastrowid,)).fetchone())


@app.patch("/tasks/{task_id}")
def update_task(task_id: int, patch: TaskUpdate):
    changes = patch.model_dump(exclude_unset=True, exclude_none=True)
    with closing(connect()) as conn, conn:
        if changes:
            sets = ", ".join(f"{k} = ?" for k in changes)
            conn.execute(f"UPDATE tasks SET {sets} WHERE id = ?", (*changes.values(), task_id))
        row = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
        if row is None:
            raise HTTPException(404, "Task not found")
        return dict(row)


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    with closing(connect()) as conn, conn:
        if conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,)).rowcount == 0:
            raise HTTPException(404, "Task not found")
    return Response(status_code=204)

import { useState } from 'react'
import { STATUSES, type Status, type Task, type TaskPatch } from '../types'
import TaskForm from './TaskForm'

interface Props {
  task: Task
  onUpdate: (id: number, patch: TaskPatch) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export default function TaskCard({ task, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (editing) {
    return (
      <TaskForm
        initial={{ title: task.title, description: task.description ?? '', priority: task.priority, status: task.status }}
        submitLabel="Save"
        onSubmit={async (input) => {
          await onUpdate(task.id, input)
          setEditing(false)
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <article className="card task-card">
      <div className="task-card-head">
        <h3>{task.title}</h3>
        <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
      </div>
      {task.description && <p className="task-desc">{task.description}</p>}
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      <div className="task-form-actions">
        <select
          className="select select-sm"
          aria-label="Change status"
          value={task.status}
          onChange={(e) => {
            setError(null)
            onUpdate(task.id, { status: e.target.value as Status }).catch((err: Error) => setError(err.message))
          }}
        >
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit</button>
        <button
          className="btn btn-danger"
          onClick={() => {
            setError(null)
            onDelete(task.id).catch((err: Error) => setError(err.message))
          }}
        >
          Delete
        </button>
      </div>
    </article>
  )
}

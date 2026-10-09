import { useState, type FormEvent } from 'react'
import { PRIORITIES, STATUSES, type Priority, type Status, type TaskInput } from '../types'

interface Props {
  initial?: Required<TaskInput>
  submitLabel: string
  onSubmit: (task: Required<TaskInput>) => Promise<void>
  onCancel?: () => void
}

const EMPTY: Required<TaskInput> = { title: '', description: '', priority: 'Medium', status: 'To Do' }

export default function TaskForm({ initial = EMPTY, submitLabel, onSubmit, onCancel }: Props) {
  const [values, setValues] = useState(initial)
  const [titleError, setTitleError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const title = values.title.trim()
    if (!title) {
      setTitleError('Title is required.')
      return
    }
    setTitleError(null)
    setApiError(null)
    setSaving(true)
    try {
      await onSubmit({ ...values, title })
      setValues(initial)
    } catch (err) {
      setApiError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="card task-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="label" htmlFor="task-title">Title</label>
        <input
          id="task-title"
          className="input"
          value={values.title}
          aria-invalid={titleError ? true : undefined}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />
        {titleError && <span className="field-error" role="alert">{titleError}</span>}
      </div>
      <div className="field">
        <label className="label" htmlFor="task-desc">Description</label>
        <textarea
          id="task-desc"
          className="textarea"
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
        />
      </div>
      <div className="task-form-row">
        <div className="field">
          <label className="label" htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            className="select"
            value={values.priority}
            onChange={(e) => setValues({ ...values, priority: e.target.value as Priority })}
          >
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="label" htmlFor="task-status">Status</label>
          <select
            id="task-status"
            className="select"
            value={values.status}
            onChange={(e) => setValues({ ...values, status: e.target.value as Status })}
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      {apiError && <div className="alert alert-error" role="alert">{apiError}</div>}
      <div className="task-form-actions">
        {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
        <button type="submit" className="btn btn-primary" disabled={saving}>{submitLabel}</button>
      </div>
    </form>
  )
}

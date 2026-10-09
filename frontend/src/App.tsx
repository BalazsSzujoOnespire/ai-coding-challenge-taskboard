import { useEffect, useState } from 'react'
import { createTask, deleteTask, getTasks, updateTask } from './api'
import Board from './components/Board'
import KpiCards from './components/KpiCards'
import TaskForm from './components/TaskForm'
import type { Task } from './types'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: 'var(--sp-8) var(--sp-6)' }}>
      <h1>Taskboard</h1>
      <KpiCards tasks={tasks} />
      {showForm ? (
        <TaskForm
          submitLabel="Create task"
          onSubmit={async (input) => {
            const created = await createTask(input)
            setTasks((prev) => [...prev, created])
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>New task</button>
      )}
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      {loading ? <p>Loading tasks…</p> : !error && (
        <Board
          tasks={tasks}
          onUpdate={async (id, patch) => {
            const updated = await updateTask(id, patch)
            setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
          }}
          onDelete={async (id) => {
            await deleteTask(id)
            setTasks((prev) => prev.filter((t) => t.id !== id))
          }}
        />
      )}
    </main>
  )
}

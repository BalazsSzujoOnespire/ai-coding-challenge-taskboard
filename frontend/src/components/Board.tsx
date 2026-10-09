import { STATUSES, type Task, type TaskPatch } from '../types'
import TaskCard from './TaskCard'

interface Props {
  tasks: Task[]
  onUpdate: (id: number, patch: TaskPatch) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export default function Board({ tasks, onUpdate, onDelete }: Props) {
  return (
    <div className="board">
      {STATUSES.map((status) => {
        const column = tasks.filter((t) => t.status === status)
        return (
          <section key={status} className="column">
            <h2 className="column-title">
              {status} <span className="badge">{column.length}</span>
            </h2>
            {column.length === 0 ? (
              <p className="empty">No tasks here yet.</p>
            ) : (
              column.map((t) => <TaskCard key={t.id} task={t} onUpdate={onUpdate} onDelete={onDelete} />)
            )}
          </section>
        )
      })}
    </div>
  )
}

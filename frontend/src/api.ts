import type { Task, TaskInput, TaskPatch } from './types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
  } catch {
    throw new Error('Cannot reach the backend. Is it running?')
  }
  if (!res.ok) {
    let detail = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (typeof body.detail === 'string') detail = body.detail
      else if (Array.isArray(body.detail)) detail = body.detail.map((e: { msg: string }) => e.msg).join('; ')
    } catch {
      // non-JSON error body: keep the generic message
    }
    throw new Error(detail)
  }
  return res.status === 204 ? (undefined as T) : res.json()
}

export const getTasks = () => request<Task[]>('/tasks')

export const createTask = (task: TaskInput) =>
  request<Task>('/tasks', { method: 'POST', body: JSON.stringify(task) })

export const updateTask = (id: number, patch: TaskPatch) =>
  request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })

export const deleteTask = (id: number) => request<void>(`/tasks/${id}`, { method: 'DELETE' })

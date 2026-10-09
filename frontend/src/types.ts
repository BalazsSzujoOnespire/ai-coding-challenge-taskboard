export const PRIORITIES = ['Low', 'Medium', 'High'] as const
export const STATUSES = ['To Do', 'In Progress', 'Done'] as const

export type Priority = (typeof PRIORITIES)[number]
export type Status = (typeof STATUSES)[number]

export interface Task {
  id: number
  title: string
  description: string
  priority: Priority
  status: Status
}

export type TaskInput = Pick<Task, 'title'> & Partial<Omit<Task, 'id' | 'title'>>
export type TaskPatch = Partial<Omit<Task, 'id'>>

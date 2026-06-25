import type { GenerationTask, GenType, TaskStatus } from '@/entities/generation-task'

export type QueueStatusFilter = 'all' | TaskStatus
export type QueueTypeFilter = 'all' | GenType
export type QueueSort = 'newest' | 'oldest' | 'progress'

export interface QueueFilters {
  status: QueueStatusFilter
  type: QueueTypeFilter
  sort: QueueSort
  search: string
}

export function selectQueueStats(tasks: GenerationTask[]) {
  return {
    queued: tasks.filter((task) => task.status === 'queued').length,
    running: tasks.filter((task) => task.status === 'running').length,
    done: tasks.filter((task) => task.status === 'done').length,
    failed: tasks.filter((task) => task.status === 'failed').length,
  }
}

export function selectActiveTasks(tasks: GenerationTask[]) {
  return tasks
    .filter((task) => task.status === 'running' || task.status === 'queued')
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'running' ? -1 : 1
      return a.createdAt - b.createdAt
    })
}

export function selectAverageProgress(tasks: GenerationTask[]) {
  const active = selectActiveTasks(tasks)
  if (active.length === 0) return 0

  const total = active.reduce((sum, task) => sum + task.progress, 0)
  return Math.round(total / active.length)
}

export function getQueuePosition(tasks: GenerationTask[], id: string) {
  const queued = tasks.filter((task) => task.status === 'queued').sort((a, b) => a.createdAt - b.createdAt)
  const index = queued.findIndex((task) => task.id === id)
  return index === -1 ? null : index + 1
}

export function selectFilteredTasks(tasks: GenerationTask[], filters: QueueFilters) {
  const search = filters.search.trim().toLowerCase()

  return tasks
    .filter((task) => filters.status === 'all' || task.status === filters.status)
    .filter((task) => filters.type === 'all' || task.type === filters.type)
    .filter((task) => !search || task.prompt.toLowerCase().includes(search) || task.model.toLowerCase().includes(search))
    .sort((a, b) => {
      if (filters.sort === 'oldest') return a.createdAt - b.createdAt
      if (filters.sort === 'progress') return b.progress - a.progress
      return b.createdAt - a.createdAt
    })
}

import type { GenerationTask, GenType, TaskStatus } from '@/entities/generation-task'

export const MAX_CONCURRENT = 2

const TYPE_DURATION: Record<GenType, number> = {
  text: 18,
  image: 42,
  audio: 92,
  video: 140,
}

const FAILURE_MESSAGES = ['Недостаточно кредитов', 'Превышено время ожидания', 'Модель временно недоступна']

function getNextFailure(task: GenerationTask) {
  if (task.failureAt && task.failureReason) {
    return {
      failureAt: task.failureAt,
      failureReason: task.failureReason,
    }
  }

  const shouldFail = Math.random() < 0.15
  if (!shouldFail) return {}

  const min = Math.max(task.progress + 8, 22)
  const max = 91
  const failureAt = Math.min(max, min + Math.floor(Math.random() * (max - min + 1)))
  const failureReason = FAILURE_MESSAGES[Math.floor(Math.random() * FAILURE_MESSAGES.length)]
  return { failureAt, failureReason }
}

function runQueuedTasks(tasks: GenerationTask[], now: number): GenerationTask[] {
  const runningCount = tasks.filter((task) => task.status === 'running').length
  const freeSlots = Math.max(0, MAX_CONCURRENT - runningCount)
  if (freeSlots === 0) return tasks

  const queuedIds = tasks
    .filter((task) => task.status === 'queued')
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(0, freeSlots)
    .map((task) => task.id)

  if (queuedIds.length === 0) return tasks

  return tasks.map((task) => {
    if (!queuedIds.includes(task.id)) return task

    const failure = getNextFailure(task)
    return {
      ...task,
      ...failure,
      status: 'running' satisfies TaskStatus,
      updatedAt: now,
      durationSec: TYPE_DURATION[task.type],
      etaSec: Math.ceil(((100 - task.progress) / 100) * TYPE_DURATION[task.type]),
    }
  })
}

export function advanceQueue(tasks: GenerationTask[], now = Date.now()): GenerationTask[] {
  const withProgress: GenerationTask[] = tasks.map((task) => {
    if (task.status !== 'running') return task

    const duration = task.durationSec ?? TYPE_DURATION[task.type]
    const baseStep = task.type === 'text' ? 10 : task.type === 'image' ? 6 : task.type === 'audio' ? 4 : 3
    const progress = Math.min(100, task.progress + baseStep + Math.floor(Math.random() * 4))

    if (task.failureAt && progress >= task.failureAt) {
      return {
        ...task,
        status: 'failed' satisfies TaskStatus,
        progress,
        updatedAt: now,
        error: task.failureReason ?? FAILURE_MESSAGES[0],
        etaSec: undefined,
      }
    }

    if (progress >= 100) {
      return {
        ...task,
        status: 'done' satisfies TaskStatus,
        progress: 100,
        updatedAt: now,
        completedAt: now,
        etaSec: undefined,
      }
    }

    return {
      ...task,
      progress,
      updatedAt: now,
      durationSec: duration,
      etaSec: Math.max(1, Math.ceil(((100 - progress) / 100) * duration)),
    }
  })

  return runQueuedTasks(withProgress, now)
}

export function normalizeRestoredTasks(tasks: GenerationTask[]): GenerationTask[] {
  return tasks.map((task) => {
    if (task.status !== 'running') return task

    return {
      ...task,
      status: 'queued' satisfies TaskStatus,
      updatedAt: Date.now(),
      etaSec: undefined,
    }
  })
}

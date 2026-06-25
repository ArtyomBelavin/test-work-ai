import { createContext, useContext } from 'react'
import type { GenerationTask } from '@/entities/generation-task'
import type { QueueState } from './queueReducer'

export interface QueueContextValue extends QueueState {
  retryLoad: () => void
  cancelTask: (id: string) => void
  retryTask: (id: string) => void
  deleteTask: (id: string) => void
  clearDone: () => void
}

export const QueueContext = createContext<QueueContextValue | null>(null)

export function useQueueContext() {
  const context = useContext(QueueContext)
  if (!context) throw new Error('useQueue must be used inside QueueProvider')
  return context
}

export function serializeTasks(tasks: GenerationTask[]) {
  return JSON.stringify(tasks)
}

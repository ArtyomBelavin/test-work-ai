import { generationTaskSeed, type GenerationTask, type TaskStatus } from '@/entities/generation-task'
import { advanceQueue, normalizeRestoredTasks } from './queueEngine'

export interface QueueState {
  tasks: GenerationTask[]
  loading: boolean
  error: string | null
  initialized: boolean
}

export type QueueAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; tasks: GenerationTask[] }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'TICK'; now: number }
  | { type: 'CANCEL_TASK'; id: string; now: number }
  | { type: 'RETRY_TASK'; id: string; now: number }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'CLEAR_DONE' }

export const initialQueueState: QueueState = {
  tasks: [],
  loading: true,
  error: null,
  initialized: false,
}

export function createInitialTasks(storedTasks?: GenerationTask[] | null): GenerationTask[] {
  return normalizeRestoredTasks(storedTasks?.length ? storedTasks : generationTaskSeed)
}

function patchTaskStatus(task: GenerationTask, status: TaskStatus, now: number): GenerationTask {
  return {
    ...task,
    status,
    updatedAt: now,
    etaSec: undefined,
  }
}

export function queueReducer(state: QueueState, action: QueueAction): QueueState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null }
    case 'LOAD_SUCCESS':
      return {
        tasks: advanceQueue(action.tasks, Date.now()),
        loading: false,
        error: null,
        initialized: true,
      }
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error, initialized: false }
    case 'TICK':
      if (state.loading || state.error) return state
      return { ...state, tasks: advanceQueue(state.tasks, action.now) }
    case 'CANCEL_TASK':
      return {
        ...state,
        tasks: advanceQueue(
          state.tasks.map((task) =>
            task.id === action.id && ['queued', 'running'].includes(task.status) ? patchTaskStatus(task, 'canceled', action.now) : task,
          ),
          action.now,
        ),
      }
    case 'RETRY_TASK':
      return {
        ...state,
        tasks: advanceQueue(
          state.tasks.map(
            (task): GenerationTask =>
              task.id === action.id && ['failed', 'canceled'].includes(task.status)
                ? {
                    ...task,
                    status: 'queued' satisfies TaskStatus,
                    progress: 0,
                    error: undefined,
                    failureAt: undefined,
                    failureReason: undefined,
                    updatedAt: action.now,
                    createdAt: action.now,
                  }
                : task,
          ),
          action.now,
        ),
      }
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: advanceQueue(
          state.tasks.filter((task) => task.id !== action.id),
          Date.now(),
        ),
      }
    case 'CLEAR_DONE':
      return { ...state, tasks: state.tasks.filter((task) => task.status !== 'done') }
    default:
      return state
  }
}

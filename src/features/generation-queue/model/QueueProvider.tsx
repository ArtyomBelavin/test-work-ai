import { useCallback, useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { GenerationTask } from '@/entities/generation-task'
import { createInitialTasks, initialQueueState, queueReducer, type QueueState } from './queueReducer'
import { QueueContext, serializeTasks, type QueueContextValue } from './queueContext'

const STORAGE_KEY = 'era2:generation-queue'

function readStoredTasks() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as GenerationTask[]
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function shouldFailInitialLoad() {
  const hasTried = window.sessionStorage.getItem('era2:generation-queue:init-tried')
  window.sessionStorage.setItem('era2:generation-queue:init-tried', 'true')
  return !hasTried && Math.random() < 0.08
}

export function QueueProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(queueReducer, initialQueueState)

  const loadQueue = useCallback(() => {
    dispatch({ type: 'LOAD_START' })

    window.setTimeout(() => {
      if (shouldFailInitialLoad()) {
        dispatch({ type: 'LOAD_ERROR', error: 'Не удалось загрузить очередь генераций' })
        return
      }

      dispatch({ type: 'LOAD_SUCCESS', tasks: createInitialTasks(readStoredTasks()) })
    }, 600)
  }, [])

  useEffect(() => {
    loadQueue()
  }, [loadQueue])

  useEffect(() => {
    if (!state.initialized || state.loading || state.error) return undefined

    const intervalId = window.setInterval(() => {
      dispatch({ type: 'TICK', now: Date.now() })
    }, 520)

    return () => window.clearInterval(intervalId)
  }, [state.error, state.initialized, state.loading])

  useEffect(() => {
    if (!state.initialized || state.loading || state.error) return
    window.localStorage.setItem(STORAGE_KEY, serializeTasks(state.tasks))
  }, [state.error, state.initialized, state.loading, state.tasks])

  const value = useMemo<QueueContextValue>(
    () => ({
      ...state,
      retryLoad: loadQueue,
      cancelTask: (id) => dispatch({ type: 'CANCEL_TASK', id, now: Date.now() }),
      retryTask: (id) => dispatch({ type: 'RETRY_TASK', id, now: Date.now() }),
      deleteTask: (id) => dispatch({ type: 'DELETE_TASK', id }),
      clearDone: () => dispatch({ type: 'CLEAR_DONE' }),
    }),
    [loadQueue, state],
  )

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>
}

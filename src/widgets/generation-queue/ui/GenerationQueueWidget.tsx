import { useCallback, useMemo, useState } from 'react'
import { QueueStats, QueueToolbar, TaskCard, TaskRow, EmptyState, ErrorState, LoadingState, useQueue } from '@/features/generation-queue'
import { getQueuePosition, selectFilteredTasks, selectQueueStats, type QueueFilters } from '@/features/generation-queue'

const initialFilters: QueueFilters = {
  status: 'all',
  type: 'all',
  sort: 'newest',
  search: '',
}

export function GenerationQueueWidget() {
  const { tasks, loading, error, retryLoad, cancelTask, retryTask, deleteTask, clearDone } = useQueue()
  const [filters, setFilters] = useState<QueueFilters>(initialFilters)
  const stats = useMemo(() => selectQueueStats(tasks), [tasks])
  const filteredTasks = useMemo(() => selectFilteredTasks(tasks, filters), [filters, tasks])
  const handleFiltersChange = useCallback((nextFilters: QueueFilters) => setFilters(nextFilters), [])

  return (
    <section className="min-h-[calc(100vh-64px)] bg-[var(--c-bg)] px-4 py-10 text-[var(--c-fg)] md:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-[26px] font-bold tracking-normal md:text-3xl">Очередь генераций</h1>
            <p className="mt-2 text-lg text-[var(--c-fg-mute)]">Все ваши задачи в реальном времени</p>
          </div>
          <button
            type="button"
            onClick={clearDone}
            className="h-11 w-fit rounded-full border border-[var(--c-line)] px-5 text-sm font-semibold text-[var(--c-fg-dim)] transition hover:border-[var(--c-accent-2)]/70 hover:text-[var(--c-fg)]"
          >
            Очистить готовые
          </button>
        </div>

        <div className="space-y-7">
          <QueueStats stats={stats} />
          <QueueToolbar filters={filters} onFiltersChange={handleFiltersChange} />

          {loading && <LoadingState />}
          {!loading && error && <ErrorState message={error} onRetry={retryLoad} />}
          {!loading && !error && filteredTasks.length === 0 && <EmptyState hasTasks={tasks.length > 0} />}
          {!loading && !error && filteredTasks.length > 0 && (
            <div className="space-y-3">
              <div className="hidden space-y-3 md:block">
                {filteredTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    queuePosition={getQueuePosition(tasks, task.id)}
                    onCancel={cancelTask}
                    onRetry={retryTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
              <div className="space-y-3 md:hidden">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    queuePosition={getQueuePosition(tasks, task.id)}
                    onCancel={cancelTask}
                    onRetry={retryTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

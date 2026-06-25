import { ChevronDown, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { GenType } from '@/entities/generation-task'
import { cn } from '@/shared/lib/utils'
import type { QueueFilters, QueueSort, QueueStatusFilter, QueueTypeFilter } from '../model/selectors'

interface QueueToolbarProps {
  filters: QueueFilters
  onFiltersChange: (filters: QueueFilters) => void
}

const statuses: Array<{ value: QueueStatusFilter; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'queued', label: 'В очереди' },
  { value: 'running', label: 'Идёт' },
  { value: 'done', label: 'Готово' },
  { value: 'failed', label: 'Ошибка' },
]

const types: Array<{ value: QueueTypeFilter; label: string }> = [
  { value: 'all', label: 'Все типы' },
  { value: 'text', label: 'Текст' },
  { value: 'image', label: 'Изображения' },
  { value: 'video', label: 'Видео' },
  { value: 'audio', label: 'Аудио' },
]

const sorts: Array<{ value: QueueSort; label: string }> = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'progress', label: 'По прогрессу' },
]

function Pill({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-10 shrink-0 rounded-full border border-[var(--c-line)] px-4 text-sm font-semibold text-[var(--c-fg-dim)] transition hover:border-[var(--c-accent-2)]/60 hover:text-[var(--c-fg)]',
        active && 'border-[var(--c-accent-2)] bg-[var(--c-accent)] text-[var(--primary-foreground)] hover:text-[var(--primary-foreground)]',
      )}
    >
      {children}
    </button>
  )
}

export function QueueToolbar({ filters, onFiltersChange }: QueueToolbarProps) {
  const [search, setSearch] = useState(filters.search)
  const [sortOpen, setSortOpen] = useState(false)

  useEffect(() => {
    if (search === filters.search) return undefined

    const timeoutId = window.setTimeout(() => {
      onFiltersChange({ ...filters, search })
    }, 250)

    return () => window.clearTimeout(timeoutId)
  }, [filters, onFiltersChange, search])

  const setStatus = (status: QueueStatusFilter) => onFiltersChange({ ...filters, status })
  const setType = (type: GenType | 'all') => onFiltersChange({ ...filters, type })
  const setSort = (sort: QueueSort) => onFiltersChange({ ...filters, sort })

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {statuses.map((status) => (
          <Pill key={status.value} active={filters.status === status.value} onClick={() => setStatus(status.value)}>
            {status.label}
          </Pill>
        ))}
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {types.map((type) => (
            <Pill key={type.value} active={filters.type === type.value} onClick={() => setType(type.value)}>
              {type.label}
            </Pill>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative min-w-0 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--c-fg-low)]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по задачам..."
              className="h-10 w-full rounded-full border border-[var(--c-line)] bg-[var(--c-bg-1)] pl-9 pr-4 text-sm text-[var(--c-fg)] outline-none transition placeholder:text-[var(--c-fg-low)] focus:border-[var(--c-accent-2)]"
            />
          </label>
          <div
            className="relative w-fit"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setSortOpen(false)
              }
            }}
          >
            <button
              type="button"
              onClick={() => setSortOpen((open) => !open)}
              className={cn(
                'inline-flex h-10 min-w-[148px] items-center justify-between gap-2 rounded-full border border-[var(--c-line)] bg-[var(--c-bg-1)] px-4 text-sm font-semibold text-[var(--c-fg-dim)] transition hover:border-[var(--c-accent-2)]/60 hover:text-[var(--c-fg)]',
                sortOpen && 'border-[var(--c-accent-2)] text-[var(--c-accent-2)]',
              )}
            >
              <span>{sorts.find((sort) => sort.value === filters.sort)?.label}</span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 shrink-0 text-[var(--c-fg-mute)] transition-transform duration-150',
                  sortOpen && 'rotate-180 text-[var(--c-accent-2)]',
                )}
              />
            </button>

            {sortOpen && (
              <div className="absolute right-0 top-full z-[70] mt-1.5 w-[180px] overflow-hidden rounded-[12px] border border-[var(--c-line)] bg-[var(--c-bg-1)] p-1 shadow-[var(--shadow-dropdown)]">
                {sorts.map((sort) => {
                  const active = filters.sort === sort.value
                  return (
                    <button
                      key={sort.value}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setSort(sort.value)
                        setSortOpen(false)
                      }}
                      className={cn(
                        'flex h-9 w-full items-center justify-between rounded-[8px] px-3 text-left text-sm font-medium text-[var(--c-fg-dim)] transition hover:bg-[var(--c-accent)]/10 hover:text-[var(--c-fg)]',
                        active && 'text-[var(--c-accent-2)]',
                      )}
                    >
                      <span>{sort.label}</span>
                      {active && <span className="text-[var(--c-accent-2)]">✓</span>}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

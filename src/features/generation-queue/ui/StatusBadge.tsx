import type { TaskStatus } from '@/entities/generation-task'
import { cn } from '@/shared/lib/utils'

const statusMap: Record<TaskStatus, { label: string; className: string }> = {
  queued: { label: 'В очереди', className: 'bg-[color-mix(in_oklab,var(--c-fg)_3%,transparent)] text-[var(--c-fg-mute)]' },
  running: { label: 'Идёт', className: 'bg-[var(--c-accent-soft)] text-[var(--c-accent-2)]' },
  done: { label: 'Готово', className: 'bg-emerald-500/15 text-emerald-300' },
  failed: { label: 'Ошибка', className: 'bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]' },
  canceled: { label: 'Отменено', className: 'bg-[color-mix(in_oklab,var(--c-fg)_3%,transparent)] text-[var(--c-fg-low)]' },
}

export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  const item = statusMap[status]
  return <span className={cn('inline-flex h-8 items-center rounded-lg px-3 text-sm font-semibold', item.className, className)}>{item.label}</span>
}

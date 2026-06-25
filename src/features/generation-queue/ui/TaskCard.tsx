import { FileText, Image, MessageCircle, Music, Play } from 'lucide-react'
import type { GenerationTask } from '@/entities/generation-task'
import { cn } from '@/shared/lib/utils'
import { formatCredits, formatDuration, formatEta } from '../lib/formatEta'
import { ProgressBar } from './ProgressBar'
import { StatusBadge } from './StatusBadge'
import { TaskActions } from './TaskActions'

interface TaskCardProps {
  task: GenerationTask
  queuePosition: number | null
  onCancel: (id: string) => void
  onRetry: (id: string) => void
  onDelete: (id: string) => void
}

const iconMap = {
  text: MessageCircle,
  image: Image,
  video: Play,
  audio: Music,
}

export function TaskCard({ task, queuePosition, onCancel, onRetry, onDelete }: TaskCardProps) {
  const Icon = iconMap[task.type] ?? FileText
  const active = task.status === 'running'
  const meta = [
    task.status === 'queued' && queuePosition ? `позиция ${queuePosition}` : null,
    task.status === 'running' ? formatEta(task.etaSec) : null,
    task.status === 'done' ? formatDuration(task.durationSec) : null,
    task.status === 'failed' ? task.error : null,
    task.status === 'canceled' ? 'отменено пользователем' : null,
    formatCredits(task.credits),
  ].filter(Boolean)

  return (
    <article className={cn('rounded-[16px] border border-[var(--c-line)] bg-[var(--c-bg-1)] p-4', active && 'border-[var(--c-accent)]/80')}>
      <div className="grid grid-cols-[56px_minmax(0,1fr)] gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-[14px] bg-[linear-gradient(135deg,var(--c-accent-soft)_0%,var(--c-bg-2)_72%)] text-[var(--c-accent-2)] shadow-[var(--shadow-1)]">
          <Icon size={20} strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[15px] font-medium leading-5 text-[var(--c-fg)]">{task.prompt}</h3>
          <div className="mt-2 flex min-w-0 items-center gap-2 text-xs leading-4 text-[var(--c-fg-mute)]">
            <span className="inline-flex min-w-0 items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--c-fg)_3%,transparent)] px-2 py-1 font-mono text-[11px] text-[var(--c-fg-dim)]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--c-accent-2)]" />
              <span className="truncate">{task.model}</span>
            </span>
            <span className="truncate">{meta.join(' · ')}</span>
          </div>
        </div>
      </div>

      {task.status === 'running' && (
        <div className="mt-4">
          <ProgressBar value={task.progress} />
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={task.status} className="h-8 text-xs" />
          {task.status === 'running' && <span className="font-mono text-sm font-semibold text-[var(--c-accent-2)]">{task.progress}%</span>}
        </div>
        <TaskActions task={task} onCancel={onCancel} onRetry={onRetry} onDelete={onDelete} />
      </div>
    </article>
  )
}

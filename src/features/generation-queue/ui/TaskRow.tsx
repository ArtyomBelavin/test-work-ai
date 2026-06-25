import { FileText, Image, MessageCircle, Music, Play } from 'lucide-react'
import type { GenerationTask } from '@/entities/generation-task'
import { cn } from '@/shared/lib/utils'
import { formatCredits, formatDuration, formatEta } from '../lib/formatEta'
import { ProgressBar } from './ProgressBar'
import { StatusBadge } from './StatusBadge'
import { TaskActions } from './TaskActions'

interface TaskRowProps {
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

export function TaskRow({ task, queuePosition, onCancel, onRetry, onDelete }: TaskRowProps) {
  const Icon = iconMap[task.type] ?? FileText
  const active = task.status === 'running'
  const meta = [
    task.status === 'queued' && queuePosition ? `позиция ${queuePosition} в очереди` : null,
    task.status === 'running' ? formatEta(task.etaSec) : null,
    task.status === 'done' ? formatDuration(task.durationSec) : null,
    task.status === 'failed' ? task.error : null,
    task.status === 'canceled' ? 'отменено пользователем' : null,
    formatCredits(task.credits),
  ].filter(Boolean)

  return (
    <article
      className={cn(
        'grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-4 rounded-[16px] border border-[var(--c-line)] bg-[var(--c-bg-1)] p-4 transition hover:border-[var(--c-accent-2)]/50',
        active && 'border-[var(--c-accent)]/80 shadow-[var(--shadow-glow)]',
      )}
    >
      <div className="grid h-16 w-16 place-items-center rounded-[14px] bg-[linear-gradient(135deg,var(--c-accent-soft)_0%,var(--c-bg-2)_72%)] text-[var(--c-accent-2)] shadow-[var(--shadow-1)]">
        <Icon size={24} strokeWidth={2.2} />
      </div>

      <div className="min-w-0 self-stretch">
        <h3 className="truncate text-[15px] font-medium leading-5 text-[var(--c-fg)]">{task.prompt}</h3>
        <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-4 text-[var(--c-fg-mute)]">
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--c-fg)_3%,transparent)] px-2 py-1 font-mono text-xs leading-4 text-[var(--c-fg-dim)]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--c-accent-2)]" />
            {task.model}
          </span>
          <span className="truncate text-xs leading-4">{meta.join(' · ')}</span>
        </div>
        {task.status === 'running' && (
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_44px] items-center gap-4">
            <ProgressBar value={task.progress} />
            <span className="text-right font-mono text-[15px] font-medium leading-5 text-[var(--c-accent-2)]">{task.progress}%</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge status={task.status} />
        <TaskActions task={task} onCancel={onCancel} onRetry={onRetry} onDelete={onDelete} />
      </div>
    </article>
  )
}

import { Download, MoreHorizontal, RotateCcw, Trash2, X } from 'lucide-react'
import type { ReactNode } from 'react'
import type { GenerationTask } from '@/entities/generation-task'
import { cn } from '@/shared/lib/utils'

interface TaskActionsProps {
  task: GenerationTask
  onCancel: (id: string) => void
  onRetry: (id: string) => void
  onDelete: (id: string) => void
}

function IconButton({ children, label, onClick, muted }: { children: ReactNode; label: string; onClick: () => void; muted?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[var(--c-line)] bg-[var(--c-bg-1)] text-[var(--c-fg-mute)] transition hover:border-[var(--c-accent-2)]/60 hover:text-[var(--c-accent-2)]',
        muted && 'text-[var(--c-accent-2)]',
      )}
    >
      {children}
    </button>
  )
}

export function TaskActions({ task, onCancel, onRetry, onDelete }: TaskActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {(task.status === 'running' || task.status === 'queued') && (
        <IconButton label="Отменить" onClick={() => onCancel(task.id)}>
          <X size={17} />
        </IconButton>
      )}
      {(task.status === 'failed' || task.status === 'canceled') && (
        <IconButton label="Повторить" onClick={() => onRetry(task.id)} muted>
          <RotateCcw size={16} />
        </IconButton>
      )}
      {task.status === 'done' && (
        <IconButton label="Скачать" onClick={() => undefined} muted>
          <Download size={16} />
        </IconButton>
      )}
      <IconButton label="Удалить" onClick={() => onDelete(task.id)}>
        {task.status === 'done' ? <MoreHorizontal size={17} /> : <Trash2 size={15} />}
      </IconButton>
    </div>
  )
}

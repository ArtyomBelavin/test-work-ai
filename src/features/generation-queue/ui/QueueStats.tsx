import { Circle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface QueueStatsProps {
  stats: {
    queued: number
    running: number
    done: number
    failed: number
  }
}

const cards = [
  { key: 'queued', label: 'В очереди', color: 'text-[var(--c-fg-mute)]' },
  { key: 'running', label: 'Идёт', color: 'text-[var(--c-accent-2)]' },
  { key: 'done', label: 'Готово', color: 'text-emerald-400' },
  { key: 'failed', label: 'Ошибка', color: 'text-red-400' },
] as const

export function QueueStats({ stats }: QueueStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.key} className="rounded-[14px] border border-[var(--c-line)] bg-[var(--c-bg-1)] px-5 py-5 shadow-[var(--shadow-1)]">
          <div className="mb-4 flex items-center gap-2 text-sm text-[var(--c-fg-mute)]">
            <Circle className={cn('h-2.5 w-2.5 fill-current', card.color)} />
            {card.label}
          </div>
          <div className="font-mono text-3xl font-semibold text-[var(--c-fg)]">{stats[card.key]}</div>
        </div>
      ))}
    </div>
  )
}

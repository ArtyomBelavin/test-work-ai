import { cn } from '@/shared/lib/utils'

interface ProgressBarProps {
  value: number
  compact?: boolean
}

export function ProgressBar({ value, compact = false }: ProgressBarProps) {
  return (
    <div className={cn('h-1.5 overflow-hidden rounded-full bg-[var(--c-bg-2)]', compact && 'h-1')}>
      <div className="h-full rounded-full bg-[var(--c-accent-2)] transition-all duration-500 ease-out" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

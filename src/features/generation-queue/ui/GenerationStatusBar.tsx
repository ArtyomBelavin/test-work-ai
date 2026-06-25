import { ChevronDown, Image, LoaderCircle, MessageCircle, Music, Play } from 'lucide-react'
import { useState } from 'react'
import type { GenerationTask, GenType } from '@/entities/generation-task'
import { useLocation, useNavigate } from '@/shared/routing'
import { cn } from '@/shared/lib/utils'
import { selectActiveTasks, selectAverageProgress } from '../model/selectors'
import { useQueue } from '../model/useQueue'
import { ProgressBar } from './ProgressBar'

const iconMap = {
  text: MessageCircle,
  image: Image,
  video: Play,
  audio: Music,
}

const typeLabel: Record<GenType, string> = {
  text: 'текста',
  image: 'изображения',
  video: 'видео',
  audio: 'аудио',
}

function formatGenerationCount(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) return `${count} генерация`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} генерации`
  return `${count} генераций`
}

function MiniTask({ task }: { task: GenerationTask }) {
  const Icon = iconMap[task.type]

  return (
    <div className="grid grid-cols-[32px_minmax(0,1fr)_62px] items-center gap-3">
      <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-[var(--c-accent-soft)] text-[var(--c-accent-2)]">
        <Icon size={14} />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm leading-5 text-[var(--c-fg-dim)]">{task.prompt}</div>
        <div className="mt-1.5">
          <ProgressBar value={task.progress} compact />
        </div>
      </div>
      <div className="text-right font-mono text-xs font-semibold text-[var(--c-accent-2)]">
        {task.status === 'queued' ? 'в очереди' : `${task.progress}%`}
      </div>
    </div>
  )
}

export function GenerationStatusBar() {
  const { tasks } = useQueue()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const activeTasks = selectActiveTasks(tasks)
  const averageProgress = selectAverageProgress(tasks)
  const overComposer = location.pathname === '/chat-status'

  if (activeTasks.length === 0) return null

  const first = activeTasks[0]
  const isSingle = activeTasks.length === 1

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className={cn(
          'fixed left-4 right-4 z-50 mx-auto inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[var(--c-accent)]/80 bg-[var(--c-bg-1)] px-4 text-sm font-semibold text-[var(--c-fg)] shadow-[var(--shadow-2)] transition hover:border-[var(--c-accent-2)] hover:text-[var(--primary-foreground)] safe-bottom md:left-auto md:right-6 md:mx-0 md:w-auto md:min-w-[174px]',
          overComposer ? 'bottom-[226px] md:bottom-[252px] lg:bottom-[66px]' : 'bottom-0 md:bottom-6',
        )}
      >
        <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-[var(--c-accent-2)]" />
        <span>{formatGenerationCount(activeTasks.length)}</span>
        <span className="text-[var(--c-fg-low)]">·</span>
        <span className="font-mono text-[var(--c-accent-2)]">{averageProgress}%</span>
      </button>
    )
  }

  return (
    <aside
      aria-live="polite"
      className={cn(
        'fixed left-0 right-0 z-50 border border-[var(--c-accent)]/70 bg-[var(--c-bg-1)] shadow-[var(--shadow-2)] transition-[opacity,transform] duration-300 safe-bottom',
        'rounded-t-[18px]',
        'md:bottom-6 md:left-auto md:right-6 md:w-[408px] md:rounded-[18px]',
        overComposer ? 'bottom-[226px] md:bottom-[66px]' : 'bottom-0 md:bottom-6',
      )}
    >
      {isSingle ? (
        <button
          type="button"
          onClick={() => navigate('/queue')}
          className="grid w-full grid-cols-[42px_minmax(0,1fr)_24px] items-center gap-4 p-5 text-left"
        >
          <LoaderCircle className="h-7 w-7 animate-spin text-[var(--c-accent-2)]" />
          <div className="min-w-0">
            <div className="font-semibold text-[var(--c-fg)]">Генерация {typeLabel[first.type]}</div>
            <div className="mt-1 font-mono text-sm text-[var(--c-fg-mute)]">
              {first.model} · {first.progress}%
            </div>
            <div className="mt-4 grid grid-cols-[minmax(0,1fr)_42px] items-center gap-3">
              <ProgressBar value={first.progress} />
              <span className="text-right font-mono text-xs font-semibold text-[var(--c-accent-2)]">{first.progress}%</span>
            </div>
          </div>
          <span className="text-2xl text-[var(--c-fg-mute)]">→</span>
        </button>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-3 px-5 pt-5">
            <button type="button" onClick={() => navigate('/queue')} className="flex min-w-0 items-start gap-3 text-left">
              <LoaderCircle className="mt-1 h-7 w-7 shrink-0 animate-spin text-[var(--c-accent-2)]" />
              <div className="min-w-0">
                <div className="text-base font-semibold leading-5 text-[var(--c-fg)]">Генерации идут</div>
                <div className="mt-1 text-sm text-[var(--c-fg-mute)]">
                  {activeTasks.length} активны · {averageProgress}%
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Свернуть статус-бар"
              className="rounded-full p-1 text-[var(--c-fg-mute)] transition hover:bg-[color-mix(in_oklab,var(--c-fg)_4%,transparent)] hover:text-[var(--c-fg)]"
            >
              <ChevronDown size={17} />
            </button>
          </div>
          <div className="mt-5 space-y-4 px-5 pb-5">
            {activeTasks.slice(0, 3).map((task) => (
              <MiniTask key={task.id} task={task} />
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate('/queue')}
            className="w-full border-t border-[var(--c-line)] py-4 text-center text-base font-semibold text-[var(--c-accent-2)]"
          >
            Открыть очередь →
          </button>
        </div>
      )}
    </aside>
  )
}

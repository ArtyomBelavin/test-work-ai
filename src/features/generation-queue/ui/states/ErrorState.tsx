interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-[16px] border border-[hsl(var(--destructive)/0.3)] bg-[hsl(var(--destructive)/0.1)] p-8 text-center">
      <h3 className="text-xl font-semibold text-[var(--c-fg)]">Очередь не загрузилась</h3>
      <p className="mt-2 text-[var(--c-fg-mute)]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 h-10 rounded-full bg-[var(--c-accent)] px-5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:bg-[var(--c-accent-2)]"
      >
        Повторить
      </button>
    </div>
  )
}

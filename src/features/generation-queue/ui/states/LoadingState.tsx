export function LoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-24 animate-pulse rounded-[16px] border border-[var(--c-line)] bg-[var(--c-bg-1)]" />
      ))}
    </div>
  )
}

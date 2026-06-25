interface EmptyStateProps {
  hasTasks: boolean
}

export function EmptyState({ hasTasks }: EmptyStateProps) {
  return (
    <div className="rounded-[16px] border border-dashed border-[var(--c-line)] bg-[var(--c-bg-1)] p-10 text-center">
      <h3 className="text-xl font-semibold text-[var(--c-fg)]">{hasTasks ? 'Ничего не найдено' : 'Очередь пуста'}</h3>
      <p className="mx-auto mt-2 max-w-md text-[var(--c-fg-mute)]">
        {hasTasks
          ? 'Попробуйте изменить фильтр, тип генерации или поисковый запрос.'
          : 'Новые генерации появятся здесь и сразу начнут двигаться по очереди.'}
      </p>
    </div>
  )
}

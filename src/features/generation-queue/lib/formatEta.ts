export function formatEta(seconds?: number) {
  if (!seconds) return 'скоро'
  if (seconds < 60) return `~ ${seconds} сек`

  const minutes = Math.ceil(seconds / 60)
  return `~ ${minutes} мин`
}

export function formatCredits(credits: number) {
  return `${credits} cr`
}

export function formatDuration(seconds?: number) {
  if (!seconds) return null
  if (seconds < 60) return `готово за ${seconds} сек`

  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return rest ? `готово за ${minutes} мин ${rest} сек` : `готово за ${minutes} мин`
}

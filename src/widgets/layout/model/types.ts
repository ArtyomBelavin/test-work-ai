import { AIModel } from '@/entities/ai-model'

export interface RightPanelState {
  selectedModel: AIModel
  selectedSubIndex: number
  aspectRatio: string
  resolution: string
  videoDuration: string
  videoRes: string
  videoQuality: string
  klingFunc: string
  formatOpen: boolean
  qualityOpen: boolean
  durationOpen: boolean
  sceneOpen: boolean
  modelDropdownOpen: boolean
  versionDropdownOpen: boolean
  funcDropdownOpen: boolean
}

export interface RightPanelProps {
  open: boolean
  onClose: () => void
}

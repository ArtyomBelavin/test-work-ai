export type GenType = 'text' | 'image' | 'video' | 'audio'

export type TaskStatus = 'queued' | 'running' | 'done' | 'failed' | 'canceled'

export interface GenerationTask {
  id: string
  type: GenType
  status: TaskStatus
  prompt: string
  model: string
  createdAt: number
  updatedAt: number
  progress: number
  credits: number
  etaSec?: number
  durationSec?: number
  error?: string
  completedAt?: number
  failureAt?: number
  failureReason?: string
}

import type { AgentId } from '../agents/agentTypes'

// Lifecycle inspired by Hermes3D; this implementation is entirely local.
export type TaskStatus = 'inbox' | 'scheduled' | 'working' | 'needs_attention' | 'done'
export type AttentionReason = 'question' | 'review' | 'error'
export type WorkspaceMode = 'demo' | 'tasks'
export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  assignedAgentId: AgentId | null
  progress: number
  attentionReason: AttentionReason | null
  createdAt: string
  updatedAt: string
}
export type TaskResult = { ok: true } | { ok: false; error: string }

export const taskStatusLabels: Record<TaskStatus, string> = {
  inbox: 'Recebida',
  scheduled: 'Na fila',
  working: 'Em execução local',
  needs_attention: 'Precisa de atenção',
  done: 'Concluída',
}

export function currentTaskTitle(taskId: string | null, tasks: readonly Task[]): string {
  return tasks.find((task) => task.id === taskId)?.title ?? 'Sem tarefa'
}

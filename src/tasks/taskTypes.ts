// Lifecycle inspired by Hermes3D; this implementation is entirely local.
export type TaskStatus = 'inbox' | 'scheduled' | 'working' | 'needs_attention' | 'done'
export type AttentionReason = 'question' | 'review' | 'error'
export const attentionReasonLabels: Record<AttentionReason, string> = { question: 'Dúvida', review: 'Revisão', error: 'Erro' }
export type WorkspaceMode = 'demo' | 'tasks'
export type TaskPriority = 'low' | 'normal' | 'high'
export type TaskDraft = {
  title: string
  description: string
  assigneeId: string | null
  priority: TaskPriority
  dueDate: string | null
}
export type TaskEventType = 'created' | 'edited' | 'assigned' | 'started' | 'progress' | 'attention' | 'completed' | 'delivery' | 'approved' | 'changes_requested'
export type TaskEvent = { id: string; at: string; type: TaskEventType; message: string }
export type TaskDelivery = {
  id: string
  summary: string
  url: string | null
  createdAt: string
  review: 'pending' | 'approved' | 'changes_requested'
  reviewedAt: string | null
  reviewNote: string | null
}
export type Task = {
  id: string
  title: string
  description: string
  priority: TaskPriority
  dueDate: string | null
  status: TaskStatus
  assigneeId: string | null
  progress: number
  attentionReason: AttentionReason | null
  attentionNote: string | null
  history: readonly TaskEvent[]
  deliveries: readonly TaskDelivery[]
  createdAt: string
  updatedAt: string
}
export type TaskResult = { ok: true; taskId?: string; participantId?: string } | { ok: false; error: string }

export const taskPriorityLabels: Record<TaskPriority, string> = { low: 'Baixa', normal: 'Normal', high: 'Alta' }

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

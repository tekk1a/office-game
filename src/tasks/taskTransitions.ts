import type { AttentionReason, Task } from './taskTypes'

export type TaskCommand =
  | { type: 'start' }
  | { type: 'attention'; reason: AttentionReason }
  | { type: 'complete' }
  | { type: 'progress'; value: number }

type TransitionResult = { ok: true; task: Task } | { ok: false; error: string }

// Validate before updating: failed commands never partially mutate the store.
export function transitionTask(task: Task, command: TaskCommand, now: string): TransitionResult {
  if (command.type === 'start') {
    if (!task.assignedAgentId || (task.status !== 'scheduled' && task.status !== 'needs_attention')) {
      return { ok: false, error: 'Atribua uma tarefa da fila, ou retome uma tarefa que precisa de atenção.' }
    }
    return { ok: true, task: { ...task, status: 'working', attentionReason: null, updatedAt: now } }
  }
  if (task.status !== 'working') return { ok: false, error: 'Esta ação exige uma tarefa em execução.' }
  if (command.type === 'progress') {
    if (!Number.isFinite(command.value) || command.value < 0 || command.value > 99) {
      return { ok: false, error: 'O progresso deve estar entre 0 e 99. Use Concluir para chegar a 100%.' }
    }
    return { ok: true, task: { ...task, progress: Math.round(command.value), updatedAt: now } }
  }
  if (command.type === 'attention') {
    if (!['question', 'review', 'error'].includes(command.reason)) return { ok: false, error: 'Motivo de atenção inválido.' }
    return { ok: true, task: { ...task, status: 'needs_attention', attentionReason: command.reason, updatedAt: now } }
  }
  return { ok: true, task: { ...task, status: 'done', progress: 100, attentionReason: null, updatedAt: now } }
}

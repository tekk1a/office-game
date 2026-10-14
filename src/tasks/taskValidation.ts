import type { TaskDraft, TaskResult } from './taskTypes'
import type { Participant } from '../participants/participantTypes'

export const agentIds = ['developer', 'marketing', 'research'] as const
export const MAX_TASKS = 1000
export function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T12:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function validateDraft(draft: TaskDraft, participants: readonly Participant[]): TaskResult {
  if (!draft.title.trim() || draft.title.trim().length > 160) return { ok: false, error: 'Informe um título de 1 a 160 caracteres.' }
  if (draft.description.trim().length > 5000) return { ok: false, error: 'A descrição admite até 5.000 caracteres.' }
  if (!['low', 'normal', 'high'].includes(draft.priority)) return { ok: false, error: 'Prioridade inválida.' }
  if (draft.dueDate !== null && !validDate(draft.dueDate)) return { ok: false, error: 'Informe uma data de prazo válida.' }
  if (draft.assigneeId !== null && !participants.some((person) => person.id === draft.assigneeId)) return { ok: false, error: 'Responsável inválido.' }
  return { ok: true }
}

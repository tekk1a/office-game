import type { AttentionReason, Task } from './taskTypes'
import { attentionReasonLabels } from './taskTypes'
import { pendingDelivery, recordTaskEvent, validDeliveryUrl } from './taskHistory'

export type TaskCommand =
  | { type: 'start' }
  | { type: 'attention'; reason: AttentionReason; note?: string }
  | { type: 'complete' }
  | { type: 'progress'; value: number }
  | { type: 'deliver'; summary: string; url: string | null }
  | { type: 'approve' }
  | { type: 'request_changes'; note: string }

type TransitionResult = { ok: true; task: Task } | { ok: false; error: string }

// Validate before updating: failed commands never partially mutate the store.
export function transitionTask(task: Task, command: TaskCommand, now: string): TransitionResult {
  const pending = pendingDelivery(task)
  if (command.type === 'approve' || command.type === 'request_changes') {
    if (task.status !== 'needs_attention' || task.attentionReason !== 'review' || !pending) return { ok: false, error: 'Escolha uma entrega pendente de revisão.' }
    const note = command.type === 'request_changes' ? command.note.trim() : null
    if (note !== null && (!note || note.length > 2000)) return { ok: false, error: 'Descreva os ajustes em até 2.000 caracteres.' }
    const approved = command.type === 'approve'
    const deliveries = task.deliveries.map((delivery) => delivery.id === pending.id ? { ...delivery, review: approved ? 'approved' as const : 'changes_requested' as const, reviewedAt: now, reviewNote: note } : delivery)
    const updated: Task = { ...task, deliveries, status: approved ? 'done' : 'needs_attention', progress: approved ? 100 : task.progress, attentionReason: approved ? null : 'question', attentionNote: note }
    return { ok: true, task: recordTaskEvent(updated, approved ? 'approved' : 'changes_requested', approved ? 'Entrega aprovada e tarefa concluída.' : `Ajustes solicitados: ${note}`, now) }
  }
  if (command.type === 'start') {
    if (!task.assigneeId || (task.status !== 'scheduled' && task.status !== 'needs_attention')) {
      return { ok: false, error: 'Atribua uma tarefa da fila, ou retome uma tarefa que precisa de atenção.' }
    }
    if (pending) return { ok: false, error: 'Aprove a entrega ou solicite ajustes antes de retomar.' }
    return { ok: true, task: recordTaskEvent({ ...task, status: 'working', attentionReason: null, attentionNote: null }, 'started', task.status === 'scheduled' ? 'Andamento iniciado manualmente.' : 'Andamento retomado manualmente.', now) }
  }
  if (task.status !== 'working') return { ok: false, error: 'Esta ação exige uma tarefa em execução.' }
  if (command.type === 'progress') {
    if (!Number.isFinite(command.value) || command.value < 0 || command.value > 99) {
      return { ok: false, error: 'O progresso deve estar entre 0 e 99. Use Concluir para chegar a 100%.' }
    }
    const value = Math.round(command.value)
    return { ok: true, task: value === task.progress ? task : recordTaskEvent({ ...task, progress: value }, 'progress', `Progresso atualizado para ${value}%.`, now) }
  }
  if (command.type === 'attention') {
    if (!['question', 'review', 'error'].includes(command.reason)) return { ok: false, error: 'Motivo de atenção inválido.' }
    const note = command.note?.trim() || null
    if (note && note.length > 2000) return { ok: false, error: 'O motivo admite até 2.000 caracteres.' }
    return { ok: true, task: recordTaskEvent({ ...task, status: 'needs_attention', attentionReason: command.reason, attentionNote: note }, 'attention', `Atenção solicitada (${attentionReasonLabels[command.reason]})${note ? `: ${note}` : '.'}`, now) }
  }
  if (command.type === 'deliver') {
    const summary = command.summary.trim()
    const url = command.url?.trim() || null
    if (!summary || summary.length > 5000 || !validDeliveryUrl(url)) return { ok: false, error: 'Informe uma entrega de até 5.000 caracteres e um link HTTP/HTTPS válido, se houver.' }
    const delivery = { id: `delivery-${crypto.randomUUID()}`, summary, url, createdAt: now, review: 'pending' as const, reviewedAt: null, reviewNote: null }
    return { ok: true, task: recordTaskEvent({ ...task, deliveries: [...task.deliveries, delivery], status: 'needs_attention', attentionReason: 'review', attentionNote: 'Entrega pronta para revisão.' }, 'delivery', 'Entrega registrada para revisão humana.', now) }
  }
  return { ok: true, task: recordTaskEvent({ ...task, status: 'done', progress: 100, attentionReason: null, attentionNote: null }, 'completed', 'Tarefa concluída manualmente.', now) }
}

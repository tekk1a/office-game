import { agentIds, MAX_TASKS, validDate } from './taskValidation'
import { taskStatusLabels } from './taskTypes'
import type { Task } from './taskTypes'
import type { Agent, AgentId } from '../agents/agentTypes'
import type { Participant } from '../participants/participantTypes'
import { initialParticipants } from '../participants/participantData'
import { validDeliveryUrl } from './taskHistory'

export const MAX_BACKUP_BYTES = 2 * 1024 * 1024
export type TaskLinks = Record<AgentId, string | null>
export type TaskSnapshot = {
  format: 'office-game-backup'
  version: 2
  exportedAt: string
  tasks: readonly Task[]
  participants: readonly Participant[]
  currentTaskIds: TaskLinks
}
export type BackupResult = { ok: true; snapshot: TaskSnapshot } | { ok: false; error: string }

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
function timestamp(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value))
}
function isParticipant(value: unknown): value is Participant {
  if (!record(value) || typeof value.id !== 'string' || typeof value.name !== 'string' || !value.name.trim() || value.name.length > 80 || typeof value.role !== 'string' || value.role.length > 100) return false
  if (value.kind === 'agent') return initialParticipants.some((person) => person.id === value.id && person.name === value.name && person.role === value.role)
  return value.kind === 'person' && /^person-[\w-]{1,100}$/.test(value.id)
}
function isEvent(value: unknown): boolean {
  return record(value) && typeof value.id === 'string' && /^[\w-]{1,100}$/.test(value.id) && timestamp(value.at) && typeof value.type === 'string'
    && ['created', 'edited', 'assigned', 'started', 'progress', 'attention', 'completed', 'delivery', 'approved', 'changes_requested'].includes(value.type)
    && typeof value.message === 'string' && value.message.length <= 5200
}
function isDelivery(value: unknown): boolean {
  if (!record(value) || typeof value.id !== 'string' || !/^[\w-]{1,100}$/.test(value.id) || typeof value.summary !== 'string' || !value.summary.trim() || value.summary.length > 5000
    || (value.url !== null && typeof value.url !== 'string') || !validDeliveryUrl(value.url) || !timestamp(value.createdAt)
    || typeof value.review !== 'string' || !['pending', 'approved', 'changes_requested'].includes(value.review)
    || (value.reviewNote !== null && (typeof value.reviewNote !== 'string' || value.reviewNote.length > 2000))) return false
  return value.review === 'pending' ? value.reviewedAt === null : timestamp(value.reviewedAt) && Date.parse(value.reviewedAt) >= Date.parse(value.createdAt)
}
function isTask(value: unknown): value is Task {
  if (!record(value) || typeof value.id !== 'string' || !/^[\w-]{1,100}$/.test(value.id)
    || typeof value.title !== 'string' || !value.title.trim() || value.title.length > 160
    || typeof value.description !== 'string' || value.description.length > 5000
    || typeof value.status !== 'string' || !Object.hasOwn(taskStatusLabels, value.status)
    || typeof value.priority !== 'string' || !['low', 'normal', 'high'].includes(value.priority)
    || (value.dueDate !== null && !validDate(value.dueDate))
    || (value.assigneeId !== null && typeof value.assigneeId !== 'string')
    || typeof value.progress !== 'number' || !Number.isInteger(value.progress) || value.progress < 0 || value.progress > 100
    || !timestamp(value.createdAt) || !timestamp(value.updatedAt) || Date.parse(value.updatedAt) < Date.parse(value.createdAt)
    || (value.attentionNote !== null && (typeof value.attentionNote !== 'string' || value.attentionNote.length > 2000))
    || !Array.isArray(value.history) || value.history.length > 10000 || !value.history.every(isEvent)
    || !Array.isArray(value.deliveries) || value.deliveries.length > 1000 || !value.deliveries.every(isDelivery)) return false
  if (value.status === 'needs_attention') {
    if (typeof value.attentionReason !== 'string' || !['question', 'review', 'error'].includes(value.attentionReason)) return false
  } else if (value.attentionReason !== null) return false
  if (value.status === 'done' ? value.progress !== 100 : value.progress === 100) return false
  if ((value.status === 'working' || value.status === 'needs_attention') && value.assigneeId === null) return false
  const deliveries = value.deliveries as Task['deliveries']
  const pending = deliveries.filter((delivery) => delivery.review === 'pending')
  if (pending.length > 1 || (pending.length === 1 && (value.status !== 'needs_attention' || value.attentionReason !== 'review' || deliveries.at(-1)?.id !== pending[0].id))) return false
  return true
}

export function taskLinks(agents: readonly Agent[]): TaskLinks {
  return {
    developer: agents.find((agent) => agent.id === 'developer')?.currentTaskId ?? null,
    marketing: agents.find((agent) => agent.id === 'marketing')?.currentTaskId ?? null,
    research: agents.find((agent) => agent.id === 'research')?.currentTaskId ?? null,
  }
}
export function createSnapshot(tasks: readonly Task[], agents: readonly Agent[], participants: readonly Participant[] = initialParticipants, exportedAt = new Date().toISOString()): TaskSnapshot {
  return { format: 'office-game-backup', version: 2, exportedAt, tasks, participants, currentTaskIds: taskLinks(agents) }
}

export function parseBackup(text: string): BackupResult {
  if (new TextEncoder().encode(text).byteLength > MAX_BACKUP_BYTES) return { ok: false, error: 'O backup admite até 2 MB.' }
  let value: unknown
  try { value = JSON.parse(text) } catch { return { ok: false, error: 'O arquivo não contém JSON válido.' } }
  if (record(value) && value.format === 'office-game-backup' && value.version === 1 && Array.isArray(value.tasks)) {
    value = { ...value, version: 2, participants: initialParticipants, tasks: value.tasks.map((item: unknown) => record(item) ? { ...item, assigneeId: item.assignedAgentId ?? item.assigneeId ?? null, priority: item.priority ?? 'normal', dueDate: item.dueDate ?? null, attentionNote: null, deliveries: [], history: [] } : item) }
  }
  if (!record(value) || value.format !== 'office-game-backup' || value.version !== 2 || !timestamp(value.exportedAt)
    || !Array.isArray(value.tasks) || value.tasks.length > MAX_TASKS || !value.tasks.every(isTask) || !record(value.currentTaskIds)
    || !Array.isArray(value.participants) || value.participants.length > 200 || !value.participants.every(isParticipant)) {
    return { ok: false, error: 'Formato ou versão de backup incompatível. Nenhum dado foi alterado.' }
  }
  const tasks: Task[] = value.tasks
  const participants: Participant[] = value.participants
  if (new Set(participants.map((person) => person.id)).size !== participants.length || initialParticipants.some((initial) => !participants.some((person) => person.id === initial.id))) return { ok: false, error: 'O backup contém responsáveis inválidos ou duplicados.' }
  if (new Set(tasks.map((task) => task.id)).size !== tasks.length) return { ok: false, error: 'O backup contém ids de tarefa duplicados.' }
  for (const task of tasks) {
    if (task.assigneeId !== null && !participants.some((person) => person.id === task.assigneeId)) return { ok: false, error: 'Há uma tarefa com responsável inexistente.' }
    if (task.assigneeId && tasks.filter((item) => item.assigneeId === task.assigneeId && (item.status === 'working' || item.status === 'needs_attention')).length > 1) return { ok: false, error: 'O backup contém tarefas ativas conflitantes.' }
    if (new Set(task.history.map((item) => item.id)).size !== task.history.length || new Set(task.deliveries.map((item) => item.id)).size !== task.deliveries.length) return { ok: false, error: 'O backup contém registros de histórico ou entrega duplicados.' }
  }
  const currentTaskIds: TaskLinks = { developer: null, marketing: null, research: null }
  for (const agentId of agentIds) {
    const link = value.currentTaskIds[agentId]
    if (link !== null && (typeof link !== 'string' || !tasks.some((task) => task.id === link && task.assigneeId === agentId))) {
      return { ok: false, error: 'O backup contém vínculos de agente inválidos.' }
    }
    const active = tasks.filter((task) => task.assigneeId === agentId && (task.status === 'working' || task.status === 'needs_attention'))
    if (active.length > 1 || (active.length === 1 && active[0].id !== link)) return { ok: false, error: 'O backup contém tarefas ativas conflitantes.' }
    currentTaskIds[agentId] = typeof link === 'string' ? link : null
  }
  const snapshot: TaskSnapshot = { format: 'office-game-backup', version: 2, exportedAt: value.exportedAt, tasks, participants, currentTaskIds }
  if (new TextEncoder().encode(JSON.stringify(snapshot)).byteLength > MAX_BACKUP_BYTES) return { ok: false, error: 'O backup convertido excede o limite local de 2 MB.' }
  return { ok: true, snapshot }
}

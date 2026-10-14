import { parseBackup } from './taskBackup'
import type { TaskSnapshot } from './taskBackup'
import { createSnapshot } from './taskBackup'
import { agentIds } from './taskValidation'
import type { Task } from './taskTypes'
import type { Agent } from '../agents/agentTypes'
import type { Participant } from '../participants/participantTypes'

export const TASK_STORAGE_KEY = 'office-game.workspace.v1'
export type StorageStatus = { kind: 'saved' | 'memory' | 'blocked'; message: string; savedAt: string | null }
export type TaskStorage = Pick<Storage, 'getItem' | 'setItem'>
export type StorageLoad = { snapshot: TaskSnapshot | null; status: StorageStatus; recoveryText: string | null }
export type PersistenceState = { tasks: readonly Task[]; agents: readonly Agent[]; participants: readonly Participant[]; storageStatus: StorageStatus }

export function loadTasks(storage: TaskStorage | null): StorageLoad {
  if (!storage) return { snapshot: null, recoveryText: null, status: { kind: 'memory', message: 'Salvamento local indisponível. Use o backup para guardar seu trabalho.', savedAt: null } }
  try {
    const raw = storage.getItem(TASK_STORAGE_KEY)
    if (raw === null) return { snapshot: null, recoveryText: null, status: { kind: 'saved', message: 'Salvamento local pronto.', savedAt: null } }
    const parsed = parseBackup(raw)
    if (!parsed.ok) return { snapshot: null, recoveryText: raw, status: { kind: 'blocked', message: 'Os dados salvos precisam de recuperação. O conteúdo original foi preservado; restaure um backup válido para reativar o salvamento.', savedAt: null } }
    return { snapshot: parsed.snapshot, recoveryText: null, status: { kind: 'saved', message: 'Tarefas recuperadas deste navegador.', savedAt: parsed.snapshot.exportedAt } }
  } catch {
    return { snapshot: null, recoveryText: null, status: { kind: 'memory', message: 'Não foi possível ler o salvamento local. Exporte um backup para guardar o trabalho.', savedAt: null } }
  }
}

export function saveTasks(storage: TaskStorage | null, snapshot: TaskSnapshot): StorageStatus {
  try {
    if (!storage) throw new Error('Storage unavailable')
    storage.setItem(TASK_STORAGE_KEY, JSON.stringify(snapshot))
    return { kind: 'saved', message: 'Tarefas salvas neste navegador.', savedAt: snapshot.exportedAt }
  } catch {
    return { kind: 'memory', message: 'Não foi possível salvar neste navegador. Os dados continuam abertos; baixe um backup.', savedAt: null }
  }
}

export function browserStorage(): TaskStorage | null {
  try { return typeof window === 'undefined' ? null : window.localStorage } catch { return null }
}

export function persistBusinessChange(state: PersistenceState, previous: PersistenceState, storage: TaskStorage | null): StorageStatus | null {
  const changed = state.tasks !== previous.tasks || state.participants !== previous.participants || agentIds.some((id) => state.agents.find((agent) => agent.id === id)?.currentTaskId !== previous.agents.find((agent) => agent.id === id)?.currentTaskId)
  if (!changed || state.storageStatus.kind === 'blocked') return null
  return saveTasks(storage, createSnapshot(state.tasks, state.agents, state.participants))
}

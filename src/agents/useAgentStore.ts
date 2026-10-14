import { advanceBehavior } from './agentBehavior'
import { createRoutineState, travelActivities } from './agentRoutine'
import type { RoutineState } from './agentRoutine'
import { create } from 'zustand'
import { createMovement, stepAgent } from './agentNavigation'
import { initialAgents } from './agentData'
import type { Agent, AgentId, MovementDestination } from './agentTypes'
import { reconcileAgentTask } from './agentTaskBehavior'
import { initialTasks } from '../tasks/taskData'
import { currentTaskTitle } from '../tasks/taskTypes'
import type { Task, TaskDraft, TaskResult, WorkspaceMode } from '../tasks/taskTypes'
import { transitionTask } from '../tasks/taskTransitions'
import type { TaskCommand } from '../tasks/taskTransitions'
import { MAX_TASKS, validateDraft } from '../tasks/taskValidation'
import { createSnapshot, parseBackup, MAX_BACKUP_BYTES } from '../tasks/taskBackup'
import { browserStorage, loadTasks, persistBusinessChange, TASK_STORAGE_KEY } from '../tasks/taskStorage'
import type { StorageStatus } from '../tasks/taskStorage'
import { initialParticipants } from '../participants/participantData'
import type { Participant, PersonDraft } from '../participants/participantTypes'
import { recordTaskEvent } from '../tasks/taskHistory'

const storage = browserStorage()
const loaded = loadTasks(storage)
const restoredAgents = initialAgents.map((agent) => ({ ...agent, position: [...agent.position] as Agent['position'], currentTaskId: loaded.snapshot ? loaded.snapshot.currentTaskIds[agent.id] : agent.currentTaskId }))
const restoredTasks = loaded.snapshot?.tasks ?? initialTasks
const restoredParticipants = loaded.snapshot?.participants ?? initialParticipants

function capacity(tasks: readonly Task[], agents: readonly Agent[], participants: readonly Participant[]): TaskResult {
  if (tasks.some((task) => task.history.length > 10000 || task.deliveries.length > 1000) || new TextEncoder().encode(JSON.stringify(createSnapshot(tasks, agents, participants))).byteLength > MAX_BACKUP_BYTES) {
    return { ok: false, error: 'O limite local de 2 MB foi atingido. Exporte um backup antes de ampliar os dados.' }
  }
  return { ok: true }
}

function linkTask(agents: readonly Agent[], task: Task, tasks: readonly Task[]): readonly Agent[] {
  if (!agents.some((agent) => agent.id === task.assigneeId)) return agents
  return agents.map((agent) => {
    if (agent.id !== task.assigneeId) return agent
    const current = tasks.find((item) => item.id === agent.currentTaskId)
    return current?.status === 'working' || current?.status === 'needs_attention'
      ? agent : reconcileAgentTask({ ...agent, currentTaskId: task.id }, tasks)
  })
}

type AgentState = {
  agents: readonly Agent[]
  tasks: readonly Task[]
  participants: readonly Participant[]
  workspaceMode: WorkspaceMode
  storageStatus: StorageStatus
  recoveryText: string | null
  createTask: (draft: TaskDraft) => TaskResult
  editTask: (taskId: string, draft: TaskDraft) => TaskResult
  exportTasks: () => string
  importTasks: (json: string) => TaskResult
  savePerson: (draft: PersonDraft, personId?: string) => TaskResult
  setWorkspaceMode: (mode: WorkspaceMode) => TaskResult
  assignTask: (taskId: string, assigneeId: string) => TaskResult
  commandTask: (taskId: string, command: TaskCommand) => TaskResult
  routine: RoutineState
  startRoutine: () => void
  pauseRoutine: () => void
  restartRoutine: () => void
  advanceBehavior: (delta: number) => void
  hoveredAgentId: AgentId | null
  selectedAgentId: AgentId | null
  setHoveredAgent: (id: AgentId | null) => void
  selectAgent: (id: AgentId) => void
  clearSelection: () => void
  moveAgent: (id: AgentId, destination: MovementDestination) => void
  advanceMovement: (delta: number) => void
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: loaded.snapshot ? restoredAgents.map((agent) => reconcileAgentTask(agent, restoredTasks)) : restoredAgents,
  tasks: restoredTasks,
  participants: restoredParticipants,
  workspaceMode: loaded.snapshot ? 'tasks' : 'demo',
  storageStatus: loaded.status,
  recoveryText: loaded.recoveryText,
  createTask: (draft) => {
    const valid = validateDraft(draft, get().participants)
    if (!valid.ok) return valid
    let result: TaskResult = { ok: true }
    set((state) => {
      if (state.workspaceMode !== 'tasks' || state.tasks.length >= MAX_TASKS) {
        result = { ok: false, error: 'Use o modo Tarefas. O limite local é de 1.000 tarefas.' }; return state
      }
      const now = new Date().toISOString()
      const task: Task = recordTaskEvent({ ...draft, title: draft.title.trim(), description: draft.description.trim(), id: `task-${crypto.randomUUID()}`, status: draft.assigneeId ? 'scheduled' : 'inbox', progress: 0, attentionReason: null, attentionNote: null, history: [], deliveries: [], createdAt: now, updatedAt: now }, 'created', 'Tarefa criada no escritório local.', now)
      const tasks = [...state.tasks, task]
      const agents = linkTask(state.agents, task, tasks)
      const validCapacity = capacity(tasks, agents, state.participants)
      if (!validCapacity.ok) { result = validCapacity; return state }
      result = { ok: true, taskId: task.id }
      return { tasks, agents }
    })
    return result
  },
  editTask: (taskId, draft) => {
    const valid = validateDraft(draft, get().participants)
    if (!valid.ok) return valid
    let result: TaskResult = { ok: true }
    set((state) => {
      const task = state.tasks.find((item) => item.id === taskId)
      if (state.workspaceMode !== 'tasks' || !task) { result = { ok: false, error: 'Escolha uma tarefa existente no modo Tarefas.' }; return state }
      const reassign = task.assigneeId !== draft.assigneeId
      if (reassign && (!['inbox', 'scheduled'].includes(task.status) || state.agents.some((agent) => agent.currentTaskId === taskId && agent.movement))) {
        result = { ok: false, error: 'Troque o responsável somente em tarefas recebidas ou na fila, sem rota em andamento.' }; return state
      }
      const updated: Task = recordTaskEvent({ ...task, ...draft, title: draft.title.trim(), description: draft.description.trim(), status: reassign ? draft.assigneeId ? 'scheduled' : 'inbox' : task.status }, 'edited', reassign ? 'Tarefa editada e responsável alterado.' : 'Dados da tarefa editados.', new Date().toISOString())
      const tasks = state.tasks.map((item) => item.id === taskId ? updated : item)
      const agents = state.agents.some((agent) => agent.currentTaskId === taskId) ? state.agents.map((agent) => {
        if (agent.currentTaskId !== taskId) return agent
        return reconcileAgentTask({ ...agent, currentTaskId: reassign ? null : taskId }, tasks)
      }) : state.agents
      const linked = reassign ? linkTask(agents, updated, tasks) : agents
      const validCapacity = capacity(tasks, linked, state.participants)
      if (!validCapacity.ok) { result = validCapacity; return state }
      return { tasks, agents: linked }
    })
    return result
  },
  exportTasks: () => JSON.stringify(createSnapshot(get().tasks, get().agents, get().participants)),
  importTasks: (json) => {
    const parsed = parseBackup(json)
    if (!parsed.ok) return parsed
    let result: TaskResult = { ok: true }
    set((state) => {
      if (state.routine.mode !== 'stopped' || state.agents.some((agent) => agent.movement)) {
        result = { ok: false, error: 'Finalize a rotina e todas as rotas antes de restaurar um backup.' }; return state
      }
      const tasks = parsed.snapshot.tasks
      const agents = state.agents.map((agent) => {
        const linked = { ...agent, currentTaskId: parsed.snapshot.currentTaskIds[agent.id] }
        return state.workspaceMode === 'tasks' ? reconcileAgentTask(linked, tasks) : { ...linked, status: 'idle' as const, currentActivity: 'Demonstração pronta' }
      })
      const validCapacity = capacity(tasks, agents, parsed.snapshot.participants)
      if (!validCapacity.ok) { result = validCapacity; return state }
      return {
        tasks,
        participants: parsed.snapshot.participants,
        agents,
        storageStatus: { kind: 'memory' as const, message: 'Backup restaurado; preparando salvamento.', savedAt: null },
      }
    })
    return result
  },
  savePerson: (draft, personId) => {
    const name = draft.name.trim(), role = draft.role.trim()
    if (!name || name.length > 80 || role.length > 100) return { ok: false, error: 'Informe nome de até 80 caracteres e função de até 100.' }
    let result: TaskResult = { ok: true }
    set((state) => {
      const existing = state.participants.find((person) => person.id === personId)
      if (state.workspaceMode !== 'tasks' || (personId && existing?.kind !== 'person') || (!personId && state.participants.length >= 200)) {
        result = { ok: false, error: 'Cadastre/edite pessoas no modo Tarefas. Limite de 197 pessoas; agentes são preservados.' }; return state
      }
      const person: Participant = { id: personId ?? `person-${crypto.randomUUID()}`, kind: 'person', name, role }
      const participants = personId ? state.participants.map((item) => item.id === personId ? person : item) : [...state.participants, person]
      const validCapacity = capacity(state.tasks, state.agents, participants)
      if (!validCapacity.ok) { result = validCapacity; return state }
      result = { ok: true, participantId: person.id }
      return { participants }
    })
    return result
  },
  setWorkspaceMode: (mode) => {
    let result: TaskResult = { ok: true }
    set((state) => {
      if (mode === state.workspaceMode) return state
      if (state.agents.some((agent) => agent.movement)) {
        result = { ok: false, error: 'Aguarde todas as rotas terminarem para trocar de modo.' }
        return state
      }
      return {
        workspaceMode: mode,
        routine: createRoutineState(),
        agents: state.agents.map((agent) => mode === 'tasks'
          ? reconcileAgentTask(agent, state.tasks)
          : { ...agent, status: 'idle' as const, currentActivity: 'Demonstração pronta' }),
      }
    })
    return result
  },
  assignTask: (taskId, assigneeId) => {
    let result: TaskResult = { ok: true }
    set((state) => {
      const task = state.tasks.find((item) => item.id === taskId)
      const person = state.participants.find((item) => item.id === assigneeId)
      if (state.workspaceMode !== 'tasks' || !task || !person || !['inbox', 'scheduled'].includes(task.status)
        || (task.assigneeId !== null && task.assigneeId !== assigneeId)) {
        result = { ok: false, error: 'Escolha uma tarefa recebida ou da fila deste agente no modo Tarefas.' }
        return state
      }
      const tasks = state.tasks.map((item) => item.id === taskId
        ? recordTaskEvent({ ...item, assigneeId, status: 'scheduled' }, 'assigned', `Tarefa atribuída a ${person.name}.`, new Date().toISOString()) : item)
      const updated = tasks.find((item) => item.id === taskId)
      if (!updated) return state
      const agents = linkTask(state.agents, updated, tasks)
      const validCapacity = capacity(tasks, agents, state.participants)
      if (!validCapacity.ok) { result = validCapacity; return state }
      return { tasks, agents }
    })
    return result
  },
  commandTask: (taskId, command) => {
    let result: TaskResult = { ok: true }
    set((state) => {
      const task = state.tasks.find((item) => item.id === taskId)
      const agent = state.agents.find((item) => item.id === task?.assigneeId)
      const person = state.participants.find((item) => item.id === task?.assigneeId)
      if (state.workspaceMode !== 'tasks' || !task || !person) {
        result = { ok: false, error: 'Selecione uma tarefa atribuída no modo Tarefas.' }
        return state
      }
      const conflicting = state.tasks.some((item) => item.id !== taskId && item.assigneeId === person.id
        && (item.status === 'working' || item.status === 'needs_attention'))
      if (conflicting || (agent && command.type !== 'start' && agent.currentTaskId !== taskId)) {
        result = { ok: false, error: 'Resolva a tarefa ativa deste agente antes de iniciar outra.' }
        return state
      }
      const transition = transitionTask(task, command, new Date().toISOString())
      if (!transition.ok) { result = transition; return state }
      if (transition.task === task) return state
      const tasks = state.tasks.map((item) => item.id === taskId ? transition.task : item)
      const agents = agent ? state.agents.map((item) => item.id === agent.id ? reconcileAgentTask({ ...item, currentTaskId: taskId }, tasks) : item) : state.agents
      const validCapacity = capacity(tasks, agents, state.participants)
      if (!validCapacity.ok) { result = validCapacity; return state }
      return { tasks, agents }
    })
    return result
  },
  routine: createRoutineState(),
  startRoutine: () => set((state) => {
    if (state.workspaceMode !== 'demo' || state.routine.mode === 'resetting' || state.routine.mode === 'running') return state
    return { routine: state.routine.mode === 'paused' ? { ...state.routine, mode: 'running' } : createRoutineState('running') }
  }),
  pauseRoutine: () => set((state) => state.workspaceMode === 'demo' && state.routine.mode === 'running' ? { routine: { ...state.routine, mode: 'paused' } } : state),
  restartRoutine: () => set((state) => state.workspaceMode === 'demo' ? { routine: createRoutineState('resetting') } : state),
  advanceBehavior: (delta) => set((state) => state.workspaceMode === 'demo' ? advanceBehavior(state.agents, state.routine, delta, state.tasks) : state),
  hoveredAgentId: null,
  selectedAgentId: null,
  setHoveredAgent: (id) => set({ hoveredAgentId: id }),
  selectAgent: (id) => set({ selectedAgentId: id }),
  clearSelection: () => set({ selectedAgentId: null }),
  moveAgent: (id, destination) => set((state) => state.workspaceMode !== 'demo' || state.routine.mode !== 'stopped' ? state : ({
    agents: state.agents.map((agent) => {
      if (agent.id !== id) return agent
      const movement = createMovement(agent, destination)
      return movement ? { ...agent, movement, status: 'walking' as const, currentActivity: travelActivities[destination] } : agent
    }),
  })),
  advanceMovement: (delta) => set((state) => ({
    agents: state.agents.map((agent) => {
      const next = stepAgent(agent, delta)
      if (state.workspaceMode === 'tasks' && agent.movement && !next.movement) {
        return reconcileAgentTask(next, state.tasks)
      }
      if (state.routine.mode === 'stopped' && agent.movement && !next.movement) {
        return { ...next, currentActivity: next.status === 'working' ? currentTaskTitle(next.currentTaskId, state.tasks) : 'Idle' }
      }
      return next
    }),
  })),
}))

// Persist only business changes: camera, selection, gait and position ticks never write.
if (typeof window !== 'undefined') {
  const unsubscribe = useAgentStore.subscribe((state, previous) => {
    const status = persistBusinessChange(state, previous, storage)
    if (!status) return
    useAgentStore.setState({ storageStatus: status, recoveryText: status.kind === 'saved' ? null : state.recoveryText })
  })
  const externalChange = (event: StorageEvent) => {
    if (event.storageArea !== storage || (event.key !== TASK_STORAGE_KEY && event.key !== null)) return
    useAgentStore.setState({ storageStatus: { kind: 'blocked', message: 'Os dados mudaram em outra aba. Exporte o estado aberto e recarregue para continuar; o salvamento está pausado para evitar sobrescrever outro trabalho.', savedAt: null }, recoveryText: event.newValue ?? event.oldValue })
  }
  window.addEventListener('storage', externalChange)
  import.meta.hot?.dispose(() => { unsubscribe(); window.removeEventListener('storage', externalChange) })
}


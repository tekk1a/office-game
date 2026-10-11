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
import type { Task, TaskResult, WorkspaceMode } from '../tasks/taskTypes'
import { transitionTask } from '../tasks/taskTransitions'
import type { TaskCommand } from '../tasks/taskTransitions'

type AgentState = {
  agents: readonly Agent[]
  tasks: readonly Task[]
  workspaceMode: WorkspaceMode
  setWorkspaceMode: (mode: WorkspaceMode) => TaskResult
  assignTask: (taskId: string, agentId: AgentId) => TaskResult
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

export const useAgentStore = create<AgentState>((set) => ({
  agents: initialAgents,
  tasks: initialTasks,
  workspaceMode: 'demo',
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
  assignTask: (taskId, agentId) => {
    let result: TaskResult = { ok: true }
    set((state) => {
      const task = state.tasks.find((item) => item.id === taskId)
      const agent = state.agents.find((item) => item.id === agentId)
      if (state.workspaceMode !== 'tasks' || !task || !agent || !['inbox', 'scheduled'].includes(task.status)
        || (task.assignedAgentId !== null && task.assignedAgentId !== agentId)) {
        result = { ok: false, error: 'Escolha uma tarefa recebida ou da fila deste agente no modo Tarefas.' }
        return state
      }
      const tasks = state.tasks.map((item) => item.id === taskId
        ? { ...item, assignedAgentId: agentId, status: 'scheduled' as const, updatedAt: new Date().toISOString() } : item)
      const current = state.tasks.find((item) => item.id === agent.currentTaskId)
      const busy = current?.status === 'working' || current?.status === 'needs_attention'
      return { tasks, agents: state.agents.map((item) => item.id === agentId && !busy
        ? reconcileAgentTask({ ...item, currentTaskId: taskId }, tasks) : item) }
    })
    return result
  },
  commandTask: (taskId, command) => {
    let result: TaskResult = { ok: true }
    set((state) => {
      const task = state.tasks.find((item) => item.id === taskId)
      const agent = state.agents.find((item) => item.id === task?.assignedAgentId)
      if (state.workspaceMode !== 'tasks' || !task || !agent) {
        result = { ok: false, error: 'Selecione uma tarefa atribuída no modo Tarefas.' }
        return state
      }
      const conflicting = state.tasks.some((item) => item.id !== taskId && item.assignedAgentId === agent.id
        && (item.status === 'working' || item.status === 'needs_attention'))
      if (conflicting || (command.type !== 'start' && agent.currentTaskId !== taskId)) {
        result = { ok: false, error: 'Resolva a tarefa ativa deste agente antes de iniciar outra.' }
        return state
      }
      const transition = transitionTask(task, command, new Date().toISOString())
      if (!transition.ok) { result = transition; return state }
      const tasks = state.tasks.map((item) => item.id === taskId ? transition.task : item)
      return { tasks, agents: state.agents.map((item) => item.id === agent.id
        ? reconcileAgentTask({ ...item, currentTaskId: taskId }, tasks) : item) }
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


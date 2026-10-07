import { advanceBehavior } from './agentBehavior'
import { createRoutineState, travelActivities } from './agentRoutine'
import type { RoutineState } from './agentRoutine'
import { create } from 'zustand'
import { createMovement, stepAgent } from './agentNavigation'
import { initialAgents } from './agentData'
import type { Agent, AgentId, MovementDestination } from './agentTypes'

type AgentState = {
  agents: readonly Agent[]
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
  routine: createRoutineState(),
  startRoutine: () => set((state) => {
    if (state.routine.mode === 'resetting' || state.routine.mode === 'running') return state
    return { routine: state.routine.mode === 'paused' ? { ...state.routine, mode: 'running' } : createRoutineState('running') }
  }),
  pauseRoutine: () => set((state) => state.routine.mode === 'running' ? { routine: { ...state.routine, mode: 'paused' } } : state),
  restartRoutine: () => set({ routine: createRoutineState('resetting') }),
  advanceBehavior: (delta) => set((state) => advanceBehavior(state.agents, state.routine, delta)),
  hoveredAgentId: null,
  selectedAgentId: null,
  setHoveredAgent: (id) => set({ hoveredAgentId: id }),
  selectAgent: (id) => set({ selectedAgentId: id }),
  clearSelection: () => set({ selectedAgentId: null }),
  moveAgent: (id, destination) => set((state) => state.routine.mode !== 'stopped' ? state : ({
    agents: state.agents.map((agent) => {
      if (agent.id !== id) return agent
      const movement = createMovement(agent, destination)
      return movement ? { ...agent, movement, status: 'walking' as const, currentActivity: travelActivities[destination] } : agent
    }),
  })),
  advanceMovement: (delta) => set((state) => ({
    agents: state.agents.map((agent) => {
      const next = stepAgent(agent, delta)
      if (state.routine.mode === 'stopped' && agent.movement && !next.movement) {
        return { ...next, currentActivity: next.status === 'working' ? next.currentTask : 'Idle' }
      }
      return next
    }),
  })),
}))


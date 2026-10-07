import { create } from 'zustand'
import { createMovement, stepAgent } from './agentNavigation'
import { initialAgents } from './agentData'
import type { Agent, AgentId, MovementDestination } from './agentTypes'

type AgentState = {
  agents: readonly Agent[]
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
  hoveredAgentId: null,
  selectedAgentId: null,
  setHoveredAgent: (id) => set({ hoveredAgentId: id }),
  selectAgent: (id) => set({ selectedAgentId: id }),
  clearSelection: () => set({ selectedAgentId: null }),
  moveAgent: (id, destination) => set((state) => ({
    agents: state.agents.map((agent) => {
      if (agent.id !== id) return agent
      const movement = createMovement(agent, destination)
      return movement ? { ...agent, movement, status: 'walking' as const } : agent
    }),
  })),
  advanceMovement: (delta) => set((state) => ({
    agents: state.agents.map((agent) => stepAgent(agent, delta)),
  })),
}))


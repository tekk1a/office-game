import { initialAgents } from '../agents/agentData'
import type { Participant } from './participantTypes'

export const initialParticipants: readonly Participant[] = initialAgents.map((agent) => ({ id: agent.id, kind: 'agent', name: agent.name, role: agent.role }))

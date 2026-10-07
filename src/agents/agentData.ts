import { agentPositions } from './agentPositions'
import type { Agent } from './agentTypes'

export const initialAgents: readonly Agent[] = [
  {
    id: 'developer',
    name: 'Developer',
    role: 'Developer',
    status: 'working',
    currentTask: 'Building landing page',
    currentActivity: 'Building landing page',
    progress: 72,
    rotationY: agentPositions.developer.rotationY,
    movement: null,
    position: [...agentPositions.developer.position],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    role: 'Marketing',
    status: 'idle',
    currentTask: 'Waiting for task',
    currentActivity: 'Idle at desk',
    progress: 0,
    rotationY: agentPositions.marketing.rotationY,
    movement: null,
    position: [...agentPositions.marketing.position],
  },
  {
    id: 'research',
    name: 'Research',
    role: 'Research',
    status: 'working',
    currentTask: 'Researching competitors',
    currentActivity: 'Researching competitors',
    progress: 45,
    rotationY: agentPositions.research.rotationY,
    movement: null,
    position: [...agentPositions.research.position],
  },
]

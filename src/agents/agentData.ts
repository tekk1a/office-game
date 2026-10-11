import { agentPositions } from './agentPositions'
import type { Agent } from './agentTypes'

export const initialAgents: readonly Agent[] = [
  {
    id: 'developer',
    name: 'Developer',
    role: 'Developer',
    status: 'working',
    currentTaskId: 'landing-page',
    currentActivity: 'Building landing page',
    rotationY: agentPositions.developer.rotationY,
    movement: null,
    position: [...agentPositions.developer.position],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    role: 'Marketing',
    status: 'idle',
    currentTaskId: 'campaign',
    currentActivity: 'Idle at desk',
    rotationY: agentPositions.marketing.rotationY,
    movement: null,
    position: [...agentPositions.marketing.position],
  },
  {
    id: 'research',
    name: 'Research',
    role: 'Research',
    status: 'working',
    currentTaskId: 'competitors',
    currentActivity: 'Researching competitors',
    rotationY: agentPositions.research.rotationY,
    movement: null,
    position: [...agentPositions.research.position],
  },
]

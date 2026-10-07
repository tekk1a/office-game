export type AgentId = 'developer' | 'marketing' | 'research'

export type AgentStatus =
  | 'idle'
  | 'walking'
  | 'working'
  | 'thinking'
  | 'meeting'
  | 'finished'
  | 'error'

export type AgentPosition = [x: number, y: number, z: number]

export type MovementDestination = 'desk' | 'center' | 'meeting' | 'coffee' | 'idle'

export type AgentMovement = {
  destination: MovementDestination
  route: AgentPosition[]
  finalStatus: Exclude<AgentStatus, 'walking'>
  finalRotationY: number | null
}

export type Agent = {
  id: AgentId
  name: string
  role: string
  status: AgentStatus
  currentTask: string
  progress: number
  rotationY: number
  movement: AgentMovement | null
  position: AgentPosition
}

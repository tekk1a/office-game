import type { AgentId, AgentStatus, MovementDestination } from './agentTypes'

export type RoutineMode = 'stopped' | 'running' | 'paused' | 'resetting'
export type RoutineStep = {
  destination: MovementDestination
  status: Exclude<AgentStatus, 'walking'>
  activity: string | null // null means use the agent's existing task.
  durationSeconds: number
}
export type AgentRoutineState = {
  stepIndex: number
  phase: 'pending' | 'traveling' | 'waiting'
  remainingSeconds: number
  initialDelayPending: boolean
}
export type RoutineState = {
  mode: RoutineMode
  agents: Record<AgentId, AgentRoutineState>
}

export const routineTiming = {
  tickMs: 100,
  maxDeltaSeconds: 0.25,
  developerWork: 10,
  marketingWork: 12,
  researchWork: 15,
  center: 2,
  researchCenter: 3,
  coffee: 5,
  meeting: 8,
  idle: 6,
  freeArea: 4,
  startDelays: { developer: 0, marketing: 2, research: 4 },
}

export const agentRoutines: Record<AgentId, readonly RoutineStep[]> = {
  developer: [
    { destination: 'desk', status: 'working', activity: null, durationSeconds: routineTiming.developerWork },
    { destination: 'center', status: 'idle', activity: 'At the center', durationSeconds: routineTiming.center },
    { destination: 'coffee', status: 'idle', activity: 'Coffee break', durationSeconds: routineTiming.coffee },
  ],
  marketing: [
    { destination: 'desk', status: 'working', activity: null, durationSeconds: routineTiming.marketingWork },
    { destination: 'meeting', status: 'meeting', activity: 'Meeting', durationSeconds: routineTiming.meeting },
    { destination: 'desk', status: 'idle', activity: 'Idle at desk', durationSeconds: routineTiming.idle },
  ],
  research: [
    { destination: 'desk', status: 'working', activity: null, durationSeconds: routineTiming.researchWork },
    { destination: 'idle', status: 'idle', activity: 'In the free area', durationSeconds: routineTiming.freeArea },
    { destination: 'center', status: 'idle', activity: 'At the center', durationSeconds: routineTiming.researchCenter },
  ],
}

export const travelActivities: Record<MovementDestination, string> = {
  desk: 'Returning to desk',
  center: 'Going to center',
  meeting: 'Going to meeting',
  coffee: 'Going to coffee',
  idle: 'Going to free area',
}

export function createRoutineState(mode: RoutineMode = 'stopped'): RoutineState {
  const initial = (): AgentRoutineState => ({ stepIndex: 0, phase: 'pending', remainingSeconds: 0, initialDelayPending: true })
  return { mode, agents: { developer: initial(), marketing: initial(), research: initial() } }
}

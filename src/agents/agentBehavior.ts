import { angleDifference, createMovement, DESK_ROTATION_Y } from './agentNavigation'
import { destinationPosition } from './officeWaypoints'
import { agentRoutines, createRoutineState, routineTiming, travelActivities } from './agentRoutine'
import type { AgentRoutineState, RoutineState, RoutineStep } from './agentRoutine'
import type { Agent, AgentMovement, MovementDestination } from './agentTypes'

// Pure decision controller. Position integration remains exclusively in agentNavigation.
function travelTo(agent: Agent, destination: MovementDestination, finalStatus: RoutineStep['status']): AgentMovement | null {
  const movement = createMovement(agent, destination)
  if (movement) return { ...movement, finalStatus }
  // At a desk, a zero-length route can smoothly settle the orientation without teleporting.
  if (destination === 'desk' && Math.abs(angleDifference(DESK_ROTATION_Y, agent.rotationY)) > 0.015) {
    return { destination, route: [], finalStatus, finalRotationY: DESK_ROTATION_Y }
  }
  return null
}

function waitAtStep(agent: Agent, state: AgentRoutineState, step: RoutineStep) {
  return {
    agent: { ...agent, status: step.status, currentActivity: step.activity ?? agent.currentTask },
    state: {
      ...state,
      phase: 'waiting' as const,
      remainingSeconds: step.durationSeconds + (state.initialDelayPending ? routineTiming.startDelays[agent.id] : 0),
      initialDelayPending: false,
    },
  }
}

function stepRoutine(agent: Agent, state: AgentRoutineState, delta: number) {
  const steps = agentRoutines[agent.id]
  const step = steps[state.stepIndex]
  if (agent.movement) return { agent, state }
  if (state.phase === 'traveling') return waitAtStep(agent, state, step)
  if (state.phase === 'waiting') {
    const remainingSeconds = Math.max(0, state.remainingSeconds - delta)
    return {
      agent,
      state: remainingSeconds > 1e-8
        ? { ...state, remainingSeconds }
        : { ...state, stepIndex: (state.stepIndex + 1) % steps.length, phase: 'pending' as const, remainingSeconds: 0 },
    }
  }
  const movement = travelTo(agent, step.destination, step.status)
  if (!movement) return waitAtStep(agent, state, step)
  return {
    agent: { ...agent, movement, status: 'walking' as const, currentActivity: travelActivities[step.destination] },
    state: { ...state, phase: 'traveling' as const },
  }
}

function resetAgent(agent: Agent): Agent {
  if (agent.movement) return agent
  const movement = travelTo(agent, 'desk', agent.id === 'marketing' ? 'idle' : 'working')
  if (movement) return { ...agent, movement, status: 'walking', currentActivity: travelActivities.desk }
  return { ...agent, status: agent.id === 'marketing' ? 'idle' : 'working', currentActivity: agent.id === 'marketing' ? 'Idle at desk' : agent.currentTask }
}

export function advanceBehavior(agents: readonly Agent[], routine: RoutineState, delta: number) {
  if (routine.mode === 'stopped') return { agents, routine }
  if (routine.mode === 'paused') {
    // A route may finish while paused. Reflect its arrival without counting down or dispatching.
    const states = { ...routine.agents }
    let changed = false
    const settled = agents.map((agent) => {
      const state = states[agent.id]
      if (agent.movement || state.phase !== 'traveling') return agent
      const next = waitAtStep(agent, state, agentRoutines[agent.id][state.stepIndex])
      states[agent.id] = next.state
      changed = true
      return next.agent
    })
    return changed ? { agents: settled, routine: { ...routine, agents: states } } : { agents, routine }
  }
  if (routine.mode === 'resetting') {
    const returning = agents.map(resetAgent)
    const allHome = returning.every((agent) => {
      const target = destinationPosition(agent.id, 'desk')
      return !agent.movement && Math.hypot(agent.position[0] - target[0], agent.position[2] - target[2]) < 0.001
    })
    // Reset ends ready to start; it never silently launches another cycle.
    return { agents: returning, routine: allHome ? createRoutineState() : routine }
  }
  const states = { ...routine.agents }
  const updated = agents.map((agent) => {
    const next = stepRoutine(agent, states[agent.id], Math.max(0, delta))
    states[agent.id] = next.state
    return next.agent
  })
  const stableAgents = updated.every((agent, index) => agent === agents[index]) ? agents : updated
  return { agents: stableAgents, routine: { ...routine, agents: states } }
}

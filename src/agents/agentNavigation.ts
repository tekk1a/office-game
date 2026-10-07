import type { Agent, AgentMovement, AgentPosition, MovementDestination } from './agentTypes'
import { CORRIDOR_Z, destinationPosition } from './officeWaypoints'

export const WALK_SPEED = 1.15 // metres per second
export const DESK_ROTATION_Y = -0.59
const ROTATION_RESPONSE = 9

export function angleDifference(target: number, current: number) {
  return Math.atan2(Math.sin(target - current), Math.cos(target - current))
}

export function createMovement(agent: Agent, destination: MovementDestination): AgentMovement | null {
  if (agent.movement) return null // Complete the current route before accepting another.
  const target = destinationPosition(agent.id, destination)
  const candidates: AgentPosition[] = [
    [agent.position[0], 0, CORRIDOR_Z],
    [target[0], 0, CORRIDOR_Z],
    [...target],
  ]
  // Every trip exits vertically to the aisle before crossing the office.
  let previous = agent.position
  const route = candidates.filter((point) => {
    if (Math.hypot(point[0] - previous[0], point[2] - previous[2]) < 0.001) return false
    previous = point
    return true
  })
  // A command for the location already occupied should not cause a round trip.
  if (Math.hypot(target[0] - agent.position[0], target[2] - agent.position[2]) < 0.001) return null
  return {
    destination,
    route,
    finalStatus: destination === 'desk' && agent.id !== 'marketing' ? 'working' : 'idle',
    finalRotationY: destination === 'desk' ? DESK_ROTATION_Y : null,
  }
}

export function stepAgent(agent: Agent, delta: number): Agent {
  const movement = agent.movement
  if (!movement) return agent
  let position: AgentPosition = [...agent.position]
  let rotationY = agent.rotationY
  let route = movement.route
  let remaining = Math.max(0, delta)
  while (route.length > 0 && remaining > 0) {
    const point = route[0]
    const dx = point[0] - position[0]
    const dz = point[2] - position[2]
    const distance = Math.hypot(dx, dz)
    const travelTime = Math.min(remaining, distance / WALK_SPEED)
    const fraction = distance < 1e-9 ? 1 : Math.min(1, WALK_SPEED * travelTime / distance)
    position = [position[0] + dx * fraction, position[1] + (point[1] - position[1]) * fraction, position[2] + dz * fraction]
    const heading = Math.atan2(-dx, -dz) // Character's forward direction is local -Z.
    rotationY += angleDifference(heading, rotationY) * (1 - Math.exp(-ROTATION_RESPONSE * travelTime))
    remaining -= travelTime
    if (distance - WALK_SPEED * travelTime < 1e-9) {
      position = [...point]
      route = route.slice(1)
    } else break
  }
  if (route.length === 0 && movement.finalRotationY !== null) {
    rotationY += angleDifference(movement.finalRotationY, rotationY) * (1 - Math.exp(-ROTATION_RESPONSE * remaining))
  }
  const arrived = route.length === 0 && (movement.finalRotationY === null || Math.abs(angleDifference(movement.finalRotationY, rotationY)) < 0.015)
  return {
    ...agent,
    position,
    rotationY: arrived && movement.finalRotationY !== null ? movement.finalRotationY : rotationY,
    status: arrived ? movement.finalStatus : 'walking',
    movement: arrived ? null : { ...movement, route },
  }
}


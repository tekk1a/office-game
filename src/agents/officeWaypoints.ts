import { agentPositions } from './agentPositions'
import type { AgentId, AgentPosition, MovementDestination } from './agentTypes'
import { officeLayout } from '../components/office/officeLayout'

// Reserved navigation locations, not new furniture. One unit is one metre.
export const CORRIDOR_Z = 0.5
export const officeWaypoints = {
  DESK_DEVELOPER: agentPositions.developer.position,
  DESK_MARKETING: agentPositions.marketing.position,
  DESK_RESEARCH: agentPositions.research.position,
  DESK_DEVELOPER_EXIT: [agentPositions.developer.position[0], 0, CORRIDOR_Z],
  DESK_MARKETING_EXIT: [agentPositions.marketing.position[0], 0, CORRIDOR_Z],
  DESK_RESEARCH_EXIT: [agentPositions.research.position[0], 0, CORRIDOR_Z],
  CENTER: [0, 0, CORRIDOR_Z],
  MEETING_AREA: [2.8, 0, officeLayout.depth / 2 - 2.1],
  COFFEE_AREA: [-officeLayout.width / 2 + 1.7, 0, 1.2],
  IDLE_AREA: [-2, 0, 2.6],
} satisfies Record<string, AgentPosition>

export function destinationPosition(id: AgentId, destination: MovementDestination): AgentPosition {
  if (destination === 'desk') return agentPositions[id].position
  const points = {
    center: officeWaypoints.CENTER,
    meeting: officeWaypoints.MEETING_AREA,
    coffee: officeWaypoints.COFFEE_AREA,
    idle: officeWaypoints.IDLE_AREA,
  }
  return points[destination]
}

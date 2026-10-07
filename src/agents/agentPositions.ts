import { officeLayout } from '../components/office/officeLayout'
import type { AgentId, AgentPosition } from './agentTypes'

type AgentPlacement = {
  stationId: string
  position: AgentPosition
  rotationY: number
}

function besideChair(station: (typeof officeLayout.stations)[number]): AgentPosition {
  // Stand on the rug, to the left of the chair; the central aisle stays free.
  return [station.x - 0.9, 0.025, station.z + 1.15]
}

export const agentPositions: Record<AgentId, AgentPlacement> = {
  developer: {
    stationId: officeLayout.stations[0].id,
    position: besideChair(officeLayout.stations[0]),
    rotationY: -0.59,
  },
  marketing: {
    stationId: officeLayout.stations[1].id,
    position: besideChair(officeLayout.stations[1]),
    rotationY: -Math.PI * 0.75,
  },
  research: {
    stationId: officeLayout.stations[2].id,
    position: besideChair(officeLayout.stations[2]),
    rotationY: -0.59,
  },
}

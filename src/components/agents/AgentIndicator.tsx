import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Vector3 } from 'three'
import type { AgentId } from '../../agents/agentTypes'
import { useAgentStore } from '../../agents/useAgentStore'
import { officeTheme } from '../../theme/officeTheme'
import { StatusBadge } from '../ui/StatusBadge'

function AgentIndicator({ id }: { id: AgentId }) {
  const name = useAgentStore((state) => state.agents.find((agent) => agent.id === id)?.name)
  const status = useAgentStore((state) => state.agents.find((agent) => agent.id === id)?.status)
  const selected = useAgentStore((state) => state.selectedAgentId === id)
  const hovered = useAgentStore((state) => state.hoveredAgentId === id)
  if (!status) return null
  return (
    <div id={`agent-indicator-${id}`} className="agent-world-label" data-selected={selected} data-hovered={hovered}>
      <strong>{name}</strong>
      <StatusBadge status={status} />
    </div>
  )
}

// Labels share the main React DOM root: no nested roots or pointer interception.
export function AgentIndicators() {
  const ids = useAgentStore(useShallow((state) => state.agents.map((agent) => agent.id)))
  return <div className="agent-indicators">{ids.map((id) => <AgentIndicator key={id} id={id} />)}</div>
}

// Only presentation coordinates are projected; the store owns world positions.
export function AgentIndicatorPositions() {
  const projected = useRef(new Vector3())
  useFrame(({ camera, size }) => {
    for (const agent of useAgentStore.getState().agents) {
      const label = document.getElementById(`agent-indicator-${agent.id}`)
      if (!label) continue
      projected.current.set(agent.position[0], agent.position[1] + officeTheme.sizes.labelHeight, agent.position[2]).project(camera)
      const { x, y, z } = projected.current
      label.style.transform = `translate(${(x + 1) * size.width / 2}px, ${(1 - y) * size.height / 2}px) translate(-50%, -50%)`
      label.style.visibility = z < -1 || z > 1 ? 'hidden' : 'visible'
    }
  })
  return null
}

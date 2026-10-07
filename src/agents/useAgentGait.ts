import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { AgentId } from './agentTypes'
import { useAgentStore } from './useAgentStore'

// Presentation only: this hook never changes position, route or agent status.
export function useAgentGait(id: AgentId) {
  const body = useRef<Group>(null)
  const phase = useRef(0)
  const amplitude = useRef(0)
  useFrame((state, delta) => {
    const agent = useAgentStore.getState().agents.find((item) => item.id === id)
    const moving = agent?.status === 'walking' && !!agent.movement?.route.length
    const dt = Math.min(delta, 0.05)
    amplitude.current += ((moving ? 1 : 0) - amplitude.current) * (1 - Math.exp(-12 * dt))
    if (amplitude.current < 0.001 && !moving) amplitude.current = 0
    if (moving) phase.current += dt * 8
    const swing = Math.sin(phase.current) * amplitude.current
    const group = body.current
    if (!group) return
    for (const side of [-1, 1]) {
      const leg = group.getObjectByName(`agent-leg-${side}`)
      const arm = group.getObjectByName(`agent-arm-${side}`)
      if (leg) leg.rotation.x = side * swing * 0.24
      if (arm) arm.rotation.x = -side * swing * 0.28
    }
    group.position.y = Math.abs(Math.sin(phase.current)) * 0.018 * amplitude.current
    group.rotation.z = swing * 0.012
    if (amplitude.current > 0 || moving) state.invalidate()
  })
  return body
}

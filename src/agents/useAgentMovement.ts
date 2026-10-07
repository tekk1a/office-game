import { useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useAgentStore } from './useAgentStore'

// One movement clock for all agents. The canvas rests again after arrival.
export function useAgentMovement() {
  const moving = useAgentStore((state) => state.agents.some((agent) => agent.movement !== null))
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => { if (moving) invalidate() }, [moving, invalidate])

  useFrame((state, delta) => {
    const store = useAgentStore.getState()
    if (!store.agents.some((agent) => agent.movement)) return
    // Avoid large jumps after a suspended/background tab; normal frames use delta time.
    store.advanceMovement(Math.min(delta, 0.05))
    state.invalidate()
  }, -2)
}

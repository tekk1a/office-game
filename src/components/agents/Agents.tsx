import { useAgentMovement } from '../../agents/useAgentMovement'
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useAgentStore } from '../../agents/useAgentStore'
import { AgentCharacter } from './AgentCharacter'

export function Agents() {
  useAgentMovement()
  const agents = useAgentStore((state) => state.agents)
  const hoveredAgentId = useAgentStore((state) => state.hoveredAgentId)
  const get = useThree((state) => state.get)

  useEffect(() => {
    const canvas = get().gl.domElement
    const previousCursor = canvas.style.cursor
    canvas.style.cursor = hoveredAgentId ? 'pointer' : 'auto'
    return () => { canvas.style.cursor = previousCursor }
  }, [get, hoveredAgentId])

  return (
    <group name="agents">
      {agents.map((agent) => <AgentCharacter key={agent.id} agent={agent} />)}
    </group>
  )
}

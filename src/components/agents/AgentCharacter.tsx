import type { ThreeEvent } from '@react-three/fiber'
import type { Agent } from '../../agents/agentTypes'
import { useAgentGait } from '../../agents/useAgentGait'
import { useAgentStore } from '../../agents/useAgentStore'
import { Block } from '../office/Block'

import { officeTheme } from '../../theme/officeTheme'


function Arm({ side, working, skin, shirt, highlighted }: {
  side: number
  working: boolean
  skin: string
  shirt: string
  highlighted: boolean
}) {
  return (
    <group rotation={[working ? 0.42 : 0.02, 0, side * 0.06]}>
      <mesh position={[0, -0.15, 0]} castShadow>
        <capsuleGeometry args={[0.066, 0.18, 3, 6]} />
        <meshStandardMaterial color={shirt} {...officeTheme.materials.character} emissive={shirt} emissiveIntensity={highlighted ? 0.2 : 0} />
      </mesh>
      <group position={[0, -0.3, 0]} rotation={[working ? 0.9 : 0.08, 0, 0]}>
        <mesh position={[0, -0.135, 0]} castShadow>
          <capsuleGeometry args={[0.057, 0.16, 3, 6]} />
          <meshStandardMaterial color={skin} {...officeTheme.materials.character} />
        </mesh>
        <mesh position={[0, -0.29, 0]} castShadow>
          <sphereGeometry args={[0.065, 6, 4]} />
          <meshStandardMaterial color={skin} {...officeTheme.materials.character} flatShading />
        </mesh>
      </group>
    </group>
  )
}

export function AgentCharacter({ agent }: { agent: Agent }) {
  const body = useAgentGait(agent.id)
  const hovered = useAgentStore((state) => state.hoveredAgentId === agent.id)
  const selected = useAgentStore((state) => state.selectedAgentId === agent.id)
  const setHoveredAgent = useAgentStore((state) => state.setHoveredAgent)
  const selectAgent = useAgentStore((state) => state.selectAgent)
  const { shirt, skin, hair } = officeTheme.agents[agent.id]
  const working = agent.status === 'working'

  function hover(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation()
    setHoveredAgent(agent.id)
  }

  function leave() {
    if (useAgentStore.getState().hoveredAgentId === agent.id) {
      setHoveredAgent(null)
    }
  }

  function select(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()
    // Dragging the camera across a character must not select it.
    if (event.delta <= 2) selectAgent(agent.id)
  }

  return (
    <group
      name={`agent-${agent.id}`}
      position={agent.position}
      rotation={[0, agent.rotationY, 0]}
      userData={{ agentId: agent.id, status: agent.status, provisional: true }}
      onPointerOver={hover}
      onPointerOut={leave}
      onClick={select}
    >
      {(hovered || selected) && (
        <mesh name={selected ? "agent-selection-ring" : "agent-hover-ring"} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} raycast={() => {}}>
          <ringGeometry args={selected ? [0.4, 0.49, 32] : [0.38, 0.43, 24]} />
          <meshBasicMaterial color={selected ? officeTheme.scene.selected : shirt} transparent opacity={selected ? 0.95 : 0.65} depthWrite={false} />
        </mesh>
      )}
      {selected && (
        <mesh name="agent-selection-inner-ring" rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]} raycast={() => {}}>
          <ringGeometry args={[0.375, 0.395, 32]} />
          <meshBasicMaterial color={officeTheme.scene.selectionInner} depthWrite={false} />
        </mesh>
      )}

      <group ref={body} name="agent-body">
        {[-1, 1].map((side) => (
          <group key={side} name={`agent-leg-${side}`} position={[0, 0.83, 0]}>
            <Block size={[0.16, 0.13, 0.3]} position={[side * 0.1, -0.765, -0.035]} color={officeTheme.scene.shoes} />
            <mesh position={[side * 0.1, -0.365, 0]} castShadow>
              <cylinderGeometry args={[0.085, 0.075, 0.68, 6]} />
              <meshStandardMaterial color={officeTheme.scene.pants} {...officeTheme.materials.character} flatShading />
            </mesh>
          </group>
        ))}
        <Block size={[0.33, 0.2, 0.23]} position={[0, 0.83, 0]} color={officeTheme.scene.pants} />
        <group name="agent-upper-body" position={[0, 0.92, 0]} rotation={[working ? 0.06 : 0, 0, 0]}>
          <mesh name="agent-torso" position={[0, 0.235, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.18, 0.47, 6]} />
            <meshStandardMaterial color={shirt} {...officeTheme.materials.character} flatShading emissive={shirt} emissiveIntensity={selected ? 0.3 : hovered ? 0.2 : 0} />
          </mesh>
          <mesh position={[0, 0.51, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.065, 0.08, 6]} />
            <meshStandardMaterial color={skin} {...officeTheme.materials.character} />
          </mesh>
          <group name="agent-head" position={[0, 0.67, 0]} rotation={[working ? 0.08 : 0, 0, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.16, 8, 6]} />
              <meshStandardMaterial color={skin} {...officeTheme.materials.character} flatShading />
            </mesh>
            <mesh position={[0, 0.003, 0]} castShadow>
              <sphereGeometry args={[0.166, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={hair} {...officeTheme.materials.character} flatShading />
            </mesh>
            <Block name="agent-nose" size={[0.045, 0.045, 0.04]} position={[0, -0.015, -0.153]} color={skin} />
            {[-1, 1].map((side) => (
              <Block key={side} size={[0.025, 0.018, 0.012]} position={[side * 0.057, 0.005, -0.148]} color={officeTheme.scene.eyes} castShadow={false} />
            ))}
          </group>
          {[-1, 1].map((side) => (
            <group key={side} name={`agent-arm-${side}`} position={[side * 0.245, 0.385, 0]}>
              <Arm side={side} working={working} skin={skin} shirt={shirt} highlighted={hovered || selected} />
            </group>
          ))}
        </group>
      </group>
    </group>
  )
}

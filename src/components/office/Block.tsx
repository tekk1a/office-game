import { officeTheme } from '../../theme/officeTheme'
import type { ThreeElements } from '@react-three/fiber'

type BlockProps = {
  size: [number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
  color: string
  name?: string
  castShadow?: boolean
  receiveShadow?: boolean
  materialProps?: ThreeElements['meshStandardMaterial']
}

export function Block({
  size,
  position,
  rotation,
  color,
  name,
  castShadow = true,
  receiveShadow = true,
  materialProps,
}: BlockProps) {
  return (
    <mesh name={name} position={position} rotation={rotation} castShadow={castShadow} receiveShadow={receiveShadow}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={officeTheme.materials.wood.roughness} {...materialProps} />
    </mesh>
  )
}

import { Block } from './Block'
import { officeLayout } from './officeLayout'
import { officeTheme } from '../../theme/officeTheme'

export function Computer() {
  const c = officeTheme.scene
  return (
    <group name="computer" position={[0, officeLayout.desk.height, -0.15]}>
      <Block size={[0.3, 0.025, 0.2]} position={[0, 0.018, 0]} color={c.metalEdge} />
      <Block size={[0.055, 0.19, 0.055]} position={[0, 0.12, -0.04]} color={c.metal} />
      <Block name="monitor" size={[0.82, 0.48, 0.055]} position={[0, 0.41, -0.04]} color={c.black} />
      <Block size={[0.75, 0.4, 0.006]} position={[0, 0.415, -0.008]} color={c.screen} materialProps={{ ...officeTheme.materials.screen, emissive: c.screen }} />
      <Block size={[0.15, 0.32, 0.003]} position={[-0.27, 0.415, -0.003]} color={c.screenSoft} castShadow={false} />
      <Block size={[0.42, 0.035, 0.003]} position={[0.06, 0.54, -0.003]} color={c.screenAccent} castShadow={false} materialProps={{ emissive: c.screenAccent, emissiveIntensity: 0.3 }} />
      {[0.06, 0.105, 0.15, 0.1].map((height, index) => (
        <Block key={index} size={[0.06, height, 0.003]} position={[-0.075 + index * 0.1, 0.3 + height / 2, -0.003]} color={c.screenSoft} castShadow={false} />
      ))}
      <Block name="keyboard" size={[0.43, 0.025, 0.16]} position={[0, 0.018, 0.36]} color={c.black} />
      <Block size={[0.36, 0.006, 0.1]} position={[0, 0.035, 0.36]} color={c.metalEdge} />
      <mesh position={[0.36, 0.025, 0.36]} scale={[1, 0.45, 1.5]} castShadow>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color={c.black} />
      </mesh>
    </group>
  )
}

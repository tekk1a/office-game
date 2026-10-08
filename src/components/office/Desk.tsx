import { Block } from './Block'
import { officeLayout } from './officeLayout'
import { officeTheme } from '../../theme/officeTheme'

export function Desk() {
  const { width, depth, height } = officeLayout.desk
  const c = officeTheme.scene
  return (
    <group name="desk">
      <Block name="desktop" size={[width, 0.08, depth]} position={[0, height - 0.04, 0]} color={c.wood} materialProps={officeTheme.materials.wood} />
      <Block size={[width - 0.12, 0.035, depth - 0.1]} position={[0, height - 0.1, 0]} color={c.metal} />
      {[-0.79, 0.79].flatMap((x) => [-0.29, 0.29].map((z) => (
        <Block key={`${x}-${z}`} size={[0.07, height - 0.12, 0.07]} position={[x, (height - 0.12) / 2, z]} color={c.metalEdge} materialProps={officeTheme.materials.metal} />
      )))}
      <Block size={[0.65, 0.006, 0.33]} position={[0.13, height + 0.005, 0.17]} color={c.black} castShadow={false} />
      <Block size={[0.28, 0.018, 0.2]} position={[-0.56, height + 0.012, 0.12]} color={c.metalEdge} />
      <Block size={[0.25, 0.01, 0.18]} position={[-0.56, height + 0.027, 0.12]} color={c.paper} />
      <group position={[0.65, height, -0.12]} name="desk-cup">
        <mesh position={[0, 0.055, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.11, 12]} />
          <meshStandardMaterial color={c.ceramic} {...officeTheme.materials.ceramic} />
        </mesh>
        <mesh position={[0.045, 0.06, 0]}>
          <torusGeometry args={[0.026, 0.008, 6, 10]} />
          <meshStandardMaterial color={c.ceramic} />
        </mesh>
      </group>
      <group name="desk-lamp" position={[-0.7, height, -0.26]}>
        <Block size={[0.18, 0.022, 0.14]} position={[0, 0.015, 0]} color={c.black} />
        <Block size={[0.025, 0.29, 0.025]} position={[0, 0.16, 0]} color={c.metalEdge} />
        <Block size={[0.22, 0.035, 0.08]} position={[0.085, 0.31, 0]} color={c.metal} />
        <Block size={[0.17, 0.005, 0.045]} position={[0.085, 0.29, 0]} color={c.warm} castShadow={false} materialProps={{ emissive: c.warm, emissiveIntensity: 0.5 }} />
      </group>
    </group>
  )
}

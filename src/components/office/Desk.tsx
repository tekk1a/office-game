import { Block } from './Block'
import { officeLayout } from './officeLayout'

export function Desk() {
  const { width, depth, height } = officeLayout.desk

  return (
    <group name="desk">
      <Block name="desktop" size={[width, 0.08, depth]} position={[0, height - 0.04, 0]} color="#dfba8b" />
      <Block size={[width - 0.12, 0.035, depth - 0.1]} position={[0, height - 0.1, 0]} color="#4a5758" />
      {[-0.79, 0.79].flatMap((x) =>
        [-0.29, 0.29].map((z) => (
          <Block key={`${x}-${z}`} size={[0.07, height - 0.12, 0.07]} position={[x, (height - 0.12) / 2, z]} color="#566366" />
        )),
      )}
      <Block size={[0.28, 0.018, 0.2]} position={[-0.56, height + 0.012, 0.12]} color="#71879a" />
      <Block size={[0.25, 0.01, 0.18]} position={[-0.56, height + 0.027, 0.12]} color="#f6f0df" />
      <group position={[0.65, height, -0.12]} name="desk-cup">
        <mesh position={[0, 0.055, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.11, 12]} />
          <meshStandardMaterial color="#f6f2e9" />
        </mesh>
        <mesh position={[0.045, 0.06, 0]}>
          <torusGeometry args={[0.026, 0.008, 6, 10]} />
          <meshStandardMaterial color="#f6f2e9" />
        </mesh>
      </group>
    </group>
  )
}

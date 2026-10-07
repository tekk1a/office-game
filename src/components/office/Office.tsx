import { Block } from './Block'
import { Plant } from './Plant'
import { Workstation } from './Workstation'
import { officeLayout } from './officeLayout'

function Room() {
  const { width, depth, wallHeight } = officeLayout

  return (
    <group name="room">
      <Block name="floor-base" size={[width + 0.12, 0.24, depth + 0.12]} position={[0, -0.16, 0]} color="#7b8c89" castShadow={false} />
      <Block name="floor" size={[width, 0.08, depth]} position={[0, -0.04, 0]} color="#ece2d0" castShadow={false} />
      {[-3, -1.5, 0, 1.5, 3].map((z) => (
        <Block key={z} size={[width - 0.06, 0.003, 0.012]} position={[0, 0.002, z]} color="#d8cfbf" castShadow={false} />
      ))}
      <Block name="back-wall" size={[width, wallHeight, 0.16]} position={[0, wallHeight / 2, -depth / 2]} color="#e7ede5" />
      <Block name="left-wall" size={[0.16, wallHeight, depth]} position={[-width / 2, wallHeight / 2, 0]} color="#d6e0d7" />
      <Block size={[width, 0.06, 0.18]} position={[0, wallHeight, -depth / 2]} color="#a7c1b4" />
      <Block size={[0.18, 0.06, depth]} position={[-width / 2, wallHeight, 0]} color="#a7c1b4" />
      <Block size={[width - 0.1, 0.1, 0.03]} position={[0, 0.07, -depth / 2 + 0.095]} color="#acbcb0" />
      <Block size={[0.03, 0.1, depth - 0.1]} position={[-width / 2 + 0.095, 0.07, 0]} color="#acbcb0" />
    </group>
  )
}

function Decoration() {
  return (
    <group name="decoration">
      <group position={[-5.88, 0.98, 0.3]} rotation={[0, Math.PI / 2, 0]} name="wall-art">
        <Block size={[1.2, 0.67, 0.055]} color="#b79a7b" />
        <Block size={[1.08, 0.55, 0.008]} position={[0, 0, 0.033]} color="#f6f0de" />
        <mesh position={[-0.19, 0.05, 0.04]}>
          <circleGeometry args={[0.17, 16]} />
          <meshStandardMaterial color="#d6a076" />
        </mesh>
        <Block size={[0.33, 0.22, 0.004]} position={[0.21, -0.12, 0.04]} color="#8eac9a" castShadow={false} />
      </group>
      <group name="storage" position={[-5.3, 0, 1.2]}>
        <Block size={[0.65, 0.72, 1.9]} position={[0, 0.36, 0]} color="#b7cbbf" />
        <Block size={[0.72, 0.07, 2]} position={[0, 0.755, 0]} color="#d9b88e" />
        {[-0.55, 0, 0.55].map((z) => (
          <Block key={z} size={[0.025, 0.03, 0.17]} position={[0.336, 0.55, z]} color="#667b71" />
        ))}
        <Plant position={[0, 0.79, -0.57]} scale={0.42} potColor="#f1e9d8" />
        <Block size={[0.27, 0.08, 0.32]} position={[0, 0.83, 0.47]} color="#8197a3" />
        <Block size={[0.27, 0.04, 0.32]} position={[0.025, 0.89, 0.47]} color="#d4a688" />
      </group>
      <Plant position={[-5.15, 0, -3.55]} scale={1.1} />
      <Plant position={[5.15, 0, -3.55]} scale={1.15} potColor="#e8d8bd" />
      <Plant position={[-5.2, 0, 3.5]} scale={0.85} potColor="#e8d8bd" />
      <Plant position={[5.2, 0, 3.45]} scale={1.2} />
    </group>
  )
}

export function Office() {
  return (
    <group name="office">
      <Room />
      {officeLayout.stations.map((station) => <Workstation key={station.id} station={station} />)}
      <Decoration />
    </group>
  )
}

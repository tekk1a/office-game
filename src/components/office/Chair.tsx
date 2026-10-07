import { Block } from './Block'

export function Chair({ color }: { color: string }) {
  return (
    <group name="chair" position={[0, 0, 1.05]}>
      <Block size={[0.5, 0.1, 0.48]} position={[0, 0.48, 0]} color={color} />
      <Block size={[0.5, 0.48, 0.09]} position={[0, 0.79, 0.23]} rotation={[-0.08, 0, 0]} color={color} />
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 0.36, 8]} />
        <meshStandardMaterial color="#596569" metalness={0.35} roughness={0.6} />
      </mesh>
      <Block size={[0.62, 0.05, 0.07]} position={[0, 0.09, 0]} color="#4b575c" />
      <Block size={[0.07, 0.05, 0.62]} position={[0, 0.09, 0]} color="#4b575c" />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Block size={[0.035, 0.19, 0.035]} position={[side * 0.28, 0.59, 0.07]} color="#596569" />
          <Block size={[0.07, 0.04, 0.3]} position={[side * 0.28, 0.7, 0.04]} color="#48565b" />
          <Block size={[0.085, 0.075, 0.07]} position={[side * 0.28, 0.04, 0]} color="#343f45" />
          <Block size={[0.07, 0.075, 0.085]} position={[0, 0.04, side * 0.28]} color="#343f45" />
        </group>
      ))}
    </group>
  )
}

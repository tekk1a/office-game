import { Block } from './Block'
import { officeLayout } from './officeLayout'

export function Computer() {
  return (
    <group name="computer" position={[0, officeLayout.desk.height, -0.15]}>
      <Block size={[0.3, 0.025, 0.2]} position={[0, 0.018, 0]} color="#46565e" />
      <Block size={[0.055, 0.19, 0.055]} position={[0, 0.12, -0.04]} color="#46565e" />
      <Block name="monitor" size={[0.82, 0.48, 0.055]} position={[0, 0.41, -0.04]} color="#3b4b54" />
      <Block size={[0.75, 0.4, 0.006]} position={[0, 0.415, -0.008]} color="#c5e3df" materialProps={{ emissive: '#a6d9d0', emissiveIntensity: 0.18 }} />
      <Block size={[0.15, 0.32, 0.003]} position={[-0.27, 0.415, -0.003]} color="#6c999a" castShadow={false} />
      <Block size={[0.42, 0.055, 0.003]} position={[0.06, 0.54, -0.003]} color="#e8f3ec" castShadow={false} />
      {[0.06, 0.105, 0.15, 0.1].map((height, index) => (
        <Block key={index} size={[0.06, height, 0.003]} position={[-0.075 + index * 0.1, 0.3 + height / 2, -0.003]} color="#639c92" castShadow={false} />
      ))}
      <Block name="keyboard" size={[0.43, 0.025, 0.16]} position={[0, 0.018, 0.36]} color="#50626a" />
      <Block size={[0.36, 0.006, 0.1]} position={[0, 0.035, 0.36]} color="#a9bbbc" />
      <mesh position={[0.36, 0.025, 0.36]} scale={[1, 0.45, 1.5]} castShadow>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color="#50626a" />
      </mesh>
    </group>
  )
}

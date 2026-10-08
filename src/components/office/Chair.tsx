import { officeTheme } from '../../theme/officeTheme'
import { Block } from './Block'

export function Chair({ color }: { color: string }) {
  return (
    <group name="chair" position={[0, 0, 1.05]}>
      <Block size={[0.5, 0.1, 0.48]} position={[0, 0.48, 0]} color={color} materialProps={officeTheme.materials.upholstery} />
      <Block size={[0.5, 0.48, 0.09]} position={[0, 0.79, 0.23]} rotation={[-0.08, 0, 0]} color={color} materialProps={officeTheme.materials.upholstery} />
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 0.36, 8]} />
        <meshStandardMaterial color={officeTheme.scene.metalEdge} {...officeTheme.materials.metal} />
      </mesh>
      <Block size={[0.62, 0.05, 0.07]} position={[0, 0.09, 0]} color={officeTheme.scene.metal} />
      <Block size={[0.07, 0.05, 0.62]} position={[0, 0.09, 0]} color={officeTheme.scene.metal} />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Block size={[0.035, 0.19, 0.035]} position={[side * 0.28, 0.59, 0.07]} color={officeTheme.scene.metalEdge} />
          <Block size={[0.07, 0.04, 0.3]} position={[side * 0.28, 0.7, 0.04]} color={officeTheme.scene.black} />
          <Block size={[0.085, 0.075, 0.07]} position={[side * 0.28, 0.04, 0]} color={officeTheme.scene.black} />
          <Block size={[0.07, 0.075, 0.085]} position={[0, 0.04, side * 0.28]} color={officeTheme.scene.black} />
        </group>
      ))}
    </group>
  )
}

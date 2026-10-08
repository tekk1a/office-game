import { Block } from './Block'
import { Chair } from './Chair'
import { officeTheme as theme } from '../../theme/officeTheme'

const colors = theme.scene

export function MeetingArea() {
  return (
    <group name="meeting-area">
      <Block size={[3.5, 0.012, 2.7]} position={[3.8, 0.007, 2.05]} color={colors.meetingRug} castShadow={false} />
      <group name="meeting-table" position={[4.15, 0, 1.65]}>
        <Block size={[1.45, 0.07, 1.3]} position={[0, 0.715, 0]} color={colors.wood} materialProps={theme.materials.wood} />
        <Block size={[0.55, 0.67, 0.55]} position={[0, 0.335, 0]} color={colors.metal} materialProps={theme.materials.metal} />
        <Block size={[0.32, 0.012, 0.24]} position={[-0.25, 0.758, 0.15]} color={colors.paper} />
        <Block size={[0.06, 0.17, 0.34]} position={[0.3, 0.835, -0.26]} color={colors.black} />
        <Block size={[0.006, 0.13, 0.29]} position={[0.265, 0.84, -0.26]} color={colors.screenAccent} materialProps={{ emissive: colors.screenAccent, emissiveIntensity: 0.2 }} />
      </group>
      <group name="meeting-chair" position={[4.15, 0, 1.8]}><Chair color={colors.upholstery} /></group>
      <group name="meeting-chair" position={[4.2, 0, 1.65]} rotation={[0, Math.PI / 2, 0]}><Chair color={colors.upholstery} /></group>
    </group>
  )
}

export function LoungeArea() {
  return (
    <group name="lounge-area">
      <Block size={[2.5, 0.012, 2.1]} position={[-3.5, 0.007, 3.2]} color={colors.loungeRug} castShadow={false} />
      <group name="lounge-bench" position={[-3.5, 0, 3.55]}>
        <Block size={[1.5, 0.12, 0.62]} position={[0, 0.37, 0]} color={colors.metal} />
        <Block size={[1.45, 0.12, 0.59]} position={[0, 0.47, -0.02]} color={colors.upholstery} materialProps={theme.materials.upholstery} />
        <Block size={[1.5, 0.39, 0.12]} position={[0, 0.62, 0.25]} color={colors.upholstery} />
        {[-0.55, 0.55].map((x) => <Block key={x} size={[0.08, 0.3, 0.48]} position={[x, 0.15, 0]} color={colors.metal} />)}
      </group>
      <group name="lounge-table" position={[-3.5, 0, 2.65]}>
        <Block size={[0.68, 0.05, 0.5]} position={[0, 0.43, 0]} color={colors.wood} />
        <Block size={[0.1, 0.41, 0.1]} position={[0, 0.205, 0]} color={colors.metal} />
        <Block size={[0.35, 0.03, 0.28]} position={[0, 0.015, 0]} color={colors.metal} />
      </group>
    </group>
  )
}

export function CoffeeArea() {
  return (
    <group name="coffee-area" position={[-5.3, 0, 1.2]}>
      <Block name="coffee-counter" size={[0.65, 0.72, 1.9]} position={[0, 0.36, 0]} color={colors.wallPanel} />
      <Block size={[0.72, 0.07, 2]} position={[0, 0.755, 0]} color={colors.wood} />
      {[-0.55, 0, 0.55].map((z) => <Block key={z} size={[0.025, 0.03, 0.17]} position={[0.336, 0.55, z]} color={colors.metalEdge} />)}
      <group name="coffee-machine" position={[0, 0.79, 0.35]}>
        <Block size={[0.42, 0.48, 0.43]} position={[0, 0.24, 0]} color={colors.black} />
        <Block size={[0.02, 0.28, 0.34]} position={[0.217, 0.29, 0]} color={colors.metalEdge} />
        <Block size={[0.06, 0.025, 0.25]} position={[0.24, 0.22, 0]} color={colors.black} />
        <Block size={[0.13, 0.025, 0.36]} position={[0.22, 0.015, 0]} color={colors.metal} />
        <Block size={[0.012, 0.05, 0.07]} position={[0.23, 0.405, 0.08]} color={colors.cyan} materialProps={{ emissive: colors.cyan, emissiveIntensity: 0.3 }} />
      </group>
      {[-0.48, -0.67].map((z) => (
        <mesh key={z} position={[0.12, 0.85, z]} castShadow>
          <cylinderGeometry args={[0.055, 0.044, 0.12, 12]} />
          <meshStandardMaterial color={colors.ceramic} {...theme.materials.ceramic} />
        </mesh>
      ))}
    </group>
  )
}

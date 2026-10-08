import { Block } from './Block'
import { FloorPanels } from './FloorPanels'
import { Plant } from './Plant'
import { Workstation } from './Workstation'
import { CoffeeArea, LoungeArea, MeetingArea } from './OfficeAreas'
import { officeLayout } from './officeLayout'
import { officeTheme as theme } from '../../theme/officeTheme'

const colors = theme.scene

function Room() {
  const { width, depth, wallHeight } = officeLayout
  return (
    <group name="room">
      <Block name="floor-base" size={[width + 0.12, 0.24, depth + 0.12]} position={[0, -0.16, 0]} color={colors.floorBase} castShadow={false} />
      <Block name="floor" size={[width, 0.08, depth]} position={[0, -0.052, 0]} color={colors.floor} castShadow={false} />
      <FloorPanels />
      <Block name="back-wall" size={[width, wallHeight, 0.16]} position={[0, wallHeight / 2, -depth / 2]} color={colors.wall} />
      <Block name="left-wall" size={[0.16, wallHeight, depth]} position={[-width / 2, wallHeight / 2, 0]} color={colors.wallSide} />
      {officeLayout.stations.map((station) => (
        <group key={station.id} position={[station.x, 0, -depth / 2 + 0.095]}>
          <Block size={[2.6, 1.02, 0.035]} position={[0, 0.86, 0]} color={colors.wallPanel} />
          <Block size={[2.35, 0.025, 0.008]} position={[0, 1.24, 0.024]} color={colors.cyan} materialProps={{ emissive: colors.cyan, emissiveIntensity: 0.22 }} castShadow={false} />
        </group>
      ))}
      {[-3.7, -3.45, -3.2, -2.95].map((z) => <Block key={z} size={[0.04, 1.25, 0.08]} position={[-width / 2 + 0.11, 0.77, z]} color={colors.wood} />)}
      <Block size={[width, 0.06, 0.18]} position={[0, wallHeight, -depth / 2]} color={colors.wallTrim} />
      <Block size={[0.18, 0.06, depth]} position={[-width / 2, wallHeight, 0]} color={colors.wallTrim} />
      <Block size={[width - 0.1, 0.1, 0.03]} position={[0, 0.07, -depth / 2 + 0.095]} color={colors.metal} />
      <Block size={[0.03, 0.1, depth - 0.1]} position={[-width / 2 + 0.095, 0.07, 0]} color={colors.metal} />
      {[0, 1].map((z) => <Block key={z} size={[10.3, 0.002, 0.014]} position={[0, 0.002, z]} color={colors.wallTrim} castShadow={false} />)}
    </group>
  )
}

function Decoration() {
  return (
    <group name="decoration">
      <group position={[-5.88, 1.02, 0.3]} rotation={[0, Math.PI / 2, 0]} name="wall-art">
        <Block size={[1.2, 0.67, 0.055]} color={colors.metal} />
        <Block size={[1.08, 0.55, 0.008]} position={[0, 0, 0.033]} color={colors.wallPanel} />
        <mesh position={[-0.19, 0.05, 0.04]}>
          <circleGeometry args={[0.17, 16]} />
          <meshStandardMaterial color={colors.art} roughness={0.8} />
        </mesh>
        <Block size={[0.33, 0.02, 0.004]} position={[0.21, -0.12, 0.04]} color={colors.warm} castShadow={false} />
      </group>
      <Plant position={[-5.15, 0, -3.55]} scale={1.1} />
      <Plant position={[5.15, 0, -3.55]} scale={1.15} potColor={colors.potLight} />
      <Plant position={[-5.2, 0, 3.5]} scale={0.85} potColor={colors.potLight} />
      <Plant position={[5.2, 0, 3.45]} scale={1.2} />
    </group>
  )
}

export function Office() {
  return (
    <group name="office">
      <Room />
      {officeLayout.stations.map((station) => <Workstation key={station.id} station={station} />)}
      <CoffeeArea />
      <MeetingArea />
      <LoungeArea />
      <Decoration />
    </group>
  )
}

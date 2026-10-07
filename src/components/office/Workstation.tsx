import { Block } from './Block'
import { Chair } from './Chair'
import { Computer } from './Computer'
import { Desk } from './Desk'
import type { officeLayout } from './officeLayout'

type WorkstationProps = {
  station: (typeof officeLayout.stations)[number]
}

export function Workstation({ station }: WorkstationProps) {
  return (
    <group name={`workstation-${station.id}`} position={[station.x, 0, station.z]}>
      <Block name="station-rug" size={[2.5, 0.018, 2.4]} position={[0, 0.014, 0.35]} color={station.rug} castShadow={false} />
      <Desk />
      <Chair color={station.color} />
      <Computer />
    </group>
  )
}

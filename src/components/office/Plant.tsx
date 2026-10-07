type PlantProps = {
  position: [number, number, number]
  scale?: number
  potColor?: string
}

const foliage: [number, number, number, number][] = [
  [0, 1.04, 0, 0.36],
  [-0.2, 0.83, 0.04, 0.29],
  [0.22, 0.86, 0.07, 0.3],
  [-0.04, 0.87, -0.22, 0.27],
  [0.04, 0.77, 0.23, 0.27],
]

export function Plant({ position, scale = 1, potColor = '#bc8568' }: PlantProps) {
  return (
    <group name="plant" position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.17, 0.44, 10]} />
        <meshStandardMaterial color={potColor} flatShading />
      </mesh>
      <mesh position={[0, 0.43, 0]}>
        <cylinderGeometry args={[0.21, 0.21, 0.025, 10]} />
        <meshStandardMaterial color="#605546" />
      </mesh>
      <mesh position={[0, 0.67, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.035, 0.5, 6]} />
        <meshStandardMaterial color="#748265" />
      </mesh>
      {foliage.map(([x, y, z, radius], index) => (
        <mesh key={index} position={[x, y, z]} scale={[0.9, 1.15, 0.85]} castShadow>
          <icosahedronGeometry args={[radius, 0]} />
          <meshStandardMaterial color={index % 2 === 0 ? '#658c70' : '#82a17b'} flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

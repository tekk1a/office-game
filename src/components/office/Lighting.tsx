export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#fff5e6', '#899d93', 1.8]} />
      <directionalLight
        name="sunlight"
        position={[-3, 9, 5]}
        intensity={2.5}
        color="#fff0d8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-bias={-0.0002}
        shadow-normalBias={0.035}
        shadow-radius={3}
      />
      <directionalLight position={[5, 5, -4]} intensity={0.7} color="#e0efff" />
    </>
  )
}

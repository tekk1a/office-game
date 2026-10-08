import { officeTheme } from '../../theme/officeTheme'

export function Lighting() {
  const light = officeTheme.lighting
  return (
    <>
      <ambientLight intensity={light.ambient} />
      <hemisphereLight args={[light.sky, light.ground, light.hemisphere]} />
      <directionalLight name="sunlight" position={[-3, 9, 5]} intensity={light.keyIntensity} color={light.key} castShadow
        shadow-mapSize={[light.shadowMap, light.shadowMap]}
        shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9}
        shadow-camera-near={0.5} shadow-camera-far={30} shadow-bias={-0.0002} shadow-normalBias={0.035} shadow-radius={light.shadowRadius} />
      <directionalLight position={[5, 5, -4]} intensity={light.fillIntensity} color={light.fill} />
      <pointLight name="coffee-warm-light" position={[-4.8, 2.4, 1.2]} color={light.warm} intensity={light.warmIntensity} distance={4} decay={2} />
    </>
  )
}

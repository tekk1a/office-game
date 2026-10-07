import { useLayoutEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { MathUtils, OrthographicCamera, Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

const focusHeight = 0.45
const startPosition: [number, number, number] = [12, 17.42, 12]
const target: [number, number, number] = [0, focusHeight, 0]

export function OfficeCamera({ resetToken }: { resetToken: number }) {
  const controls = useRef<OrbitControlsImpl>(null)
  const correction = useRef(new Vector3())
  const { get, size, invalidate } = useThree()
  // Fit the full cutaway office, including the walls, at either viewport aspect.
  const fittedZoom = Math.min(size.width / 17.8, size.height / 13.8)

  useLayoutEffect(() => {
    const camera = get().camera
    if (!(camera instanceof OrthographicCamera) || !controls.current) return

    controls.current.enabled = false
    camera.position.set(...startPosition)
    camera.zoom = fittedZoom
    camera.updateProjectionMatrix()
    controls.current.target.set(...target)
    controls.current.update()
    controls.current.saveState()
    controls.current.enabled = true
    invalidate()
  }, [get, fittedZoom, invalidate, resetToken])

  function limitPan() {
    const orbit = controls.current
    if (!orbit) return

    correction.current.copy(orbit.target)
    orbit.target.set(
      MathUtils.clamp(orbit.target.x, -1.2, 1.2),
      focusHeight,
      MathUtils.clamp(orbit.target.z, -1.2, 1.2),
    )
    correction.current.sub(orbit.target)
    orbit.object.position.sub(correction.current)
  }

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={target}
      enableDamping={false}
      enablePan
      screenSpacePanning={false}
      panSpeed={0.45}
      rotateSpeed={0.35}
      zoomSpeed={0.65}
      minZoom={fittedZoom * 0.8}
      maxZoom={fittedZoom * 1.75}
      minPolarAngle={MathUtils.degToRad(38)}
      maxPolarAngle={MathUtils.degToRad(52)}
      minAzimuthAngle={MathUtils.degToRad(25)}
      maxAzimuthAngle={MathUtils.degToRad(65)}
      onChange={limitPan}
    />
  )
}



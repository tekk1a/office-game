import { useLayoutEffect, useRef } from 'react'
import { Color, InstancedMesh, Matrix4 } from 'three'
import { officeTheme } from '../../theme/officeTheme'
import { officeLayout } from './officeLayout'

export function FloorPanels() {
  const mesh = useRef<InstancedMesh>(null)
  const tile = officeTheme.sizes.floorPanel
  const columns = officeLayout.width / tile
  const rows = officeLayout.depth / tile
  useLayoutEffect(() => {
    if (!mesh.current) return
    const matrix = new Matrix4()
    const color = new Color()
    for (let z = 0; z < rows; z++) for (let x = 0; x < columns; x++) {
      const index = z * columns + x
      matrix.makeTranslation(-officeLayout.width / 2 + tile * (x + 0.5), -0.005, -officeLayout.depth / 2 + tile * (z + 0.5))
      mesh.current.setMatrixAt(index, matrix)
      color.set(officeTheme.scene.floorPanels[(x * 2 + z) % officeTheme.scene.floorPanels.length])
      mesh.current.setColorAt(index, color)
    }
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
    mesh.current.computeBoundingSphere()
  }, [columns, rows, tile])

  return (
    <instancedMesh ref={mesh} name="floor-panels" args={[undefined, undefined, columns * rows]} receiveShadow>
      <boxGeometry args={[tile - 0.012, 0.01, tile - 0.012]} />
      <meshStandardMaterial {...officeTheme.materials.floor} />
    </instancedMesh>
  )
}

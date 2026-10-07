import { Canvas } from '@react-three/fiber'
import { useAgentStore } from '../agents/useAgentStore'
import { Agents } from './agents/Agents'
import { Office } from './office/Office'
import { Lighting } from './office/Lighting'
import { OfficeCamera } from './office/OfficeCamera'

export default function OfficeScene({ resetToken }: { resetToken: number }) {
  const clearSelection = useAgentStore((state) => state.clearSelection)
  return (
    <Canvas
      onPointerMissed={(event) => { if (event.button === 0) clearSelection() }}
      orthographic
      shadows="percentage"
      frameloop="demand"
      camera={{ position: [12, 17.42, 12], near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      onCreated={({ gl }) => { gl.domElement.dataset.renderer = 'ready' }}
      fallback={<p className="scene-message" role="status">WebGL indisponível neste navegador.</p>}
      aria-label="Escritório 3D com três agentes provisórios e corredor livre"
    >
      <color attach="background" args={['#dce5e2']} />
      <Lighting />
      <Office />
      <Agents />
      <OfficeCamera resetToken={resetToken} />
    </Canvas>
  )
}




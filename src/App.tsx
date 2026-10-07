import { lazy, Suspense, useState } from 'react'
import { SceneErrorBoundary } from './components/SceneErrorBoundary'
import { AgentPanel } from './components/ui/AgentPanel'
import { TopBar } from './components/ui/TopBar'

const OfficeScene = lazy(() => import('./components/OfficeScene'))

export default function App() {
  const [resetToken, setResetToken] = useState(0)

  return (
    <main className="foundation">
      <header>
        <p className="eyebrow">TEKKIA / OFFICE GAME</p>
        <h1>Um espaço para começar<span>.</span></h1>
        <p className="intro">Escritório com personagens provisórios em escala humana.</p>
      </header>
      <section className="scene-card" aria-label="Protótipo do escritório 3D">
        <div className="scene-heading">
          <div>
            <p className="eyebrow">ETAPA 05</p>
            <h2>O escritório</h2>
          </div>
          <span className="badge">3 estações · 12 × 9 m</span>
        </div>
        <div className="scene-viewport">
          <SceneErrorBoundary>
            <Suspense fallback={<p className="scene-message" role="status">Preparando o escritório…</p>}>
              <OfficeScene resetToken={resetToken} />
            </Suspense>
          </SceneErrorBoundary>
          <TopBar />
          <AgentPanel />
        </div>
        <div className="scene-footer">
          <p>Arraste para girar · Rolagem para zoom · Botão direito para deslocar</p>
          <button type="button" onClick={() => setResetToken((value) => value + 1)}>
            Restaurar câmera
          </button>
        </div>
      </section>
      <footer>Protótipo do ambiente · Escala aproximada de 1 unidade = 1 metro</footer>
    </main>
  )
}



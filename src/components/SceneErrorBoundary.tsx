import { Component } from 'react'
import type { ReactNode } from 'react'

export class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <p className="scene-message" role="alert">
          Não foi possível iniciar a cena 3D. Confira o suporte a WebGL e recarregue a página.
        </p>
      )
    }

    return this.props.children
  }
}

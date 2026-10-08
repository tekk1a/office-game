import { useAgentStore } from '../../agents/useAgentStore'
import type { RoutineMode } from '../../agents/agentRoutine'

const modeLabels: Record<RoutineMode, string> = {
  stopped: 'Simulação local · Pronta',
  running: 'Simulação local · Ativa',
  paused: 'Simulação local · Pausada',
  resetting: 'Simulação local · Retornando às mesas',
}

export function RoutineControls() {
  const mode = useAgentStore((state) => state.routine.mode)
  const start = useAgentStore((state) => state.startRoutine)
  const pause = useAgentStore((state) => state.pauseRoutine)
  const restart = useAgentStore((state) => state.restartRoutine)

  return (
    <div className="routine-controls" aria-label="Controle da rotina simulada">
      <div className="routine-controls-label"><span className="eyebrow">DEV CONTROLS / ROTINA</span><p role="status">{modeLabels[mode]}</p></div>
      <div className="routine-controls-buttons">
        <button type="button" disabled={mode === 'running' || mode === 'resetting'} onClick={start}>
          {mode === 'paused' ? 'Continuar rotina' : 'Iniciar rotina'}
        </button>
        <button type="button" disabled={mode !== 'running'} onClick={pause}>Pausar rotina</button>
        <button type="button" disabled={mode === 'resetting'} onClick={restart}>Reiniciar rotina</button>
      </div>
    </div>
  )
}

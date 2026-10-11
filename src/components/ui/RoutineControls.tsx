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
  const workspaceMode = useAgentStore((state) => state.workspaceMode)
  const changeMode = useAgentStore((state) => state.setWorkspaceMode)
  const moving = useAgentStore((state) => state.agents.some((agent) => agent.movement !== null))
  const tasksMode = workspaceMode === 'tasks'
  const start = useAgentStore((state) => state.startRoutine)
  const pause = useAgentStore((state) => state.pauseRoutine)
  const restart = useAgentStore((state) => state.restartRoutine)

  return (
    <div className="routine-controls" aria-label="Controle da rotina simulada">
      <div className="routine-controls-label"><span className="eyebrow">DEV CONTROLS / MODO LOCAL</span><p role="status">{moving ? 'Aguarde as rotas terminarem para trocar de modo' : tasksMode ? 'Tarefas locais · Controle manual do ciclo de trabalho' : modeLabels[mode]}</p></div>
      <div className="workspace-modes" role="group" aria-label="Modo do escritório">
        <button type="button" aria-pressed={!tasksMode} disabled={moving} onClick={() => changeMode('demo')}>Demonstração</button>
        <button type="button" aria-pressed={tasksMode} disabled={moving} onClick={() => changeMode('tasks')}>Tarefas</button>
      </div>
      <div className="routine-controls-buttons">
        <button type="button" disabled={tasksMode || mode === 'running' || mode === 'resetting'} onClick={start}>
          {mode === 'paused' ? 'Continuar rotina' : 'Iniciar rotina'}
        </button>
        <button type="button" disabled={tasksMode || mode !== 'running'} onClick={pause}>Pausar rotina</button>
        <button type="button" disabled={tasksMode || mode === 'resetting'} onClick={restart}>Reiniciar rotina</button>
      </div>
    </div>
  )
}

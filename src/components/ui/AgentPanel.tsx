import { useEffect, useRef } from 'react'
import { useAgentStore } from '../../agents/useAgentStore'
import { ProgressBar } from './ProgressBar'
import { StatusBadge } from './StatusBadge'
import { MovementControls } from './MovementControls'

type PlaceholderAction = 'conversar' | 'ver-tarefa' | 'parar'

export function AgentPanel() {
  const agent = useAgentStore((state) =>
    state.agents.find((item) => item.id === state.selectedAgentId),
  )
  const clearSelection = useAgentStore((state) => state.clearSelection)
  const closeButton = useRef<HTMLButtonElement>(null)
  const selectedId = agent?.id

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') clearSelection()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => { window.removeEventListener('keydown', onKeyDown) }
  }, [clearSelection])

  useEffect(() => {
    if (selectedId) closeButton.current?.focus({ preventScroll: true })
  }, [selectedId])

  if (!agent) return null

  function placeholder(action: PlaceholderAction) {
    console.info('[Office Game] Ação demonstrativa', { action, agentId: agent?.id })
  }

  return (
    <aside className="agent-panel" aria-labelledby="agent-panel-title">
      <header className="agent-panel-header">
        <span className="agent-panel-kicker">AGENTE SELECIONADO</span>
        <button
          ref={closeButton}
          type="button"
          className="agent-panel-close"
          aria-label="Fechar painel do agente"
          onClick={clearSelection}
        >
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </header>
      <div className="agent-panel-content" aria-live="polite">
        <div className="agent-identity">
          <span className="agent-avatar" aria-hidden="true">{agent.name.slice(0, 1)}</span>
          <div>
            <h3 id="agent-panel-title">{agent.name}</h3>
            <p className="agent-role">{agent.role}</p>
          </div>
        </div>
        <div className="agent-status-row">
          <span className="agent-field-label">Status</span>
          <StatusBadge status={agent.status} />
        </div>
        <div className="agent-task">
          <p className="agent-field-label">Tarefa atual</p>
          <p>{agent.currentTask}</p>
        </div>
        <ProgressBar value={agent.progress} />
      </div>
      <div className="agent-panel-actions" aria-describedby="agent-actions-note">
        <button type="button" onClick={() => placeholder('conversar')}>Conversar</button>
        <button type="button" onClick={() => placeholder('ver-tarefa')}>Ver tarefa</button>
        <button type="button" className="agent-stop" onClick={() => placeholder('parar')}>Parar</button>
      </div>
      <p id="agent-actions-note" className="agent-actions-note">Ações demonstrativas nesta etapa.</p>
      <MovementControls key={agent.id} agentId={agent.id} walking={agent.status === 'walking'} />
    </aside>
  )
}

import { useState } from 'react'
import type { AgentId, MovementDestination } from '../../agents/agentTypes'
import { useAgentStore } from '../../agents/useAgentStore'

export function MovementControls({ agentId, walking }: { agentId: AgentId; walking: boolean }) {
  const [destination, setDestination] = useState<MovementDestination>('center')
  const routineLocked = useAgentStore((state) => state.routine.mode !== 'stopped')
  const disabled = walking || routineLocked
  const moveAgent = useAgentStore((state) => state.moveAgent)

  return (
    <section className="movement-controls" aria-label="Teste de movimentação">
      <p className="agent-field-label">DEV CONTROLS / MOVIMENTO</p>
      <div className="movement-controls-row">
        <label htmlFor="movement-destination" className="sr-only">Destino</label>
        <select id="movement-destination" value={destination} disabled={disabled}
          onChange={(event) => setDestination(event.target.value as MovementDestination)}>
          <option value="desk">Mesa</option>
          <option value="center">Centro</option>
          <option value="meeting">Reunião</option>
          <option value="coffee">Café</option>
          <option value="idle">Área livre</option>
        </select>
        <button type="button" disabled={disabled} onClick={() => moveAgent(agentId, destination)}>
          {walking ? 'Caminhando…' : 'Mover'}
        </button>
      </div>
      <p className="movement-note">{routineLocked ? 'Controle manual bloqueado durante a rotina. Reinicie para retornar às mesas e liberar o controle.' : 'Mesa retorna à estação deste agente. Aguarde a chegada para enviar outro destino.'}</p>
    </section>
  )
}

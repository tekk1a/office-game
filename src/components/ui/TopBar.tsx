import { useAgentStore } from '../../agents/useAgentStore'

export function TopBar() {
  const agentCount = useAgentStore((state) => state.agents.length)

  return (
    <div className="office-topbar" aria-label="Resumo do escritório">
      <span className="office-topbar-dot" aria-hidden="true" />
      <strong>OFFICE GAME</strong>
      <span className="office-topbar-count">{agentCount} Agents</span>
    </div>
  )
}

import type { AgentStatus } from '../../agents/agentTypes'

const labels: Record<AgentStatus, string> = {
  idle: 'Idle',
  walking: 'Walking',
  working: 'Working',
  thinking: 'Thinking',
  meeting: 'Meeting',
  finished: 'Finished',
  error: 'Error',
}

export function StatusBadge({ status }: { status: AgentStatus }) {
  return (
    <span className="status-badge" data-status={status}>
      <span className="status-dot" aria-hidden="true" />
      {labels[status]}
    </span>
  )
}

import type { AgentStatus } from '../../agents/agentTypes'

import { officeTheme } from '../../theme/officeTheme'

export function StatusBadge({ status }: { status: AgentStatus }) {
  return (
    <span className="status-badge" data-status={status}>
      <span className="status-dot" aria-hidden="true" />
      {officeTheme.statusLabels[status]}
    </span>
  )
}

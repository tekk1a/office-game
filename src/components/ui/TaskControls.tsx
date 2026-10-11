import { useState } from 'react'
import type { AgentId } from '../../agents/agentTypes'
import { useAgentStore } from '../../agents/useAgentStore'
import { taskStatusLabels } from '../../tasks/taskTypes'
import type { AttentionReason, TaskResult } from '../../tasks/taskTypes'

export function TaskControls({ agentId }: { agentId: AgentId }) {
  const tasks = useAgentStore((state) => state.tasks)
  const mode = useAgentStore((state) => state.workspaceMode)
  const currentTaskId = useAgentStore((state) => state.agents.find((agent) => agent.id === agentId)?.currentTaskId)
  const assign = useAgentStore((state) => state.assignTask)
  const command = useAgentStore((state) => state.commandTask)
  const [choice, setChoice] = useState('')
  const [reason, setReason] = useState<AttentionReason>('question')
  const [message, setMessage] = useState('')
  const available = tasks.filter((task) => task.assignedAgentId === null || task.assignedAgentId === agentId)
  const task = tasks.find((item) => item.id === (choice || currentTaskId))
  const busy = tasks.some((item) => item.id !== task?.id && item.assignedAgentId === agentId
    && (item.status === 'working' || item.status === 'needs_attention'))
  const enabled = mode === 'tasks'
  const working = enabled && task?.status === 'working' && task.id === currentTaskId
  function feedback(result: TaskResult, success: string) {
    setMessage(result.ok ? success : result.error)
  }

  return (
    <section className="task-controls" aria-label="Tarefas locais">
      <p className="agent-field-label">DEV CONTROLS / TAREFAS LOCAIS</p>
      <label htmlFor="task-choice">Tarefa deste agente ou recebida</label>
      <select id="task-choice" value={task?.id ?? ''} disabled={!enabled}
        onChange={(event) => { setChoice(event.target.value); setMessage('') }}>
        {!task && <option value="">Escolha uma tarefa</option>}
        {available.map((item) => <option key={item.id} value={item.id}>{item.title} · {taskStatusLabels[item.status]}</option>)}
      </select>
      {task && <p className="task-description">{task.description}</p>}
      <div className="task-controls-buttons">
        <button type="button" disabled={!enabled || !task || !['inbox', 'scheduled'].includes(task.status)}
          onClick={() => { if (task) feedback(assign(task.id, agentId), busy ? 'Atribuída à fila. A tarefa ativa foi preservada.' : 'Tarefa atribuída.') }}>Atribuir</button>
        <button type="button" disabled={!enabled || !task || task.assignedAgentId !== agentId || busy || !['scheduled', 'needs_attention'].includes(task.status)}
          onClick={() => { if (task) feedback(command(task.id, { type: 'start' }), 'Execução local iniciada; o agente retorna à mesa se necessário.') }}>
          {task?.status === 'needs_attention' ? 'Retomar tarefa' : 'Iniciar tarefa'}
        </button>
      </div>
      <label htmlFor="task-progress">Progresso manual {task?.progress ?? 0}%</label>
      <input id="task-progress" type="range" min="0" max={task?.status === 'done' ? 100 : 99} step="1" value={task?.progress ?? 0} disabled={!working}
        onChange={(event) => { if (task) feedback(command(task.id, { type: 'progress', value: Number(event.target.value) }), 'Progresso atualizado manualmente.') }} />
      <label htmlFor="task-attention">Motivo de atenção</label>
      <select id="task-attention" value={reason} disabled={!working} onChange={(event) => setReason(event.target.value as AttentionReason)}>
        <option value="question">Dúvida</option><option value="review">Revisão</option><option value="error">Erro</option>
      </select>
      <div className="task-controls-buttons">
        <button type="button" disabled={!working} onClick={() => { if (task) feedback(command(task.id, { type: 'attention', reason }), 'Tarefa aguardando atenção. Uma rota em andamento termina primeiro.') }}>Solicitar atenção</button>
        <button type="button" disabled={!working} onClick={() => { if (task) feedback(command(task.id, { type: 'complete' }), 'Tarefa concluída em 100%.') }}>Concluir</button>
      </div>
      <p className="movement-note" role="status">{!enabled ? 'Selecione o modo Tarefas abaixo do escritório para usar estes controles.' : message || (busy ? 'Outra tarefa está ativa; esta ficará na fila.' : 'Simulação em memória. Não executa trabalho real; recarregar restaura os exemplos.')}</p>
    </section>
  )
}

import { useState } from 'react'
import { useAgentStore } from '../../agents/useAgentStore'
import { pendingDelivery } from '../../tasks/taskHistory'
import { taskStatusLabels } from '../../tasks/taskTypes'
import type { AttentionReason, Task, TaskEventType, TaskResult } from '../../tasks/taskTypes'

const eventLabels: Record<TaskEventType, string> = { created: 'Criação', edited: 'Edição', assigned: 'Atribuição', started: 'Início/retomada', progress: 'Progresso', attention: 'Atenção', completed: 'Conclusão', delivery: 'Entrega', approved: 'Aprovação', changes_requested: 'Ajustes' }
const reviewLabels = { pending: 'Aguardando revisão', approved: 'Aprovada', changes_requested: 'Ajustes solicitados' }

export function TaskActivity({ task }: { task: Task }) {
  const tasks = useAgentStore((state) => state.tasks)
  const participants = useAgentStore((state) => state.participants)
  const enabled = useAgentStore((state) => state.workspaceMode === 'tasks')
  const command = useAgentStore((state) => state.commandTask)
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState('')
  const [reason, setReason] = useState<AttentionReason>('question')
  const [note, setNote] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [fullHistory, setFullHistory] = useState(false)
  const owner = participants.find((person) => person.id === task.assigneeId)
  const busy = task.assigneeId !== null && tasks.some((item) => item.id !== task.id && item.assigneeId === task.assigneeId && ['working', 'needs_attention'].includes(item.status))
  const pending = pendingDelivery(task)
  const working = enabled && task.status === 'working'
  function feedback(result: TaskResult, success: string) { setMessage(result.ok ? success : result.error) }
  return (
    <section className="task-detail" aria-label="Detalhes da tarefa">
      <h3>{task.title}</h3><p>{task.description || 'Sem descrição.'}</p>
      <p className="workspace-note">{owner ? `${owner.name} · ${owner.kind === 'person' ? 'Pessoa' : 'Agente'}` : 'Sem responsável'} · {taskStatusLabels[task.status]} · {task.progress}%</p>
      {task.attentionNote && <p className="attention-note">{task.attentionNote}</p>}
      <div className="workspace-actions">
        <button type="button" disabled={!enabled || !owner || busy || pending !== null || !['scheduled', 'needs_attention'].includes(task.status)} onClick={() => feedback(command(task.id, { type: 'start' }), owner?.kind === 'person' ? 'Andamento iniciado para esta pessoa.' : 'Andamento iniciado. O agente retorna à estação se necessário.')}>{task.status === 'needs_attention' ? 'Retomar andamento' : 'Iniciar andamento'}</button>
        <button type="button" disabled={!working} onClick={() => feedback(command(task.id, { type: 'complete' }), 'Tarefa concluída manualmente.')}>Concluir manualmente</button>
      </div>
      {busy && <p className="workspace-note">Este responsável já tem uma tarefa ativa. Esta tarefa permanece na fila.</p>}
      <div className="task-detail-controls">
        <form onSubmit={(event) => { event.preventDefault(); if (progress === '') { setMessage('Informe o novo progresso.'); return } feedback(command(task.id, { type: 'progress', value: Number(progress) }), 'Progresso atualizado.'); setProgress('') }}>
          <label htmlFor="detail-progress">Novo progresso</label><div className="workspace-actions"><input id="detail-progress" type="number" min="0" max="99" disabled={!working} value={progress} onChange={(event) => setProgress(event.target.value)} placeholder={`${task.progress}`} /><button type="submit" disabled={!working}>Atualizar progresso</button></div>
        </form>
        <form onSubmit={(event) => { event.preventDefault(); feedback(command(task.id, { type: 'attention', reason, note }), 'Atenção registrada.') }}>
          <label htmlFor="detail-attention">Tipo de atenção</label><select id="detail-attention" disabled={!working} value={reason} onChange={(event) => setReason(event.target.value as AttentionReason)}><option value="question">Dúvida</option><option value="review">Revisão</option><option value="error">Erro</option></select>
          <label htmlFor="detail-note">Motivo ou ajustes solicitados</label><textarea id="detail-note" maxLength={2000} disabled={!working && !(enabled && pending)} value={note} onChange={(event) => setNote(event.target.value)} rows={2} />
          <button type="submit" disabled={!working}>Registrar atenção</button>
        </form>
      </div>
      <form className="delivery-form" aria-label="Registrar entrega" onSubmit={(event) => { event.preventDefault(); const result = command(task.id, { type: 'deliver', summary, url: url || null }); feedback(result, 'Entrega registrada; aguardando revisão.'); if (result.ok) { setSummary(''); setUrl('') } }}>
        <h4>Entrega para revisão</h4><label htmlFor="delivery-summary">Resultado da entrega</label><textarea id="delivery-summary" required maxLength={5000} rows={3} disabled={!working} value={summary} onChange={(event) => setSummary(event.target.value)} />
        <label htmlFor="delivery-url">Link da entrega (opcional)</label><input id="delivery-url" type="url" maxLength={2000} disabled={!working} placeholder="https://" value={url} onChange={(event) => setUrl(event.target.value)} />
        <button type="submit" disabled={!working}>Enviar para revisão</button>
      </form>
      {pending && <div className="review-controls"><p className="workspace-note">Revise a entrega abaixo. Aprovar conclui em 100%; solicitar ajustes mantém a tarefa aguardando retomada.</p><div className="workspace-actions"><button type="button" disabled={!enabled} onClick={() => feedback(command(task.id, { type: 'approve' }), 'Entrega aprovada. Tarefa concluída.')}>Aprovar entrega</button><button type="button" disabled={!enabled} onClick={() => feedback(command(task.id, { type: 'request_changes', note }), 'Ajustes solicitados. Retome para preparar uma nova entrega.')}>Solicitar ajustes</button></div></div>}
      <p className="workspace-note" role="status">{message || 'Andamento registrado manualmente. Pessoas e agentes não executam ações automaticamente.'}</p>
      <h4>Entregas registradas</h4>
      {task.deliveries.length === 0 ? <p className="workspace-note">Nenhuma entrega registrada.</p> : <ul className="delivery-list">{[...task.deliveries].reverse().map((delivery) => <li key={delivery.id}><strong>{reviewLabels[delivery.review]}</strong><p>{delivery.summary}</p>{delivery.url && <a href={delivery.url} target="_blank" rel="noopener noreferrer">Abrir link da entrega</a>}{delivery.reviewNote && <p>Ajustes: {delivery.reviewNote}</p>}<p className="workspace-note">Registrada em {new Date(delivery.createdAt).toLocaleString('pt-BR')}{delivery.reviewedAt ? ` · Revisada em ${new Date(delivery.reviewedAt).toLocaleString('pt-BR')}` : ''}</p></li>)}</ul>}
      <h4>Histórico local</h4>
      <p className="workspace-note">Criada em {new Date(task.createdAt).toLocaleString('pt-BR')} · Atualizada em {new Date(task.updatedAt).toLocaleString('pt-BR')}</p>
      <ol className="task-history">{task.history.slice(fullHistory ? 0 : -20).reverse().map((event) => <li key={event.id}><strong>{eventLabels[event.type]}</strong><span>{event.message}</span><time dateTime={event.at}>{new Date(event.at).toLocaleString('pt-BR')}</time></li>)}</ol>
      {!fullHistory && task.history.length > 20 && <button type="button" onClick={() => setFullHistory(true)}>Ver todo o histórico ({task.history.length})</button>}
    </section>
  )
}

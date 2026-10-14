import { useState } from 'react'
import { useAgentStore } from '../../agents/useAgentStore'
import { taskPriorityLabels, taskStatusLabels } from '../../tasks/taskTypes'
import { TaskForm } from './TaskForm'
import { TaskBackupControls } from './TaskBackupControls'
import { PeopleControls } from './PeopleControls'
import { TaskActivity } from './TaskActivity'
import type { TaskPriority, TaskStatus } from '../../tasks/taskTypes'

export function TaskWorkspace() {
  const tasks = useAgentStore((state) => state.tasks)
  const agents = useAgentStore((state) => state.agents)
  const participants = useAgentStore((state) => state.participants)
  const mode = useAgentStore((state) => state.workspaceMode)
  const storageStatus = useAgentStore((state) => state.storageStatus)
  const selectAgent = useAgentStore((state) => state.selectAgent)
  const [status, setStatus] = useState<TaskStatus | 'all'>('all')
  const [owner, setOwner] = useState('all')
  const [priority, setPriority] = useState<TaskPriority | 'all'>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [peopleRevision, setPeopleRevision] = useState(0)
  const enabled = mode === 'tasks'
  const ranks = { high: 0, normal: 1, low: 2 }
  const visible = tasks.filter((task) => (status === 'all' || task.status === status) && (owner === 'all' || (owner === 'unassigned' ? task.assigneeId === null : task.assigneeId === owner)) && (priority === 'all' || task.priority === priority))
    .sort((a, b) => ranks[a.priority] - ranks[b.priority] || (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999') || b.createdAt.localeCompare(a.createdAt))
  const editing = tasks.find((task) => task.id === editingId) ?? null

  return (
    <section className="task-workspace" aria-labelledby="task-workspace-title">
      <div className="workspace-section-heading">
        <div><p className="eyebrow">GESTÃO LOCAL</p><h2 id="task-workspace-title">Fila de trabalho</h2><p className="workspace-note">{tasks.length} tarefas · {tasks.filter((task) => task.status === 'needs_attention').length} aguardando atenção</p></div>
        <button type="button" disabled={!enabled} onClick={() => setEditingId('new')}>Nova tarefa</button>
      </div>
      <p className={storageStatus.kind === 'saved' ? 'workspace-note' : 'workspace-error'} role={storageStatus.kind === 'saved' ? 'status' : 'alert'}>{storageStatus.message}{storageStatus.savedAt ? ` · ${new Date(storageStatus.savedAt).toLocaleTimeString('pt-BR')}` : ''}</p>
      {!enabled && <p className="workspace-note">Escolha Tarefas acima para criar, editar e acompanhar trabalhos. Demonstração mantém os dados da gestão.</p>}
      <TaskBackupControls onRestored={() => { setEditingId(null); setSelectedId(null); setStatus('all'); setOwner('all'); setPriority('all'); setPeopleRevision((value) => value + 1) }} />
      <PeopleControls key={peopleRevision} />
      {editingId !== null && (editingId === 'new' || editing !== null) && enabled && <TaskForm key={editingId} task={editing} onClose={() => setEditingId(null)} onSaved={setSelectedId} />}
      <div className="task-filters">
        <div><label htmlFor="queue-status">Estado da fila</label><select id="queue-status" value={status} onChange={(event) => setStatus(event.target.value as TaskStatus | 'all')}><option value="all">Todos os estados</option>{Object.entries(taskStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
        <div><label htmlFor="queue-owner">Responsável da fila</label><select id="queue-owner" value={owner} onChange={(event) => setOwner(event.target.value)}><option value="all">Todos os responsáveis</option><option value="unassigned">Sem responsável</option>{participants.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.kind === 'person' ? 'Pessoa' : 'Agente'}</option>)}</select></div>
        <div><label htmlFor="queue-priority">Prioridade da fila</label><select id="queue-priority" value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority | 'all')}><option value="all">Todas as prioridades</option>{Object.entries(taskPriorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      </div>
      <p className="workspace-note">{visible.length} resultados · Ordenados por prioridade, prazo e criação.</p>
      <ul className="task-queue" aria-label="Tarefas na fila">
        {visible.map((task) => <li key={task.id} className={task.id === selectedId ? 'task-row task-row-selected' : 'task-row'}>
          <div className="task-row-main"><strong>{task.title}</strong><span>{participants.find((person) => person.id === task.assigneeId)?.name ?? 'Sem responsável'} · {taskPriorityLabels[task.priority]}{task.dueDate ? ` · Prazo ${task.dueDate.split('-').reverse().join('/')}` : ''}</span></div>
          <div className="task-row-state"><span>{taskStatusLabels[task.status]}</span><span>{task.progress}%</span></div>
          <div className="workspace-actions"><button type="button" aria-label={`${task.id === selectedId ? 'Fechar detalhes de' : 'Detalhes de'} ${task.title}`} onClick={() => { const opening = task.id !== selectedId; setSelectedId(opening ? task.id : null); const agent = agents.find((item) => item.id === task.assigneeId); if (opening && agent) selectAgent(agent.id) }}>{task.id === selectedId ? 'Fechar detalhes' : 'Detalhes'}</button><button type="button" disabled={!enabled} aria-label={`Editar ${task.title}`} onClick={() => setEditingId(task.id)}>Editar</button></div>
          {task.id === selectedId && <TaskActivity key={task.id} task={task} />}
        </li>)}
      </ul>
      {visible.length === 0 && <p className="workspace-empty">Nenhuma tarefa corresponde aos filtros.</p>}
    </section>
  )
}

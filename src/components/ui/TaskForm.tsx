import { useState } from 'react'
import { useAgentStore } from '../../agents/useAgentStore'
import { taskPriorityLabels } from '../../tasks/taskTypes'
import type { Task, TaskDraft, TaskPriority } from '../../tasks/taskTypes'

export function TaskForm({ task, onClose, onSaved }: { task: Task | null; onClose: () => void; onSaved: (id: string) => void }) {
  const createTask = useAgentStore((state) => state.createTask)
  const editTask = useAgentStore((state) => state.editTask)
  const participants = useAgentStore((state) => state.participants)
  const [draft, setDraft] = useState<TaskDraft>({ title: task?.title ?? '', description: task?.description ?? '', assigneeId: task?.assigneeId ?? null, priority: task?.priority ?? 'normal', dueDate: task?.dueDate ?? null })
  const [error, setError] = useState('')
  const lockedOwner = task !== null && !['inbox', 'scheduled'].includes(task.status)
  return (
    <form className="task-editor" aria-label={task ? 'Editar tarefa' : 'Nova tarefa'} onSubmit={(event) => {
      event.preventDefault()
      const result = task ? editTask(task.id, draft) : createTask(draft)
      if (!result.ok) { setError(result.error); return }
      onSaved(result.taskId ?? task?.id ?? '')
      onClose()
    }}>
      <div className="workspace-section-heading"><h3>{task ? 'Editar tarefa' : 'Nova tarefa'}</h3><button type="button" onClick={onClose}>Cancelar</button></div>
      <label htmlFor="task-editor-title">Título</label>
      <input id="task-editor-title" required maxLength={160} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} autoFocus />
      <label htmlFor="task-editor-description">Descrição</label>
      <textarea id="task-editor-description" maxLength={5000} rows={3} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
      <div className="task-editor-fields">
        <div><label htmlFor="task-editor-owner">Responsável</label><select id="task-editor-owner" disabled={lockedOwner} value={draft.assigneeId ?? ''}
          onChange={(event) => setDraft({ ...draft, assigneeId: event.target.value || null })}>
          <option value="">Sem responsável</option>{participants.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.kind === 'person' ? 'Pessoa' : 'Agente'}</option>)}
        </select></div>
        <div><label htmlFor="task-editor-priority">Prioridade</label><select id="task-editor-priority" value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as TaskPriority })}>
          {Object.entries(taskPriorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select></div>
        <div><label htmlFor="task-editor-date">Prazo opcional</label><input id="task-editor-date" type="date" value={draft.dueDate ?? ''} onChange={(event) => setDraft({ ...draft, dueDate: event.target.value || null })} /></div>
      </div>
      {lockedOwner && <p className="workspace-note">O responsável permanece vinculado enquanto esta tarefa está ativa ou concluída.</p>}
      {error && <p role="alert" className="workspace-error">{error}</p>}
      <button type="submit">{task ? 'Salvar alterações' : 'Criar tarefa'}</button>
    </form>
  )
}

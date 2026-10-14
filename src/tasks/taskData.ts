import type { Task } from './taskTypes'

const timestamp = '2026-10-10T12:00:00.000Z'
const seedTasks: readonly Omit<Task, 'priority' | 'dueDate' | 'attentionNote' | 'history' | 'deliveries'>[] = [
  { id: 'landing-page', title: 'Building landing page', description: 'Montar a página de apresentação. Exemplo local, sem execução real.', status: 'working', assigneeId: 'developer', progress: 72, attentionReason: null, createdAt: timestamp, updatedAt: timestamp },
  { id: 'campaign', title: 'Waiting for task', description: 'Preparar a campanha de lançamento. Aguardando início manual.', status: 'scheduled', assigneeId: 'marketing', progress: 0, attentionReason: null, createdAt: timestamp, updatedAt: timestamp },
  { id: 'competitors', title: 'Researching competitors', description: 'Levantar referências do mercado. Exemplo local, sem pesquisa externa.', status: 'working', assigneeId: 'research', progress: 45, attentionReason: null, createdAt: timestamp, updatedAt: timestamp },
  { id: 'review-brief', title: 'Revisar briefing', description: 'Conferir os objetivos da próxima entrega.', status: 'inbox', assigneeId: null, progress: 0, attentionReason: null, createdAt: timestamp, updatedAt: timestamp },
  { id: 'organize-delivery', title: 'Organizar entrega', description: 'Preparar a lista de itens para revisão.', status: 'inbox', assigneeId: null, progress: 0, attentionReason: null, createdAt: timestamp, updatedAt: timestamp },
]
export const initialTasks: readonly Task[] = seedTasks.map((task): Task => ({ ...task, priority: 'normal', dueDate: null, attentionNote: null, deliveries: [], history: [{ id: `event-${task.id}`, type: 'created', at: timestamp, message: 'Exemplo inicial do escritório.' }] }))

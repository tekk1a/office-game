import type { Task, TaskEventType } from './taskTypes'

export function recordTaskEvent(task: Task, type: TaskEventType, message: string, at: string): Task {
  return { ...task, updatedAt: at, history: [...task.history, { id: `event-${crypto.randomUUID()}`, at, type, message }] }
}

export function pendingDelivery(task: Task) {
  const last = task.deliveries.at(-1)
  return last?.review === 'pending' ? last : null
}

export function validDeliveryUrl(url: string | null): boolean {
  if (url === null) return true
  if (url.length > 2000) return false
  try { const parsed = new URL(url); return ['https:', 'http:'].includes(parsed.protocol) && !parsed.username && !parsed.password } catch { return false }
}

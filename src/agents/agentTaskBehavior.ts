import { angleDifference, createMovement, DESK_ROTATION_Y } from './agentNavigation'
import { travelActivities } from './agentRoutine'
import type { Agent } from './agentTypes'
import type { Task } from '../tasks/taskTypes'

// Task intent is resolved centrally, never by the character or a second scheduler.
export function reconcileAgentTask(agent: Agent, tasks: readonly Task[]): Agent {
  if (agent.movement) return agent // Finish the safe route, then read the latest task again.
  const task = tasks.find((item) => item.id === agent.currentTaskId && item.assigneeId === agent.id)
  if (task?.status === 'working') {
    const movement = createMovement(agent, 'desk')
      ?? (Math.abs(angleDifference(DESK_ROTATION_Y, agent.rotationY)) > 0.015
        ? { destination: 'desk' as const, route: [], finalStatus: 'working' as const, finalRotationY: DESK_ROTATION_Y }
        : null)
    if (movement) return { ...agent, movement: { ...movement, finalStatus: 'working' }, status: 'walking', currentActivity: travelActivities.desk }
    return { ...agent, status: 'working', currentActivity: task.title }
  }
  if (task?.status === 'needs_attention') {
    const error = task.attentionReason === 'error'
    return { ...agent, status: error ? 'error' : 'idle', currentActivity: error ? 'Erro na tarefa · aguardando intervenção' : task.attentionReason === 'review' ? 'Aguardando revisão' : 'Aguardando resposta' }
  }
  if (task?.status === 'done') return { ...agent, status: 'finished', currentActivity: 'Tarefa concluída' }
  return { ...agent, status: 'idle', currentActivity: task ? 'Aguardando início da tarefa' : 'Sem tarefa ativa' }
}

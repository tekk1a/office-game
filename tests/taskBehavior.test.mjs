import assert from 'node:assert/strict'
import { after, beforeEach, test } from 'node:test'
import { createServer } from 'vite'

const server = await createServer({ configFile: false, cacheDir: 'node_modules/.vite-task-tests', server: { middlewareMode: true, ws: false }, appType: 'custom' })
after(() => server.close())
const { initialAgents } = await server.ssrLoadModule('/src/agents/agentData.ts')
const { initialTasks } = await server.ssrLoadModule('/src/tasks/taskData.ts')
const { createRoutineState } = await server.ssrLoadModule('/src/agents/agentRoutine.ts')
const { useAgentStore } = await server.ssrLoadModule('/src/agents/useAgentStore.ts')
const { destinationPosition } = await server.ssrLoadModule('/src/agents/officeWaypoints.ts')
const { transitionTask } = await server.ssrLoadModule('/src/tasks/taskTransitions.ts')
const state = () => useAgentStore.getState()
const agent = (id = 'developer') => state().agents.find((item) => item.id === id)
const task = (id = 'landing-page') => state().tasks.find((item) => item.id === id)
function settle() {
  for (let frame = 0; state().agents.some((item) => item.movement) && frame < 2400; frame++) state().advanceMovement(1 / 60)
  assert.equal(state().agents.some((item) => item.movement), false)
}
function away(id, destination) {
  state().moveAgent(id, destination)
  settle()
}
beforeEach(() => {
  useAgentStore.setState({ agents: structuredClone(initialAgents), tasks: structuredClone(initialTasks), routine: createRoutineState(), workspaceMode: 'demo', selectedAgentId: null, hoveredAgentId: null })
})

test('assigns an inbox task to the queue, starts it manually and completes at 100%', () => {
  state().setWorkspaceMode('tasks')
  assert.equal(state().assignTask('review-brief', 'marketing').ok, true)
  assert.equal(task('review-brief').status, 'scheduled')
  assert.equal(agent('marketing').currentTaskId, 'review-brief')
  assert.equal(agent('marketing').status, 'idle')
  assert.equal(state().commandTask('review-brief', { type: 'start' }).ok, true)
  settle()
  assert.equal(agent('marketing').status, 'working')
  state().commandTask('review-brief', { type: 'progress', value: 38 })
  assert.equal(task('review-brief').progress, 38)
  assert.equal(state().commandTask('review-brief', { type: 'complete' }).ok, true)
  assert.equal(agent('marketing').status, 'finished')
  assert.equal(task('review-brief').progress, 100)
  assert.equal(task('review-brief').attentionReason, null)
  assert.equal(task('review-brief').createdAt, initialTasks[3].createdAt)
  assert.notEqual(task('review-brief').updatedAt, task('review-brief').createdAt)
})

test('a second assignment joins the queue and cannot replace a working or blocked task', () => {
  state().setWorkspaceMode('tasks')
  assert.equal(state().assignTask('review-brief', 'developer').ok, true)
  assert.equal(task('review-brief').status, 'scheduled')
  assert.equal(agent().currentTaskId, 'landing-page')
  const queued = state().tasks
  assert.equal(state().commandTask('review-brief', { type: 'start' }).ok, false)
  assert.equal(state().tasks, queued)
  state().commandTask('landing-page', { type: 'attention', reason: 'review' })
  assert.equal(state().commandTask('review-brief', { type: 'start' }).ok, false)
  state().commandTask('landing-page', { type: 'start' })
  state().commandTask('landing-page', { type: 'complete' })
  assert.equal(state().commandTask('review-brief', { type: 'start' }).ok, true)
  assert.equal(agent().currentTaskId, 'review-brief')
  assert.equal(task().status, 'done')
})

test('question/review wait idle, error reports error, and resuming clears attention', () => {
  state().setWorkspaceMode('tasks')
  for (const reason of ['question', 'review', 'error']) {
    assert.equal(state().commandTask('landing-page', { type: 'attention', reason }).ok, true)
    assert.equal(task().status, 'needs_attention')
    assert.equal(task().attentionReason, reason)
    assert.equal(agent().status, reason === 'error' ? 'error' : 'idle')
    assert.match(agent().currentActivity, reason === 'question' ? /resposta/ : reason === 'review' ? /revisão/ : /Erro/)
    assert.equal(state().commandTask('landing-page', { type: 'start' }).ok, true)
    settle()
    assert.equal(agent().status, 'working')
    assert.equal(task().attentionReason, null)
    assert.equal(task().progress, 72)
  }
})

test('Marketing starts away from its desk and arrives working facing the monitor', () => {
  away('marketing', 'meeting')
  const before = [...agent('marketing').position]
  state().setWorkspaceMode('tasks')
  assert.equal(state().commandTask('campaign', { type: 'start' }).ok, true)
  assert.deepEqual(agent('marketing').position, before)
  assert.equal(agent('marketing').status, 'walking')
  assert.equal(task('campaign').status, 'working')
  settle()
  assert.deepEqual(agent('marketing').position, destinationPosition('marketing', 'desk'))
  assert.equal(agent('marketing').status, 'working')
  assert.equal(agent('marketing').rotationY, -0.59)
})

for (const [reason, expected] of [['question', 'idle'], ['review', 'idle'], ['error', 'error'], ['done', 'finished']]) {
  test(`changing task to ${reason} during walking keeps its route and recomputes arrival`, () => {
    away('developer', 'coffee')
    state().selectAgent('developer')
    state().setWorkspaceMode('tasks')
    const route = agent().movement
    const before = [...agent().position]
    const command = reason === 'done' ? { type: 'complete' } : { type: 'attention', reason }
    assert.equal(state().commandTask('landing-page', command).ok, true)
    assert.equal(agent().movement, route)
    assert.deepEqual(agent().position, before)
    assert.equal(agent().status, 'walking')
    state().selectAgent('research')
    settle()
    assert.equal(state().selectedAgentId, 'research')
    assert.equal(agent().status, expected)
    assert.deepEqual(agent().position, destinationPosition('developer', 'desk'))
    assert.equal(task().status, reason === 'done' ? 'done' : 'needs_attention')
  })
}

test('mode changes wait for routes, preserve selection/positions and block competing controllers', () => {
  state().selectAgent('marketing')
  state().moveAgent('developer', 'center')
  assert.equal(state().setWorkspaceMode('tasks').ok, false)
  assert.equal(state().workspaceMode, 'demo')
  settle()
  const before = state().agents.map((item) => [...item.position])
  assert.equal(state().setWorkspaceMode('tasks').ok, true)
  assert.deepEqual(state().agents.map((item) => item.position), before)
  const moving = state().agents
  state().startRoutine()
  state().restartRoutine()
  state().advanceBehavior(20)
  state().moveAgent('marketing', 'meeting')
  assert.equal(state().agents, moving)
  assert.equal(state().routine.mode, 'stopped')
  assert.equal(state().setWorkspaceMode('demo').ok, false)
  settle()
  const arrived = state().agents.map((item) => [...item.position])
  assert.equal(state().setWorkspaceMode('demo').ok, true)
  assert.deepEqual(state().agents.map((item) => item.position), arrived)
  assert.equal(state().selectedAgentId, 'marketing')
})

test('invalid ids, ownership and progress leave the store untouched', () => {
  state().setWorkspaceMode('tasks')
  for (const value of [-1, 100, Infinity, NaN]) {
    const previous = state()
    assert.equal(state().commandTask('landing-page', { type: 'progress', value }).ok, false)
    assert.equal(state(), previous)
  }
  const previous = state()
  assert.equal(state().assignTask('campaign', 'developer').ok, false)
  assert.equal(state().commandTask('missing', { type: 'start' }).ok, false)
  assert.equal(state(), previous)
  assert.equal(transitionTask(task(), { type: 'start' }, 'now').ok, false)
  state().commandTask('landing-page', { type: 'complete' })
  const done = state()
  assert.equal(state().commandTask('landing-page', { type: 'start' }).ok, false)
  assert.equal(state().commandTask('landing-page', { type: 'progress', value: 2 }).ok, false)
  assert.equal(state(), done)
})

test('demo routines and elapsed time never execute or advance task records', () => {
  const before = structuredClone(state().tasks)
  assert.equal(state().commandTask('campaign', { type: 'start' }).ok, false)
  assert.equal(state().assignTask('review-brief', 'marketing').ok, false)
  state().startRoutine()
  for (let i = 0; i < 1000; i++) { state().advanceMovement(0.1); state().advanceBehavior(0.1) }
  assert.deepEqual(state().tasks, before)
  state().pauseRoutine()
  settle()
  state().setWorkspaceMode('tasks')
  settle()
  for (let i = 0; i < 20; i++) state().advanceBehavior(1)
  assert.deepEqual(state().tasks, before)
})

test('the latest task identity wins when another task starts during the same safe route', () => {
  away('developer', 'coffee')
  state().setWorkspaceMode('tasks')
  const route = agent().movement
  state().assignTask('review-brief', 'developer')
  state().commandTask('landing-page', { type: 'complete' })
  state().commandTask('review-brief', { type: 'start' })
  assert.equal(agent().movement, route)
  assert.equal(agent().currentTaskId, 'review-brief')
  assert.equal(agent().status, 'walking')
  settle()
  assert.equal(task().status, 'done')
  assert.equal(task('review-brief').status, 'working')
  assert.equal(agent().status, 'working')
  assert.equal(agent().currentActivity, 'Revisar briefing')
})

test('an agent with no task stays idle and can receive and start its first task', () => {
  useAgentStore.setState({ tasks: [], agents: state().agents.map((item) => ({ ...item, currentTaskId: null })) })
  state().setWorkspaceMode('tasks')
  assert.equal(agent().status, 'idle')
  assert.equal(agent().currentActivity, 'Sem tarefa ativa')
  useAgentStore.setState({ tasks: [structuredClone(initialTasks[3])] })
  assert.equal(state().assignTask('review-brief', 'developer').ok, true)
  assert.equal(agent().status, 'idle')
  assert.equal(state().commandTask('review-brief', { type: 'start' }).ok, true)
  settle()
  assert.equal(agent().status, 'working')
})

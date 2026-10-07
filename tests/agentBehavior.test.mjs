import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createServer } from 'vite'

const server = await createServer({ configFile: false, cacheDir: 'node_modules/.vite-behavior-tests', server: { middlewareMode: true, ws: false }, appType: 'custom' })
after(() => server.close())
const { advanceBehavior } = await server.ssrLoadModule('/src/agents/agentBehavior.ts')
const { createRoutineState, agentRoutines, routineTiming } = await server.ssrLoadModule('/src/agents/agentRoutine.ts')
const { initialAgents } = await server.ssrLoadModule('/src/agents/agentData.ts')
const { stepAgent } = await server.ssrLoadModule('/src/agents/agentNavigation.ts')
const { destinationPosition } = await server.ssrLoadModule('/src/agents/officeWaypoints.ts')
const { useAgentStore } = await server.ssrLoadModule('/src/agents/useAgentStore.ts')
const fresh = () => ({ agents: structuredClone(initialAgents), routine: createRoutineState('running') })
function tick(state, delta = 0.1) {
  const agents = state.agents.map((agent) => stepAgent(agent, delta))
  return advanceBehavior(agents, state.routine, delta)
}
function run(state, seconds) {
  for (let i = 0; i < Math.round(seconds * 10); i++) state = tick(state)
  return state
}

test('each deterministic routine follows its ordered stops and returns to the proper desk state', () => {
  let state = fresh()
  const visits = { developer: [], marketing: [], research: [] }
  let previous = { developer: null, marketing: null, research: null }
  for (let i = 0; i < 1000; i++) {
    state = tick(state)
    for (const agent of state.agents) {
      const routine = state.routine.agents[agent.id]
      const key = `${routine.stepIndex}:${routine.phase}`
      if (routine.phase === 'waiting' && key !== previous[agent.id]) {
        const step = agentRoutines[agent.id][routine.stepIndex]
        visits[agent.id].push(step.destination)
        assert.deepEqual(agent.position, destinationPosition(agent.id, step.destination))
        assert.equal(agent.status, step.status)
        assert.equal(agent.currentActivity, step.activity ?? agent.currentTask)
      }
      previous[agent.id] = key
      assert.equal(agent.currentTask, initialAgents.find((a) => a.id === agent.id).currentTask)
      assert.equal(agent.progress, initialAgents.find((a) => a.id === agent.id).progress)
    }
  }
  assert.deepEqual(visits.developer.slice(0, 4), ['desk', 'center', 'coffee', 'desk'])
  assert.deepEqual(visits.marketing.slice(0, 3), ['desk', 'meeting', 'desk'])
  assert.deepEqual(visits.research.slice(0, 4), ['desk', 'idle', 'center', 'desk'])
})

test('configured waits start after arrival, and agents depart at distinct times', () => {
  let state = fresh()
  const departure = {}
  for (let i = 0; i < 240; i++) {
    state = tick(state)
    for (const agent of state.agents) {
      if (agent.movement?.route.length && departure[agent.id] === undefined) departure[agent.id] = i / 10
    }
  }
  assert.ok(departure.developer < departure.marketing)
  assert.ok(departure.marketing < departure.research)
  const waits = agentRoutines.marketing.find((step) => step.destination === 'meeting').durationSeconds
  assert.equal(waits, routineTiming.meeting)
  const timed = advanceBehavior(fresh().agents, createRoutineState('running'), 0.1)
  const paused = { ...timed, routine: { ...timed.routine, mode: 'paused' } }
  assert.equal(run(paused, 20).routine.agents.developer.remainingSeconds, timed.routine.agents.developer.remainingSeconds)
})

test('pause finishes an in-flight route, reports its arrival and freezes all subsequent decisions', () => {
  let state = run(fresh(), 11)
  assert.equal(state.agents[0].status, 'walking')
  state = { ...state, routine: { ...state.routine, mode: 'paused' } }
  state = run(state, 12)
  assert.equal(state.routine.mode, 'paused')
  assert.deepEqual(state.agents[0].position, destinationPosition('developer', 'center'))
  assert.equal(state.agents[0].currentActivity, 'At the center')
  assert.equal(state.routine.agents.developer.remainingSeconds, routineTiming.center)
  assert.equal(state.agents.some((agent) => agent.movement), false)
  const frozen = structuredClone(state)
  state = run(state, 20)
  assert.deepEqual(state, frozen)
  state = { ...state, routine: { ...state.routine, mode: 'running' } }
  state = run(state, 3)
  assert.equal(state.agents[0].movement.destination, 'coffee')
})

test('restart completes the current segment and walks home without teleporting or restarting itself', () => {
  let state = run(fresh(), 23)
  assert.ok(state.agents.some((agent) => agent.movement))
  state = { ...state, routine: createRoutineState('resetting') }
  const before = structuredClone(state.agents)
  const next = advanceBehavior(state.agents, state.routine, 0.1)
  next.agents.forEach((agent, i) => assert.deepEqual(agent.position, before[i].position))
  state = run(next, 30)
  assert.equal(state.routine.mode, 'stopped')
  state.agents.forEach((agent) => {
    assert.deepEqual(agent.position, destinationPosition(agent.id, 'desk'))
    assert.equal(agent.movement, null)
    assert.equal(agent.status, agent.id === 'marketing' ? 'idle' : 'working')
  })
  assert.deepEqual(run(state, 15), state)
})

test('store blocks manual commands for running, paused and resetting routines and preserves selection', () => {
  useAgentStore.setState({ agents: structuredClone(initialAgents), routine: createRoutineState(), selectedAgentId: 'research' })
  useAgentStore.getState().startRoutine()
  for (const mode of ['running', 'paused', 'resetting']) {
    useAgentStore.setState({ routine: createRoutineState(mode) })
    const before = useAgentStore.getState().agents
    useAgentStore.getState().moveAgent('developer', 'coffee')
    assert.equal(useAgentStore.getState().agents, before)
    assert.equal(useAgentStore.getState().selectedAgentId, 'research')
  }
  useAgentStore.setState({ routine: createRoutineState('paused') })
  useAgentStore.getState().startRoutine()
  assert.equal(useAgentStore.getState().routine.mode, 'running')
  useAgentStore.getState().pauseRoutine()
  assert.equal(useAgentStore.getState().routine.mode, 'paused')
  useAgentStore.getState().restartRoutine()
  assert.equal(useAgentStore.getState().routine.mode, 'resetting')
  useAgentStore.setState({ routine: createRoutineState() })
  useAgentStore.getState().moveAgent('developer', 'coffee')
  assert.equal(useAgentStore.getState().agents[0].movement.destination, 'coffee')
})

test('waiting ticks preserve agent references so the static 3D scene can rest', () => {
  const started = advanceBehavior(fresh().agents, createRoutineState('running'), 0.1)
  const next = advanceBehavior(started.agents, started.routine, 0.1)
  assert.equal(next.agents, started.agents)
  assert.notEqual(next.routine, started.routine)
  assert.ok(next.routine.agents.developer.remainingSeconds < started.routine.agents.developer.remainingSeconds)
})

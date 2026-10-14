import assert from 'node:assert/strict'
import { after, beforeEach, test } from 'node:test'
import { createServer } from 'vite'

const server = await createServer({ configFile: false, cacheDir: 'node_modules/.vite-workspace-tests', server: { middlewareMode: true, ws: false }, appType: 'custom' })
after(() => server.close())
const { useAgentStore } = await server.ssrLoadModule('/src/agents/useAgentStore.ts')
const { initialAgents } = await server.ssrLoadModule('/src/agents/agentData.ts')
const { initialTasks } = await server.ssrLoadModule('/src/tasks/taskData.ts')
const { initialParticipants } = await server.ssrLoadModule('/src/participants/participantData.ts')
const { createRoutineState } = await server.ssrLoadModule('/src/agents/agentRoutine.ts')
const { parseBackup, MAX_BACKUP_BYTES } = await server.ssrLoadModule('/src/tasks/taskBackup.ts')
const { loadTasks, saveTasks, persistBusinessChange, TASK_STORAGE_KEY } = await server.ssrLoadModule('/src/tasks/taskStorage.ts')
const state = () => useAgentStore.getState()
const task = (id) => state().tasks.find((item) => item.id === id)
const agent = (id) => state().agents.find((item) => item.id === id)
const draft = (fields = {}) => ({ title: 'Preparar proposta', description: 'Objetivos do trabalho', priority: 'normal', dueDate: null, assigneeId: null, ...fields })
function create(fields = {}) { const result = state().createTask(draft(fields)); assert.equal(result.ok, true, result.error); return result.taskId }
function settle() { for (let i = 0; state().agents.some((item) => item.movement) && i < 2400; i++) state().advanceMovement(1 / 60); assert.equal(state().agents.some((item) => item.movement), false) }
function person() { const result = state().savePerson({ name: 'Ana', role: 'Operações' }); assert.equal(result.ok, true); return result.participantId }
function fakeStorage(raw = null) {
  const entries = new Map(raw === null ? [] : [[TASK_STORAGE_KEY, raw]])
  let writes = 0
  return { getItem: (key) => entries.get(key) ?? null, setItem: (key, value) => { writes++; entries.set(key, value) }, entries, writes: () => writes }
}
beforeEach(() => {
  useAgentStore.setState({ agents: structuredClone(initialAgents), tasks: structuredClone(initialTasks), participants: structuredClone(initialParticipants), workspaceMode: 'demo', routine: createRoutineState(), selectedAgentId: null, hoveredAgentId: null, storageStatus: { kind: 'saved', message: 'Ready', savedAt: null }, recoveryText: null })
  state().setWorkspaceMode('tasks')
})

test('creates/edits a task with metadata, immutable history and stable identity', () => {
  const id = create({ title: '  Proposta comercial  ', description: '  Briefing  ', priority: 'high', dueDate: '2026-10-20' })
  const first = task(id)
  assert.equal(first.title, 'Proposta comercial')
  assert.equal(first.description, 'Briefing')
  assert.equal(first.status, 'inbox')
  assert.equal(first.history.length, 1)
  assert.equal(state().editTask(id, draft({ title: 'Proposta revisada', priority: 'low' })).ok, true)
  assert.equal(task(id).id, id)
  assert.equal(task(id).createdAt, first.createdAt)
  assert.equal(task(id).history.length, 2)
  assert.equal(first.history.length, 1)
  assert.equal(task(id).priority, 'low')
})

test('assigned creation queues behind the current task and never replaces it', () => {
  const id = create({ assigneeId: 'developer' })
  assert.equal(task(id).status, 'scheduled')
  assert.equal(agent('developer').currentTaskId, 'landing-page')
  assert.equal(state().commandTask(id, { type: 'start' }).ok, false)
})

test('rejects blank/oversized text, invalid dates, priorities and unknown owners atomically', () => {
  for (const fields of [{ title: ' ' }, { title: 'x'.repeat(161) }, { description: 'x'.repeat(5001) }, { dueDate: '2026-02-30' }, { dueDate: 'bad' }, { priority: 'urgent' }, { assigneeId: 'missing' }]) {
    const before = state()
    assert.equal(state().createTask(draft(fields)).ok, false)
    assert.equal(state(), before)
  }
  assert.equal(task(create({ dueDate: '2028-02-29' })).dueDate, '2028-02-29')
})

test('reassignment clears the previous desk link without stealing an active agent task', () => {
  assert.equal(state().editTask('campaign', draft({ assigneeId: 'research' })).ok, true)
  assert.equal(agent('marketing').currentTaskId, null)
  assert.equal(agent('research').currentTaskId, 'competitors')
  assert.equal(task('campaign').assigneeId, 'research')
})

test('active metadata edits preserve the walking route and latest title wins on arrival', () => {
  state().setWorkspaceMode('demo'); state().moveAgent('developer', 'coffee'); settle(); state().setWorkspaceMode('tasks')
  const route = agent('developer').movement
  const position = [...agent('developer').position]
  assert.equal(state().editTask('landing-page', draft({ assigneeId: 'marketing' })).ok, false)
  assert.equal(state().editTask('landing-page', draft({ title: 'Página revisada', assigneeId: 'developer' })).ok, true)
  assert.equal(agent('developer').movement, route)
  assert.deepEqual(agent('developer').position, position)
  settle()
  assert.equal(agent('developer').currentActivity, 'Página revisada')
})

test('queued task linked during another in-flight route cannot change owner until arrival', () => {
  state().setWorkspaceMode('demo'); state().moveAgent('developer', 'coffee'); settle(); state().setWorkspaceMode('tasks')
  state().commandTask('landing-page', { type: 'complete' })
  const id = create({ assigneeId: 'developer' })
  assert.equal(agent('developer').currentTaskId, id)
  assert.equal(state().editTask(id, draft({ assigneeId: 'marketing' })).ok, false)
  settle()
  assert.equal(state().editTask(id, draft({ assigneeId: 'marketing' })).ok, true)
})

test('registers/edits a human without changing the office or permitting agent edits', () => {
  const agents = state().agents
  const id = person()
  assert.equal(state().agents, agents)
  assert.equal(state().savePerson({ name: 'Ana Silva', role: 'Gestão' }, id).ok, true)
  assert.equal(state().participants.find((item) => item.id === id).name, 'Ana Silva')
  const before = state()
  assert.equal(state().savePerson({ name: 'Changed', role: '' }, 'developer').ok, false)
  assert.equal(state().savePerson({ name: ' ', role: '' }).ok, false)
  assert.equal(state(), before)
})

test('humans have one active task and their workflow does not move/render agents', () => {
  const id = person()
  const first = create({ assigneeId: id })
  const second = create({ assigneeId: id })
  const agents = state().agents
  state().commandTask(first, { type: 'start' })
  assert.equal(state().commandTask(second, { type: 'start' }).ok, false)
  state().commandTask(first, { type: 'attention', reason: 'question', note: 'Falta o briefing' })
  assert.equal(task(first).attentionNote, 'Falta o briefing')
  assert.equal(state().commandTask(second, { type: 'start' }).ok, false)
  state().commandTask(first, { type: 'start' })
  state().commandTask(first, { type: 'complete' })
  assert.equal(state().commandTask(second, { type: 'start' }).ok, true)
  assert.equal(state().agents, agents)
})

test('delivery waits for review, prevents bypass, and approval concludes at 100%', () => {
  state().commandTask('landing-page', { type: 'deliver', summary: 'Página preparada', url: 'https://example.com/result' })
  assert.equal(task('landing-page').status, 'needs_attention')
  assert.equal(agent('developer').status, 'idle')
  assert.equal(task('landing-page').deliveries[0].review, 'pending')
  assert.equal(state().commandTask('landing-page', { type: 'start' }).ok, false)
  assert.equal(state().commandTask('landing-page', { type: 'complete' }).ok, false)
  assert.equal(state().commandTask('landing-page', { type: 'approve' }).ok, true)
  assert.equal(task('landing-page').progress, 100)
  assert.equal(agent('developer').status, 'finished')
  assert.equal(task('landing-page').history.at(-1).type, 'approved')
})

test('requesting changes requires a reason, allows another delivery and preserves prior reviews', () => {
  state().commandTask('landing-page', { type: 'deliver', summary: 'Versão inicial', url: null })
  const before = state()
  assert.equal(state().commandTask('landing-page', { type: 'request_changes', note: ' ' }).ok, false)
  assert.equal(state(), before)
  state().commandTask('landing-page', { type: 'request_changes', note: 'Ajustar o título' })
  assert.equal(task('landing-page').attentionNote, 'Ajustar o título')
  state().commandTask('landing-page', { type: 'start' })
  assert.equal(task('landing-page').attentionNote, null)
  state().commandTask('landing-page', { type: 'deliver', summary: 'Título revisado', url: null })
  state().commandTask('landing-page', { type: 'approve' })
  assert.deepEqual(task('landing-page').deliveries.map((item) => item.review), ['changes_requested', 'approved'])
})

test('rejects unsafe/credential-bearing links and empty deliveries without partial changes', () => {
  for (const url of ['javascript:alert(1)', 'file:///secret', 'https://user:password@example.com', 'invalid']) {
    const before = state()
    assert.equal(state().commandTask('landing-page', { type: 'deliver', summary: 'Work', url }).ok, false)
    assert.equal(state(), before)
  }
  assert.equal(state().commandTask('landing-page', { type: 'deliver', summary: ' ', url: null }).ok, false)
})

test('submitting and approving during walking preserves the route and rechecks arrival', () => {
  state().setWorkspaceMode('demo'); state().moveAgent('developer', 'coffee'); settle(); state().setWorkspaceMode('tasks')
  const route = agent('developer').movement
  state().commandTask('landing-page', { type: 'deliver', summary: 'Entrega durante retorno', url: null })
  assert.equal(agent('developer').movement, route)
  state().commandTask('landing-page', { type: 'approve' })
  assert.equal(agent('developer').status, 'walking')
  settle()
  assert.equal(agent('developer').status, 'finished')
})

test('exports/restores tasks, humans, deliveries and history in a versioned round trip', () => {
  const owner = person()
  const id = create({ assigneeId: owner })
  state().commandTask(id, { type: 'start' })
  state().commandTask(id, { type: 'deliver', summary: 'Proposta pronta', url: null })
  const json = state().exportTasks()
  const parsed = parseBackup(json)
  assert.equal(parsed.ok, true, parsed.error)
  assert.equal(parsed.snapshot.version, 2)
  const before = parsed.snapshot
  state().commandTask(id, { type: 'approve' })
  assert.equal(state().importTasks(json).ok, true)
  assert.deepEqual(state().tasks, before.tasks)
  assert.deepEqual(state().participants, before.participants)
})

test('valid import preserves selection/positions and does not reset the camera through the store', () => {
  const json = state().exportTasks()
  state().setWorkspaceMode('demo'); state().moveAgent('marketing', 'meeting'); settle(); state().setWorkspaceMode('tasks')
  state().selectAgent('marketing')
  const positions = state().agents.map((item) => [...item.position])
  assert.equal(state().importTasks(json).ok, true)
  assert.equal(state().selectedAgentId, 'marketing')
  assert.deepEqual(state().agents.map((item) => item.position), positions)
})

test('invalid imports and imports during routines/routes leave all current data intact', () => {
  const json = state().exportTasks()
  const before = state()
  assert.equal(state().importTasks('{bad').ok, false)
  assert.equal(state(), before)
  state().setWorkspaceMode('demo'); state().startRoutine()
  const running = state()
  assert.equal(state().importTasks(json).ok, false)
  assert.equal(state(), running)
  useAgentStore.setState({ routine: createRoutineState() })
  state().moveAgent('developer', 'coffee')
  const moving = state()
  assert.equal(state().importTasks(json).ok, false)
  assert.equal(state(), moving)
})

test('rejects duplicate ids, dangling links, unknown owners and conflicting active tasks', () => {
  const good = JSON.parse(state().exportTasks())
  for (const mutate of [
    (data) => data.tasks.push(structuredClone(data.tasks[0])),
    (data) => { data.currentTaskIds.developer = 'missing' },
    (data) => { data.tasks[0].assigneeId = 'missing' },
    (data) => { data.tasks.push({ ...data.tasks[0], id: 'second-active' }) },
    (data) => data.participants.push(structuredClone(data.participants[0])),
    (data) => { data.participants[0].name = 'Tampered' },
  ]) { const data = structuredClone(good); mutate(data); assert.equal(parseBackup(JSON.stringify(data)).ok, false) }
})

test('rejects malformed history, dates, progress, links and pending-review combinations', () => {
  state().commandTask('landing-page', { type: 'deliver', summary: 'Deliverable', url: null })
  const good = JSON.parse(state().exportTasks())
  for (const mutate of [
    (item) => { item.progress = 100 },
    (item) => { item.dueDate = '2026-02-30' },
    (item) => { item.history[0].type = 'unknown' },
    (item) => { item.deliveries[0].url = 'javascript:alert(1)' },
    (item) => { item.status = 'working'; item.attentionReason = null },
    (item) => { item.deliveries.push({ ...item.deliveries[0], id: 'another-pending' }) },
  ]) { const data = structuredClone(good); mutate(data.tasks[0]); assert.equal(parseBackup(JSON.stringify(data)).ok, false) }
})

test('migrates version 1 agent backups without discarding their task state', () => {
  const data = JSON.parse(state().exportTasks())
  data.version = 1; delete data.participants
  data.tasks = data.tasks.map((item) => {
    const legacy = { ...item, assignedAgentId: item.assigneeId }
    for (const key of ['assigneeId', 'attentionNote', 'history', 'deliveries', 'priority', 'dueDate']) delete legacy[key]
    return legacy
  })
  const parsed = parseBackup(JSON.stringify(data))
  assert.equal(parsed.ok, true, parsed.error)
  assert.equal(parsed.snapshot.tasks[0].assigneeId, 'developer')
  assert.equal(parsed.snapshot.tasks[0].progress, 72)
  assert.equal(parsed.snapshot.tasks[0].priority, 'normal')
  assert.equal(parsed.snapshot.participants.length, 3)
})

test('corrupted storage is preserved and blocked from automatic overwrite', () => {
  const storage = fakeStorage('{broken')
  const loaded = loadTasks(storage)
  assert.equal(loaded.status.kind, 'blocked')
  assert.equal(loaded.recoveryText, '{broken')
  const previous = state()
  const next = { ...previous, tasks: [...previous.tasks], storageStatus: loaded.status }
  assert.equal(persistBusinessChange(next, previous, storage), null)
  assert.equal(storage.getItem(TASK_STORAGE_KEY), '{broken')
  assert.equal(storage.writes(), 0)
})

test('quota/read failures fall back to memory and do not erase the open work', () => {
  const blocked = { getItem: () => { throw Error('Denied') }, setItem: () => { throw Error('Quota') } }
  assert.equal(loadTasks(blocked).status.kind, 'memory')
  const parsed = parseBackup(state().exportTasks())
  assert.equal(saveTasks(blocked, parsed.snapshot).kind, 'memory')
  assert.equal(state().tasks.length, 5)
})

test('persistence writes business changes only, never motion, selection or routine ticks', () => {
  const storage = fakeStorage()
  let previous = state()
  state().selectAgent('research')
  assert.equal(persistBusinessChange(state(), previous, storage), null)
  state().setWorkspaceMode('demo'); state().moveAgent('developer', 'coffee')
  previous = state(); state().advanceMovement(1 / 60)
  assert.equal(persistBusinessChange(state(), previous, storage), null)
  settle(); state().setWorkspaceMode('tasks'); settle()
  previous = state(); state().commandTask('landing-page', { type: 'progress', value: 73 })
  assert.equal(persistBusinessChange(state(), previous, storage).kind, 'saved')
  previous = state(); state().commandTask('landing-page', { type: 'progress', value: 73 })
  assert.equal(persistBusinessChange(state(), previous, storage), null)
  assert.equal(storage.writes(), 1)
  const loaded = loadTasks(storage)
  assert.equal(loaded.snapshot.tasks[0].progress, 73)
})

test('backup byte limit and capacity guards keep exported data restorable', () => {
  assert.equal(parseBackup('x'.repeat(MAX_BACKUP_BYTES + 1)).ok, false)
  let rejected = false
  for (let i = 0; i < 500; i++) {
    const before = state()
    const result = state().createTask(draft({ title: `Task ${i}`, description: 'x'.repeat(5000) }))
    if (!result.ok) { rejected = true; assert.equal(state(), before); break }
  }
  assert.equal(rejected, true)
  assert.equal(parseBackup(state().exportTasks()).ok, true)
})

test('task/human editing remains blocked in demonstration mode', () => {
  state().setWorkspaceMode('demo')
  const before = state()
  assert.equal(state().createTask(draft()).ok, false)
  assert.equal(state().editTask('campaign', draft()).ok, false)
  assert.equal(state().savePerson({ name: 'Ana', role: '' }).ok, false)
  assert.equal(state(), before)
})

import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createServer } from 'vite'

const server = await createServer({ configFile: false, cacheDir: 'node_modules/.vite-navigation-tests', server: { middlewareMode: true }, appType: 'custom' })
after(() => server.close())
const { createMovement, stepAgent, WALK_SPEED } = await server.ssrLoadModule('/src/agents/agentNavigation.ts')
const { initialAgents } = await server.ssrLoadModule('/src/agents/agentData.ts')
const { destinationPosition } = await server.ssrLoadModule('/src/agents/officeWaypoints.ts')
const { officeLayout } = await server.ssrLoadModule('/src/components/office/officeLayout.ts')
const destinations = ['desk', 'center', 'meeting', 'coffee', 'idle']

function start(agent, destination) {
  const movement = createMovement(agent, destination)
  return movement ? { ...agent, movement, status: 'walking' } : agent
}
function simulate(agent, seconds, fps) {
  for (let frame = 0; frame < seconds * fps; frame++) agent = stepAgent(agent, 1 / fps)
  return agent
}

test('same elapsed time produces the same position and rotation at 20, 30 and 120 FPS', () => {
  const agent = start(initialAgents[0], 'meeting')
  const reference = simulate(agent, 3, 120)
  for (const fps of [20, 30, 60]) {
    const result = simulate(agent, 3, fps)
    result.position.forEach((value, axis) => assert.ok(Math.abs(value - reference.position[axis]) < 1e-8))
    assert.ok(Math.abs(result.rotationY - reference.rotationY) < 1e-8)
    assert.equal(result.status, 'walking')
  }
})

test('walks without teleporting; arrival changes status and restores monitor orientation', () => {
  let agent = start(initialAgents[0], 'center')
  const first = stepAgent(agent, 1 / 60)
  assert.ok(Math.hypot(first.position[0] - agent.position[0], first.position[2] - agent.position[2]) <= WALK_SPEED / 60 + 1e-9)
  agent = simulate(agent, 10, 60)
  assert.deepEqual(agent.position, [0, 0, 0.5])
  assert.equal(agent.status, 'idle')
  assert.equal(agent.movement, null)
  agent = simulate(start(agent, 'desk'), 12, 60)
  assert.deepEqual(agent.position, initialAgents[0].position)
  assert.equal(agent.status, 'working')
  assert.equal(agent.rotationY, -0.59)
  assert.equal(agent.currentTask, initialAgents[0].currentTask)
  assert.equal(agent.progress, 72)
})

test('ignores current location and protects in-flight routes from replacement', () => {
  assert.equal(createMovement(initialAgents[0], 'desk'), null)
  assert.equal(createMovement(start(initialAgents[0], 'center'), 'coffee'), null)
  const marketing = simulate(start(initialAgents[1], 'meeting'), 10, 60)
  assert.equal(marketing.status, 'idle')
  assert.equal(simulate(start(marketing, 'desk'), 12, 60).status, 'idle')
})

test('all predefined routes leave clearance from desks, chairs, storage, plants and walls', () => {
  const rectangles = officeLayout.stations.flatMap((s) => [
    [s.x - 0.9, s.x + 0.9, s.z - 0.4, s.z + 0.4],
    [s.x - 0.345, s.x + 0.345, s.z + 1.05 - 0.345, s.z + 1.05 + 0.345],
  ])
  rectangles.push([-5.66, -4.94, 0.2, 2.2])
  const plants = [[-5.15, -3.55], [5.15, -3.55], [-5.2, 3.5], [5.2, 3.45]]
  const radius = 0.36
  for (const initial of initialAgents) {
    for (const from of destinations) {
      const agent = { ...initial, position: [...destinationPosition(initial.id, from)] }
      for (const to of destinations) {
        const movement = createMovement(agent, to)
        if (!movement) continue
        let previous = agent.position
        for (const point of movement.route) {
          for (let step = 0; step <= 100; step++) {
            const t = step / 100
            const x = previous[0] + (point[0] - previous[0]) * t
            const z = previous[2] + (point[2] - previous[2]) * t
            const label = `${initial.id}: ${from} -> ${to} at ${x}, ${z}`
            assert.ok(Math.abs(x) + radius < officeLayout.width / 2 - 0.08, label)
            assert.ok(Math.abs(z) + radius < officeLayout.depth / 2 - 0.08, label)
            for (const [minX, maxX, minZ, maxZ] of rectangles) {
              const dx = Math.max(minX - x, 0, x - maxX)
              const dz = Math.max(minZ - z, 0, z - maxZ)
              assert.ok(Math.hypot(dx, dz) > radius, label)
            }
            for (const [px, pz] of plants) assert.ok(Math.hypot(x - px, z - pz) > radius + 0.5, label)
          }
          previous = point
        }
      }
    }
  }
})

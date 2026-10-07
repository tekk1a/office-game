import { useEffect } from 'react'
import { useAgentStore } from './useAgentStore'
import { routineTiming } from './agentRoutine'

// One nonvisual scheduler. Cleanup also prevents duplicate timers in React StrictMode.
export function useAgentBehavior() {
  const mode = useAgentStore((state) => state.routine.mode)
  useEffect(() => {
    if (mode === 'stopped') return
    let previous = performance.now()
    const timer = window.setInterval(() => {
      const now = performance.now()
      const delta = Math.min((now - previous) / 1000, routineTiming.maxDeltaSeconds)
      previous = now
      useAgentStore.getState().advanceBehavior(delta)
    }, routineTiming.tickMs)
    return () => { window.clearInterval(timer) }
  }, [mode])
}

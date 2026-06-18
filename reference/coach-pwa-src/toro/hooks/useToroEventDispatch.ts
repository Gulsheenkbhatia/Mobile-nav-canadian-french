import { useCallback, useContext } from 'react'
import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'
import isBrowser from 'toro/helpers/isBrowser'

type ToroDispatchEventPayload =
  | { type: 'on-add-to-cart' }
  | { type: 'on-route-change'; initial: boolean }
  | { type: 'on-listing-lazy-load'; page: number }
  | { type: 'on-remove-callout-slide'; index: number }

type WindowWithOptimizely = Window &
  typeof globalThis & {
    optimizely: { [key: string]: any; initialized: boolean }
  }

export type DispatchToroEvent = ({ type, ...detail }: ToroDispatchEventPayload) => void

let queuedEvents = []
let resolveDispatchPromiseInterval: NodeJS.Timer
let retryLimit = 8

const dispatchQueuedEvents = () => {
  queuedEvents.forEach(window.dispatchEvent)
  queuedEvents = []
}

const dispatchToroEvent: DispatchToroEvent = ({ type, ...detail }) => {
  if (!isBrowser()) {
    return
  }
  queuedEvents.push(new CustomEvent(`toro:${type}`, { detail }))
  // Emit events if optimizely is initialized
  if ((<WindowWithOptimizely>window).optimizely?.initialized) {
    dispatchQueuedEvents()
    return
  }
  // Otherwise start timer to dispatch events after it initializes
  if (!resolveDispatchPromiseInterval) {
    resolveDispatchPromiseInterval = setInterval(() => {
      if (--retryLimit === 0 || !queuedEvents.length) {
        clearInterval(resolveDispatchPromiseInterval)
      }
      if ((<WindowWithOptimizely>window).optimizely?.initialized) {
        dispatchQueuedEvents()
      }
    }, 500)
  }
}

const useToroEventsDispatch = () => {
  const { appData } = useContext(PWAContext)
  const enableOptimizely = get(appData, 'enableOptimizely', false)

  return useCallback<DispatchToroEvent>(
    (...args) => {
      if (enableOptimizely) {
        return dispatchToroEvent(...args)
      }
    },
    [enableOptimizely]
  )
}

export default useToroEventsDispatch

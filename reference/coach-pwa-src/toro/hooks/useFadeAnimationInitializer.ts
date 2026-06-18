import { useEffect, useRef, useState } from 'react'

type CleanupFn = () => void

export async function fadeAnimationInitializer(
  node: HTMLElement,
  signal?: AbortSignal
): Promise<CleanupFn | undefined> {
  if (signal?.aborted) return
  const { initAllFadeAnimations } = await import('toro/helpers/initFadeAnimation')
  if (signal?.aborted) return
  return initAllFadeAnimations(node)
}

export function useFadeAnimationInitializer() {
  const [node, setNode] = useState<HTMLElement | null>(null)
  const cleanupFunctions = useRef<CleanupFn[]>([])

  useEffect(() => {
    if (!node) return

    if (!node.querySelector('[data-fade]')) return

    const controller = new AbortController()
    const { signal } = controller

    void fadeAnimationInitializer(node, signal).then((cleanup) => {
      if (!cleanup) return
      // If aborted after init completed, tear down immediately—cleanup was never pushed to the ref.
      if (signal.aborted) {
        cleanup()
        return
      }
      cleanupFunctions.current.push(cleanup)
    })

    return () => {
      controller.abort()

      cleanupFunctions.current.forEach((fn) => fn?.())
      cleanupFunctions.current = []
    }
  }, [node])

  return setNode
}

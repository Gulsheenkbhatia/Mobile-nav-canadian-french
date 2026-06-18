import { ComponentType, FunctionComponent, useCallback, useMemo, useState } from 'react'
import get from 'lodash/get'

type OffloadOptions<P> = {
  fallback?: ComponentType<P>
  forceLoad?: boolean
}

type WithOffloadReturn<P> = [() => void, FunctionComponent<P>]

/**
 * Higher-order component used to offload dynamically imported component until load function is called.
 * @param {ComponentType<P>} DynamicComponent Component to offload. This component should be imported
 * dynamically with next/dynamic.
 * @param {OffloadOptions} [options] offload options.
 * @param {ComponentType<P>} [options.fallback] fallback component to render until main component is loaded.
 * @param {boolean} [options.forceLoad] allows to forcefully load component under specific condition.
 * @returns {WithOffloadReturn} Returns a tuple of function to load dynamic component imperatively and offloaded component to render.
 */
const useWithOffload = function <P>(
  DynamicComponent: ComponentType<P>,
  options?: OffloadOptions<P>
): WithOffloadReturn<P> {
  const defaultLoaded = get(options, 'forceLoad', false)
  const FallbackComponent = get(options, 'fallback', () => null)
  const [loaded, setLoaded] = useState(defaultLoaded)

  const load = useCallback(() => {
    setLoaded(true)
  }, [])

  const OffloadedComponent = (props: P) => {
    return loaded ? <DynamicComponent {...props} /> : <FallbackComponent {...props} />
  }

  return useMemo(() => [load, OffloadedComponent], [loaded])
}

export default useWithOffload

import { ComponentType, PropsWithChildren, useMemo, useRef } from 'react'
import usePreference from 'toro/hooks/usePreference_new'
import isEmpty from 'lodash/isEmpty'
type ToggleableProps = PropsWithChildren<{
  config: Parameters<typeof usePreference>[0]
  callback: (payload: ReturnType<typeof usePreference>) => boolean
  fallback?: JSX.Element
}>

/**
 * Toggleable component for conditional rendering of children based on user preferences.
 *
 * @param {ToggleableProps} props - Props for the component.
 * @param {object} props.config - Configuration object passed to usePreference hook.
 * @param {(payload: ReturnType<typeof usePreference>) => boolean} props.callback - Function that receives preferences and returns a boolean to determine rendering.
 * @param {JSX.Element} [props.fallback] - Optional fallback element to render when condition is not met.
 * @param {React.ReactNode} props.children - Children elements to render when condition is met.
 *
 * @returns {JSX.Element | null} Rendered children if condition is met, otherwise fallback or null.
 */
const Toggleable: ComponentType<ToggleableProps> = ({
  config,
  callback,
  fallback = null,
  children,
}) => {
  const preferences = usePreference(config)
  const callbackRef = useRef(callback)
  const condition = useMemo(() => {
    if (!callbackRef.current || isEmpty(preferences)) {
      return false
    }
    return callbackRef.current(preferences)
  }, [preferences])

  if (!condition) {
    return fallback
  }

  return <>{children}</>
}

export default Toggleable

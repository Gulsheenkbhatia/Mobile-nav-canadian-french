import { ComponentType } from 'react'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'

/**
 * Higher-order component used to render component only for one coach site.
 */
const withOneSite = function <T>(
  Component: ComponentType<T>,
  FallbackComponent: ComponentType<T> = () => null
): ComponentType<T> {
  return (props: T) => {
    const preferences = usePreference({
      OneSite: ['enableOneSite'],
    })

    const enableOneSite = get(preferences, 'oneSite.enableOneSite', false)

    return enableOneSite ? <Component {...props} /> : <FallbackComponent {...props} />
  }
}

export default withOneSite

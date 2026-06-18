import { ComponentType, useCallback } from 'react'
import Toggleable from 'toro/components/Toggleable'
import { XgenContainerID } from 'toro/lib/xgen'

const defaultDisabledSchemes = []

/**
 * Higher-order component (HOC) for validating a scheme against user preferences.
 *
 * Wraps two components: ComponentA (primary) and ComponentB (fallback).
 * Renders ComponentA unless the user's preferences disable its scheme,
 * in which case ComponentB is rendered as a fallback.
 *
 * Uses the Toggleable component and a callback to determine if the scheme
 * is disabled in user preferences.
 *
 * @template T - Props type, must include a `type: string` property.
 * @param {React.ComponentType<T>} ComponentA - Primary component to render.
 * @param {React.ComponentType<T>} ComponentB - Fallback component to render if scheme is disabled.
 * @returns {React.FC<T>} Component that conditionally renders based on scheme validation.
 */
const withSchemeValidation = function <T>(
  ComponentA: ComponentType<T>,
  ComponentB: ComponentType<any>
) {
  return (props: T & { type?: string; [key: string]: any }) => {
    const { type, ...rest } = props

    const schemeMatchingCallback = useCallback(
      ({ recommendations: { disabledSchemes = defaultDisabledSchemes } }) => {
        const containerId = XgenContainerID[type]
        return !disabledSchemes.includes(containerId)
      },
      [type]
    )

    // Handle null ComponentA during SSR - after all hooks are called
    // ComponentB can legitimately be null as Toggleable accepts null fallback
    if (!ComponentA) {
      return null
    }
    return (
      <Toggleable
        config={{
          recommendations: ['disabledSchemes'],
        }}
        callback={schemeMatchingCallback}
        fallback={ComponentB ? <ComponentB type={type} {...rest} /> : null}
      >
        <ComponentA {...props} />
      </Toggleable>
    )
  }
}

export default withSchemeValidation

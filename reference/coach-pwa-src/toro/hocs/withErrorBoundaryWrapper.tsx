/**
 * This component will catch the rendering/run-time errors of any react component
 * which is wrapped around this HOC
 *
 * Read more about error boundaries and their intended use in the React documentation
 * https://reactjs.org/docs/error-boundaries.html
 *
 */

import React, { forwardRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

/**
 * Add default props here supported by "react-error-boundary" package
 * https://www.npmjs.com/package/react-error-boundary
 *
 * Can also add custom props based on the requirements
 *
 */
const defaultErrorBoundaryProps = {
  fallback: <div />,
}

/**
 * withErrorBoundaryWrapper:
 * This HOC will wrap the passed component over ErrorBoundary from the "react-error-boundary" package
 * This is useful to avoid writing duplicate code and handle/log errors from a single point
 *
 * @param {ReactComponent} WrappedComponent - Component which is wrapped
 * @param {object} errorBoundaryProps - For all supporting props, check link https://www.npmjs.com/package/react-error-boundary
 *
 * @returns Component Wrapped with ErrorBoundary
 */
function withErrorBoundaryWrapper<P = Record<string, unknown>, R = any>(
  WrappedComponent: React.ComponentType<P & React.RefAttributes<R>>,
  errorBoundaryProps = defaultErrorBoundaryProps
) {
  /**
   * Wrapped
   * A functional component where we can define hooks. Will be beneficial to extend its behaviour
   * Always use hooks inside this method and not outside
   *
   * @param {any} props - any props passed to the WrappedComponent
   *
   * @returns {ReactComponent} - return wrapped component with ErrorBoundary wrapper around it
   */
  const Wrapped = forwardRef<R, P>((props, ref) => {
    /**
     * Check https://www.npmjs.com/package/react-error-boundary for props return
     * by onError click handler
     */
    const onClientErrorHandler = (error, info) => {
      console.error({
        error: `Error: OnClientErrorHandler in withErrorBoundaryWrapper and Wrapped Component:${
          WrappedComponent.displayName || WrappedComponent.name
        }`,
        context: {
          error,
          componentName: WrappedComponent?.displayName || WrappedComponent?.name,
          componentStack: info?.componentStack || 'Stack not available',
          componentProps: JSON.stringify(props || {}),
        },
      })
    }

    return (
      <ErrorBoundary onError={onClientErrorHandler} {...errorBoundaryProps}>
        <WrappedComponent {...(props as P)} ref={ref} />
      </ErrorBoundary>
    )
  })

  // For easy debugging in devtool
  const name = WrappedComponent.displayName || WrappedComponent.name || 'WrappedComponent'
  Wrapped.displayName = `withErrorBoundary(${name})`

  return Wrapped
}

export default withErrorBoundaryWrapper

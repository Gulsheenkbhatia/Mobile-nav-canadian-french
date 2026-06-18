import ErrorPage from 'toro/components/ErrorPage'
import get from 'lodash/get'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

export default function withPageErrorHandling(WrappedComponent) {
  return (props) => {
    const [isClientNavigationError, setClientNavigationError] = useState(false)
    const [errorPageContent, setErrorPageContent] = useState('')

    useEffect(() => {
      const resolveLazyPromise = async () => {
        try {
          const lazyData = await props.lazyProps?.lazy
          const locale = lazyData?.appData?.locale

          const content = get(
            lazyData?.contentAssetData,
            `c_body.${locale}.markup`,
            get(lazyData?.contentAssetData, 'c_body.default.markup', '')
          )

          setErrorPageContent(content)

          if (lazyData?.error !== undefined) {
            setClientNavigationError(true)
          } else {
            setClientNavigationError(false)
          }
        } catch (e) {
          setClientNavigationError(true)
        }
      }

      const lazyProps = props?.lazyProps
      if (lazyProps?.lazy) {
        /*
          Rendering from client side, we have to wait for the promise to resolve so we can check if
          the data returned has errors.
         */
        resolveLazyPromise()
      } else if (lazyProps?.error !== undefined) {
        // this will execute on SSR
        const locale = lazyProps?.appData?.locale

        const content = get(
          lazyProps?.contentAssetData,
          `c_body.${locale}.markup`,
          get(lazyProps?.contentAssetData, 'c_body.default.markup', '')
        )

        setErrorPageContent(content)

        setClientNavigationError(true)
      } else {
        setClientNavigationError(false)
      }
    }, [props])

    const onClientErrorHandler = (error, info) => {
      console.error({
        error: `Error: OnClientErrorHandler in withPageErrorHandling and Wrapped Component:${
          WrappedComponent.displayName || WrappedComponent.name
        }`,
        context: {
          error,
          componentName: WrappedComponent?.displayName || WrappedComponent?.name,
          componentStack: info?.componentStack || 'Stack not available',
          props: JSON.stringify(WrappedComponent?.props || {}),
        },
      })
    }

    // SSR error, doesn't need to resolve lazyProps promise
    const isDirectLandingError = get(props, 'lazyProps.error')

    // Check if error occurred during direct landing on the page or during client-side navigation
    if (isDirectLandingError || isClientNavigationError) {
      return <ErrorPage content={errorPageContent} />
    }

    return (
      <ErrorBoundary
        onError={onClientErrorHandler}
        fallback={<ErrorPage content={errorPageContent} />}
      >
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }
}

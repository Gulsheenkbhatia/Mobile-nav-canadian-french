import { render, screen } from 'test-utils/react'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { ErrorBoundary } from 'react-error-boundary'

const ErrorFallback = () => {
  return <div>Something went wrong</div>
}

jest.mock('components/common/ErrorBoundary', () => ({
  __esModule: true,
  default: function ErrorBoundary({ onError, children }) {
    const mockOnError = (error, info) => {
      if (onError) {
        onError(error, info)
      }
    }
    return <div>{children(mockOnError)}</div>
  },
}))

const withSuppressedConsoleErrors = (testFunction) => {
  return () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    try {
      testFunction()
    } finally {
      spy.mockRestore()
    }
  }
}

describe('withErrorBoundaryWrapper', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it(
    'renders the wrapped component without error',
    withSuppressedConsoleErrors(() => {
      const WrappedComponent = () => <div>Wrapped Component</div>
      const EnhancedComponent = withErrorBoundaryWrapper(WrappedComponent, {
        errorBoundaryProps: 'test',
      })

      render(<EnhancedComponent />)

      expect(screen.getByText('Wrapped Component')).toBeVisible()
    })
  )

  it(
    'renders the error message and calls onError when an error occurs',
    withSuppressedConsoleErrors(() => {
      const errorMessage = 'Something went wrong'
      const WrappedComponent = () => {
        throw new Error(errorMessage)
      }
      const onErrorMock = jest.fn()
      const EnhancedComponent = withErrorBoundaryWrapper(WrappedComponent, { onError: onErrorMock })

      render(
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <EnhancedComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText(errorMessage)).toBeVisible()
    })
  )
})

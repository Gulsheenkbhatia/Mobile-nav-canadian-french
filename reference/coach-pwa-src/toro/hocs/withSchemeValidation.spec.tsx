import { render, screen } from '@testing-library/react'
import withSchemeValidation from './withSchemeValidation'

// Mock usePreference hook
jest.mock('toro/hooks/usePreference_new', () => jest.fn())
import usePreference from 'toro/hooks/usePreference_new'

jest.mock('toro/lib/xgen', () => ({
  XgenContainerID: {
    foo: 'foo-container',
    bar: 'bar-container',
  },
}))

describe('withSchemeValidation', () => {
  const ComponentA = (props: any) => <div data-testid="A">{props.type}</div>
  const ComponentB = (props: any) => <div data-testid="B">{props.type}</div>
  const Wrapped = withSchemeValidation(ComponentA, ComponentB)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders ComponentA when scheme is not disabled', () => {
    ;(usePreference as jest.Mock).mockReturnValue({ recommendations: { disabledSchemes: [] } })
    render(<Wrapped type="foo" />)
    expect(screen.getByTestId('A')).toBeInTheDocument()
    expect(screen.queryByTestId('B')).not.toBeInTheDocument()
  })

  it('renders ComponentB when scheme is disabled', () => {
    ;(usePreference as jest.Mock).mockReturnValue({
      recommendations: { disabledSchemes: ['foo-container'] },
    })
    render(<Wrapped type="foo" />)
    expect(screen.getByTestId('B')).toBeInTheDocument()
    expect(screen.queryByTestId('A')).not.toBeInTheDocument()
  })

  it('returns null when ComponentA is null during SSR', () => {
    // Simulate SSR scenario where ComponentA is null (e.g., dynamic import with ssr: false)
    const NullComponentWrapped = withSchemeValidation(null as any, ComponentB)
    ;(usePreference as jest.Mock).mockReturnValue({ recommendations: { disabledSchemes: [] } })

    const { container } = render(<NullComponentWrapped type="foo" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders ComponentA when ComponentB is null (valid use case)', () => {
    // Test that ComponentB can legitimately be null as used in RecommendationsContainer
    const NullFallbackWrapped = withSchemeValidation(ComponentA, null as any)
    ;(usePreference as jest.Mock).mockReturnValue({ recommendations: { disabledSchemes: [] } })

    render(<NullFallbackWrapped type="foo" />)
    expect(screen.getByTestId('A')).toBeInTheDocument()
  })
})

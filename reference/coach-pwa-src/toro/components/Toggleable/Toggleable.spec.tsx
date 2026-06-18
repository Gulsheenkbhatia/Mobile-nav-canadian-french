import { render, screen } from '@testing-library/react'
import Toggleable from './index'
import usePreference from 'toro/hooks/usePreference_new'

// Mock usePreference hook
jest.mock('toro/hooks/usePreference_new', () => jest.fn())

describe('Toggleable', () => {
  const config = { group1: ['p1'] }
  const children = <div data-testid="children">Visible</div>
  const fallback = <div data-testid="fallback">Hidden</div>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders children when callback returns true', () => {
    ;(usePreference as jest.Mock).mockReturnValue({ group1: { p1: true } })
    const callback = jest.fn(() => true)
    render(
      <Toggleable config={config} callback={callback}>
        {children}
      </Toggleable>
    )
    expect(screen.getByTestId('children')).toBeInTheDocument()
    expect(screen.queryByTestId('fallback')).not.toBeInTheDocument()
  })

  it('renders fallback when callback returns false', () => {
    ;(usePreference as jest.Mock).mockReturnValue({ group1: { p1: false } })
    const callback = jest.fn(() => false)
    render(
      <Toggleable config={config} callback={callback} fallback={fallback}>
        {children}
      </Toggleable>
    )
    expect(screen.getByTestId('fallback')).toBeInTheDocument()
    expect(screen.queryByTestId('children')).not.toBeInTheDocument()
  })

  it('renders nothing when callback returns false and no fallback', () => {
    ;(usePreference as jest.Mock).mockReturnValue({ group1: { p1: false } })
    const callback = jest.fn(() => false)
    const { container } = render(
      <Toggleable config={config} callback={callback}>
        {children}
      </Toggleable>
    )
    expect(container).toBeEmptyDOMElement()
  })
})

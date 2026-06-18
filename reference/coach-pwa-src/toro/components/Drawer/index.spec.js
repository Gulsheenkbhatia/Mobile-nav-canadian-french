import React from 'react'
import { render, screen } from '@testing-library/react'
import Drawer from './index'
import { Drawer as ChakraUIDrawer } from '@chakra-ui/react'

// Mocking the ChakraUIDrawer to isolate the test
jest.mock('@chakra-ui/react', () => ({
  Drawer: jest.fn(({ children }) => <div data-testid="mock-drawer">{children}</div>),
}))

describe('Drawer Component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders children correctly', () => {
    render(<Drawer>Test Child</Drawer>)
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('renders with minimal props', () => {
    render(<Drawer>Content</Drawer>)
    expect(screen.getByTestId('mock-drawer')).toContainHTML('Content')
  })

  it('applies modified size when variant is "flyout"', () => {
    const size = 'lg'
    const variant = 'flyout'
    render(
      <Drawer size={size} variant={variant}>
        Content
      </Drawer>
    )
    expect(ChakraUIDrawer).toHaveBeenCalledWith(
      expect.objectContaining({
        size: `${variant}-${size}`,
      }),
      expect.anything()
    )
  })

  it('renders with default size when variant is not "flyout"', () => {
    const size = 'md'
    const variant = 'not-flyout'
    render(
      <Drawer size={size} variant={variant}>
        Content
      </Drawer>
    )
    expect(ChakraUIDrawer).toHaveBeenCalledWith(
      expect.objectContaining({
        size: `${size}`,
      }),
      expect.anything()
    )
  })

  it('passes additional props to ChakraUIDrawer', () => {
    const props = { isOpen: true, placement: 'right' }
    render(<Drawer {...props}>Content</Drawer>)
    expect(ChakraUIDrawer).toHaveBeenCalledWith(expect.objectContaining(props), expect.anything())
  })
})

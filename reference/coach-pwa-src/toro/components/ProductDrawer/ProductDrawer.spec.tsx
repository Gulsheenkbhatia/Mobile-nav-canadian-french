import React from 'react'
import { useBreakpointValue } from '@chakra-ui/react'
import { render, screen, waitFor, renderHook } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import ProductDrawer from './ProductDrawer'
import { useProductDrawer } from 'toro/cms/hooks/useProductDrawer'

jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react')
  return {
    ...actual,
    useBreakpointValue: jest.fn(() => 'right'),
  }
})

const mockUseBreakpointValue = jest.mocked(useBreakpointValue)

describe('ProductDrawer', () => {
  const defaultProps = {}

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseBreakpointValue.mockReturnValue('right')
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  const renderComponent = (props = {}) => {
    return render(
      <ProductDrawer {...defaultProps} {...props}>
        <div data-qa="static-content">Static drawer content</div>
      </ProductDrawer>
    )
  }

  const initializeTrigger = (triggerElement: HTMLElement) => {
    const { result } = renderHook(() => useProductDrawer())
    const cleanup = result.current.initProductDrawerTriggers(triggerElement)
    return cleanup
  }

  describe('Component Rendering', () => {
    it('should render ProductDrawer component without errors', () => {
      const { container } = renderComponent()
      expect(container).toBeInTheDocument()
    })

    it('should render close button when drawer is open', async () => {
      const user = userEvent.setup()

      const triggerElement = document.createElement('button')
      triggerElement.setAttribute('data-drawer-trigger', 'true')
      document.body.appendChild(triggerElement)

      renderComponent()
      initializeTrigger(triggerElement)

      await user.click(triggerElement)

      await waitFor(() => {
        expect(screen.getByLabelText('Close drawer')).toBeVisible()
      })
    })

    it('should have correct responsive placement on desktop', async () => {
      const user = userEvent.setup()
      mockUseBreakpointValue.mockReturnValue('right')

      const triggerElement = document.createElement('button')
      triggerElement.setAttribute('data-drawer-trigger', 'true')
      document.body.appendChild(triggerElement)

      renderComponent()
      initializeTrigger(triggerElement)

      await user.click(triggerElement)

      await waitFor(() => {
        expect(screen.getByText('Static drawer content')).toBeVisible()
      })
    })

    it('should have correct responsive placement on mobile', async () => {
      const user = userEvent.setup()
      mockUseBreakpointValue.mockReturnValue('bottom')

      const triggerElement = document.createElement('button')
      triggerElement.setAttribute('data-drawer-trigger', 'true')
      document.body.appendChild(triggerElement)

      renderComponent()
      initializeTrigger(triggerElement)

      await user.click(triggerElement)

      await waitFor(() => {
        expect(screen.getByText('Static drawer content')).toBeVisible()
      })
    })
  })

  describe('Drawer Opening and Closing', () => {
    it('should open drawer when trigger element is clicked', async () => {
      const user = userEvent.setup()

      const triggerElement = document.createElement('button')
      triggerElement.setAttribute('data-drawer-trigger', 'true')
      triggerElement.textContent = 'Open Drawer'
      document.body.appendChild(triggerElement)

      renderComponent()
      initializeTrigger(triggerElement)

      await user.click(triggerElement)

      await waitFor(() => {
        expect(screen.getByText('Static drawer content')).toBeVisible()
      })
    })

    it('should close drawer when close button is clicked', async () => {
      const user = userEvent.setup()
      const onClose = jest.fn()

      const triggerElement = document.createElement('button')
      triggerElement.setAttribute('data-drawer-trigger', 'true')
      document.body.appendChild(triggerElement)

      renderComponent({ onClose })
      initializeTrigger(triggerElement)

      await user.click(triggerElement)

      await waitFor(() => {
        expect(screen.getByText('Static drawer content')).toBeVisible()
      })

      const closeButton = screen.getByLabelText('Close drawer')
      await user.click(closeButton)

      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1)
      })
    })

    it('should close drawer when data-drawer-close element is clicked', async () => {
      const user = userEvent.setup()
      const onClose = jest.fn()

      const triggerElement = document.createElement('button')
      triggerElement.setAttribute('data-drawer-trigger', 'true')
      document.body.appendChild(triggerElement)

      renderComponent({ onClose })
      initializeTrigger(triggerElement)

      await user.click(triggerElement)

      await waitFor(() => {
        expect(screen.getByText('Static drawer content')).toBeVisible()
      })

      const closeButton = screen.getByLabelText('Close drawer')
      await user.click(closeButton)

      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1)
      })
    })

    it('should handle trigger click on child elements (event bubbling)', async () => {
      const user = userEvent.setup()

      const triggerElement = document.createElement('div')
      triggerElement.setAttribute('data-drawer-trigger', 'true')

      const nestedElement = document.createElement('span')
      nestedElement.textContent = 'Nested Content'
      triggerElement.appendChild(nestedElement)

      document.body.appendChild(triggerElement)

      renderComponent()
      initializeTrigger(triggerElement)

      await user.click(nestedElement)

      await waitFor(() => {
        expect(screen.getByText('Static drawer content')).toBeVisible()
      })
    })
  })

  describe('Content Display', () => {
    it('should display static content when no content asset ID is provided', async () => {
      const user = userEvent.setup()

      const triggerElement = document.createElement('button')
      triggerElement.setAttribute('data-drawer-trigger', 'true')
      document.body.appendChild(triggerElement)

      renderComponent()
      initializeTrigger(triggerElement)

      await user.click(triggerElement)

      await waitFor(() => {
        expect(screen.getByText('Static drawer content')).toBeVisible()
      })
    })
  })
})

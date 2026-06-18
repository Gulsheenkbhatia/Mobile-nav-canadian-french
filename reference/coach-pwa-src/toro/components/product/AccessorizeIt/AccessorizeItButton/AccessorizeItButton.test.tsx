import React from 'react'
import { render, screen } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import AccessorizeItButton from 'toro/components/product/AccessorizeIt/AccessorizeItButton'
import { accessorizeItNodeAtom } from 'store/pdp.atom'
import { accessorizeItProductsDataAtom } from 'store/accessorizeIt.atom'
import { showFullProductInfoPdpAtom } from 'store/product-info.atom'

// Mock the dependencies
jest.mock('toro/components/Button', () => ({ children, onClick, ...props }) => (
  <button onClick={onClick} {...props}>
    {children}
  </button>
))

jest.mock('toro/hooks/useMultiStyleConfig', () =>
  jest.fn(() => ({
    accessorizeItButtonWrapper: {},
    accessorizeItButton: {},
    accessorizeItButtonText: {},
  }))
)

jest.mock('toro/components/Box', () => ({ children, ...props }) => <div {...props}>{children}</div>)

jest.mock('toro/components/Text', () => ({ children, ...props }) => (
  <span {...props}>{children}</span>
))

jest.mock('toro/icons', () => ({
  PlusIcon: ({ width, height, viewBox }) => (
    <svg width={width} height={height} viewBox={viewBox} data-qa="plus-icon">
      <path d="M6 0v12M0 6h12" />
    </svg>
  ),
}))

jest.mock('toro/hooks/useSelectedVariantData', () => jest.fn(() => 'variantId'))

jest.mock('toro/analytics/useAnalytics', () =>
  jest.fn(() => ({
    send: jest.fn(),
  }))
)

describe('AccessorizeItButton Component', () => {
  const mockScrollIntoView = jest.fn()
  const mockNode = {
    scrollIntoView: mockScrollIntoView,
  }
  const setup = (
    productsData: { charms?: any[]; straps?: any[] } | null = {
      charms: [{ id: 'charm1' }, { id: 'charm2' }],
      straps: [],
    },
    isExpanded = false
  ) => {
    // Create a map of atom initial values
    // Note: For async atoms in Jotai, we can provide the resolved value directly
    // Jotai will treat it as if the Promise has already resolved
    const initialValues = new Map()
    initialValues.set(accessorizeItNodeAtom, mockNode)
    initialValues.set(accessorizeItProductsDataAtom, productsData ?? {})
    initialValues.set(showFullProductInfoPdpAtom, isExpanded)

    return render(<AccessorizeItButton />, {
      contexts: {
        JotaiProviderContext: initialValues,
      },
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the button with correct text when products are available', () => {
      setup()

      const button = screen.getByRole('button')
      expect(button).toBeVisible()

      const text = screen.getByText('Add a Charm')
      expect(text).toBeVisible()
    })

    it('should render the plus icon when products are available', () => {
      setup()

      const icon = screen.getByTestId('plus-icon')
      expect(icon).toBeVisible()
    })

    it('should not render when products data is empty', () => {
      setup({ charms: [], straps: [] })

      const button = screen.queryByRole('button')
      expect(button).not.toBeInTheDocument()
    })

    // Note: Loading and error states are handled by Suspense boundary in the app
    // These tests focus on the component logic when data is available

    it('should render when only straps are available', () => {
      setup({ charms: [], straps: [{ id: 'strap1' }] })

      const button = screen.getByRole('button')
      expect(button).toBeVisible()
    })

    it('should render when only charms are available', () => {
      setup({ charms: [{ id: 'charm1' }], straps: [] })

      const button = screen.getByRole('button')
      expect(button).toBeVisible()
    })
  })

  describe('User Interactions', () => {
    it('should call scrollIntoView when button is clicked and expanded', async () => {
      const user = userEvent.setup()
      // Set isExpanded to true so scrollIntoView is called immediately
      setup({ charms: [{ id: 'charm1' }] }, true)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(mockScrollIntoView).toHaveBeenCalledTimes(1)
    })
  })
})

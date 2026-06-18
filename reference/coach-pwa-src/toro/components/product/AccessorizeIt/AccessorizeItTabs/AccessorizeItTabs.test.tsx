import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AccessorizeItTabs from 'toro/components/product/AccessorizeIt/AccessorizeItTabs'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { setAccessorizeItNodeAtom, submittableVariantIdAtom } from 'store/pdp.atom'
import {
  accessorizeItProductsDataAtom,
  accessorizeItSelectedProductIDAtom,
  setAccessorizeItSelectedProductIDAtom,
  accessorizeItSelectedProductAtom,
} from 'store/accessorizeIt.atom'
import { selectedVariantInventoryAtom } from 'store/inventory.atom'

jest.mock('toro/hooks/useSelectedVariantData', () => jest.fn(() => 'variantId'))

const mockUseTemplate = jest.fn(() => false)
jest.mock('toro/hooks/useTemplate', () => () => mockUseTemplate())

jest.mock('toro/analytics/useAnalytics', () =>
  jest.fn(() => ({
    send: jest.fn(),
  }))
)

jest.mock('toro/components/Tab', () => ({ children, ...props }) => (
  <button role="tab" {...props}>
    {children}
  </button>
))

jest.mock('toro/components/TabList', () => ({ children, ...props }) => (
  <div role="tablist" {...props}>
    {children}
  </div>
))

jest.mock('toro/components/TabPanel', () => ({ children, ...props }) => (
  <div role="tabpanel" {...props}>
    {children}
  </div>
))

jest.mock('toro/components/TabPanels', () => ({ children, ...props }) => (
  <div {...props}>{children}</div>
))

const mockTabsOnChange = jest.fn()

jest.mock('toro/components/Tabs', () => ({ children, index, onChange, ...props }) => {
  // Store the onChange function for testing
  mockTabsOnChange.mockImplementation(onChange)

  return (
    <div data-testid="tabs" data-index={index} {...props}>
      {children}
    </div>
  )
})

jest.mock('toro/components/Box', () => ({ children, ...props }) => <div {...props}>{children}</div>)

jest.mock('toro/components/Flex', () => ({ children, ...props }) => (
  <div data-testid="flex" {...props}>
    {children}
  </div>
))

jest.mock('toro/components/Text', () => ({ children, ...props }) => (
  <span data-testid="text" {...props}>
    {children}
  </span>
))

jest.mock('toro/components/ScrollableContent', () => ({ children, ...props }) => (
  <div data-testid="scrollable-content" {...props}>
    {children}
  </div>
))

jest.mock(
  'toro/components/AddToBagButton',
  () =>
    ({ variantId, buttonCaption, styles, accessorySku, ...props }) =>
      (
        <button
          data-testid="add-to-bag-button"
          data-variant-id={variantId}
          data-accessory-sku={accessorySku}
          {...props}
        >
          {buttonCaption}
        </button>
      )
)

jest.mock(
  'toro/components/product/AccessorizeIt/AccessoriesProduct',
  () =>
    ({ src, id, isSelected, onChooseProduct, ...props }) =>
      (
        <div
          data-testid={`accessory-product-${id}`}
          data-chosen={isSelected}
          onClick={() => onChooseProduct(id)}
          {...props}
        >
          <img src={src} alt={`Product ${id}`} />
        </div>
      )
)

jest.mock('toro/hooks/useStyles', () =>
  jest.fn(() => ({
    accessorizeItContanerTabsWrapper: {},
    accessorizeItTabs: {},
    accessorizeItTabList: {},
    accessorizeItTab: {},
    accessorizeItTabPanel: {},
    accessorizeItPriceLabel: {},
    accessorizeItPrice: {},
    accessorizeItATBWrapper: {},
    accessorizeItATBButton: {},
    accessorizeItATBButtonText: {},
  }))
)

jest.mock('toro/components/product/AccessorizeIt/hooks', () => ({
  useAccessorizedPrice: jest.fn(),
}))

jest.mock('jotai/utils', () => ({
  useAtomValue: jest.fn(),
  useUpdateAtom: jest.fn(),
  atomWithReset: jest.fn(),
  atomWithStorage: jest.fn(),
  loadable: jest.fn(),
}))

jest.mock('store/pdp.atom', () => ({
  setAccessorizeItNodeAtom: jest.fn(),
  submittableVariantIdAtom: jest.fn(),
}))

jest.mock('store/accessorizeIt.atom', () => ({
  accessorizeItProductsDataAtom: jest.fn(),
  accessorizeItSelectedProductIDAtom: jest.fn(),
  setAccessorizeItSelectedProductIDAtom: jest.fn(),
  accessorizeItSelectedProductAtom: jest.fn(),
}))

jest.mock('store/inventory.atom', () => ({
  selectedVariantInventoryAtom: jest.fn(),
}))

jest.mock('react-intl', () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(({ defaultMessage }) => defaultMessage),
  })),
}))

// Import the mocked hook
import { useAccessorizedPrice } from 'toro/components/product/AccessorizeIt/hooks'

describe('AccessorizeItTabs Component', () => {
  const mockSetAccessorizeItNode = jest.fn()
  const mockSetAccessorizeItSelectedProductID = jest.fn()
  const mockUseAccessorizedPrice = useAccessorizedPrice as jest.MockedFn<
    typeof useAccessorizedPrice
  >
  const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
  const mockedUseUpdateAtom = useUpdateAtom as jest.MockedFn<typeof useUpdateAtom>

  // Helper function to create mock products
  const createMockProducts = (type: string, count = 2) =>
    Array.from({ length: count }, (_, index) => ({
      id: `${type}${index + 1}`,
      imageURL: `https://example.com/${type}${index + 1}.jpg`,
      buyableVariantId: `${type} ${index + 1}`,
    }))

  const mockProductsData = {
    charms: createMockProducts('charm'),
    straps: createMockProducts('strap'),
  }

  // Helper function to create products data with empty arrays
  const createProductsData = (charmsCount = 2, strapsCount = 2) => ({
    charms: charmsCount > 0 ? createMockProducts('charm', charmsCount) : [],
    straps: strapsCount > 0 ? createMockProducts('strap', strapsCount) : [],
  })

  const setup = (
    productsData = mockProductsData,
    selectedProductID = '',
    price = null,
    submittableVariantId = 'main-product-123',
    orderable = true
  ) => {
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === accessorizeItProductsDataAtom) {
        // Return resolved value directly (not Promise) since useAtomValue handles async atoms internally
        return productsData
      }
      if (atom === accessorizeItSelectedProductIDAtom) {
        return selectedProductID
      }
      if (atom === accessorizeItSelectedProductAtom) {
        // Return resolved value directly (not Promise) since useAtomValue handles async atoms internally
        // Search in both charms and straps from the provided productsData
        const allProducts = [...(productsData?.charms || []), ...(productsData?.straps || [])]
        return allProducts.find((product) => product.id === selectedProductID) || null
      }
      if (atom === submittableVariantIdAtom) {
        return submittableVariantId
      }
      if (atom === selectedVariantInventoryAtom) {
        return { orderable }
      }
      return null
    })

    mockedUseUpdateAtom.mockImplementation((atom) => {
      if (atom === setAccessorizeItNodeAtom) {
        return mockSetAccessorizeItNode
      }
      if (atom === setAccessorizeItSelectedProductIDAtom) {
        return mockSetAccessorizeItSelectedProductID
      }
      return jest.fn()
    })

    mockUseAccessorizedPrice.mockReturnValue(price)

    return render(<AccessorizeItTabs />)
  }

  // Helper function to get products by type
  const getProductsByType = (type: 'charm' | 'strap') =>
    screen.getAllByTestId(new RegExp(`accessory-product-${type}\\d+`))

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render both tabs when products data is available', () => {
      setup()

      const charmsTab = screen.getByRole('tab', { name: 'Charms' })
      const strapsTab = screen.getByRole('tab', { name: 'Straps' })

      expect(charmsTab).toBeVisible()
      expect(strapsTab).toBeVisible()
    })

    // Parameterized test for product rendering
    describe.each([
      ['charm', 'charm'],
      ['strap', 'strap'],
    ])('should render %s products', (productType, testIdPrefix) => {
      it(`should render ${productType} products in the tab panel`, () => {
        setup()

        const products = getProductsByType(testIdPrefix as 'charm' | 'strap')
        expect(products).toHaveLength(2)
        products.forEach((product) => expect(product).toBeVisible())
      })
    })

    // Parameterized test for empty data scenarios
    describe.each([
      ['charms', 'Charms', () => createProductsData(0, 2)],
      ['straps', 'Straps', () => createProductsData(2, 0)],
    ])('when no %s data is available', (productType, tabName, getEmptyData) => {
      it(`should not render ${tabName} tab`, () => {
        setup(getEmptyData())

        const tab = screen.queryByRole('tab', { name: tabName })
        expect(tab).not.toBeInTheDocument()
      })
    })

    it('should highlight selected product', () => {
      setup(mockProductsData, 'charm1')

      const selectedProduct = screen.getByTestId('accessory-product-charm1')
      expect(selectedProduct).toHaveAttribute('data-chosen', 'true')
    })

    describe('Price Display', () => {
      it('should display price section when price is available', () => {
        setup(mockProductsData, '', '$25.00')

        const priceLabel = screen.getByText('add on')
        const priceValue = screen.getByText('$25.00')

        expect(priceLabel).toBeVisible()
        expect(priceValue).toBeVisible()
      })
    })

    describe('AddToBagButton', () => {
      it('should display two AddToBagButtons when product is selected', () => {
        setup(mockProductsData, 'charm1')

        const addToBagButtons = screen.getAllByTestId('add-to-bag-button')

        expect(addToBagButtons).toHaveLength(2)

        // First button - Add Charm to Cart
        expect(addToBagButtons[0]).toBeVisible()
        expect(addToBagButtons[0]).toHaveTextContent('Add Charm to Cart')
        expect(addToBagButtons[0]).toHaveAttribute('data-variant-id', 'charm 1')

        // Second button - Add Bundle to Bag
        expect(addToBagButtons[1]).toBeVisible()
        expect(addToBagButtons[1]).toHaveTextContent('Add Bundle to Bag')
        expect(addToBagButtons[1]).toHaveAttribute('data-variant-id', 'main-product-123')
      })

      it('should display "Sold Out" when product is not orderable', () => {
        setup(mockProductsData, 'charm1', null, 'main-product-123', false)

        const addToBagButtons = screen.getAllByTestId('add-to-bag-button')

        expect(addToBagButtons).toHaveLength(2)

        // First button should still show Add Charm to Cart
        expect(addToBagButtons[0]).toHaveTextContent('Add Charm to Cart')

        // Second button should show Sold Out when not orderable
        expect(addToBagButtons[1]).toHaveTextContent('Sold Out')
        expect(addToBagButtons[1]).toHaveAttribute('disabled')
      })

      it('should display "Add Strap to Cart" when only straps exist', () => {
        const strapsOnlyData = createProductsData(0, 2)
        setup(strapsOnlyData, 'strap1')

        const addToBagButtons = screen.getAllByTestId('add-to-bag-button')

        expect(addToBagButtons).toHaveLength(2)

        // When only straps exist, should show "Add Strap to Cart"
        expect(addToBagButtons[0]).toHaveTextContent('Add Strap to Cart')
        expect(addToBagButtons[1]).toHaveTextContent('Add Bundle to Bag')
      })

      it('should display "Add Charm to Cart" when only charms exist', () => {
        const charmsOnlyData = createProductsData(2, 0)
        setup(charmsOnlyData, 'charm1')

        const addToBagButtons = screen.getAllByTestId('add-to-bag-button')

        expect(addToBagButtons).toHaveLength(2)

        // When only charms exist, should show "Add Charm to Cart"
        expect(addToBagButtons[0]).toHaveTextContent('Add Charm to Cart')
        expect(addToBagButtons[1]).toHaveTextContent('Add Bundle to Bag')
      })
    })

    describe('Remove Tab When Only One Customization Option Exists', () => {
      it('should render TabList when there are multiple tabs', () => {
        setup(mockProductsData)

        const tabList = screen.getByRole('tablist')
        expect(tabList).toBeInTheDocument()
        expect(tabList).toBeVisible()
      })

      it('should not render TabList when there is only one tab', () => {
        setup(createProductsData(2, 0))

        const tabList = screen.queryByRole('tablist')
        expect(tabList).not.toBeInTheDocument()
      })

      it('should still render TabPanels when TabList is not rendered', () => {
        setup(createProductsData(2, 0))

        const tabPanels = screen.getAllByRole('tabpanel')
        expect(tabPanels).toHaveLength(1)
        expect(tabPanels[0]).toBeVisible()
      })
    })
  })

  describe('User Interactions', () => {
    // Parameterized test for product clicks
    describe.each([
      ['charm1', 'accessory-product-charm1'],
      ['strap1', 'accessory-product-strap1'],
    ])('when clicking on %s', (productId, testId) => {
      it(`should call setAccessorizeItSelectedProductID with ${productId}`, async () => {
        const user = userEvent.setup()
        setup()

        const product = screen.getByTestId(testId)
        await user.click(product)

        expect(mockSetAccessorizeItSelectedProductID).toHaveBeenCalledWith(productId)
      })
    })

    it('should call handleTabChange when Tabs onChange is triggered', () => {
      setup(mockProductsData, 'charm1')

      // Simulate the Tabs component calling its onChange prop
      mockTabsOnChange(1)

      // Should clear the selected product ID when tab changes
      expect(mockSetAccessorizeItSelectedProductID).toHaveBeenCalledWith('')
    })

    it('should handle tab change', () => {
      setup()

      const tabs = screen.getByTestId('tabs')
      expect(tabs).toHaveAttribute('data-index', '0')
    })
  })
})

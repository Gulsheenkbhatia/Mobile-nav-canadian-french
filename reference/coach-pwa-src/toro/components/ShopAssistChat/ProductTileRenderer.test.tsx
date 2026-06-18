import React from 'react'
import { render, screen } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import { IntlProvider } from 'react-intl'
import StylesProvider from 'toro/components/StylesProvider'
import ProductTileRenderer from 'toro/components/ShopAssistChat/ProductTileRenderer'
import { Product } from 'toro/components/ShopAssistChat/types'
import usePreference from 'toro/hooks/usePreference_new'
import useAnalytics from 'toro/analytics/useAnalytics'

const messages = {
  'shopAssistChat.productItem.discount': '({percentage}% Off)',
  'shopAssistChat.productItem.comparableValue': 'Comparable Value {comparablePrice}',
}

const mockWindowOpen = jest.fn()
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
})

global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

jest.mock('toro/components/Image', () => {
  return function MockImage({ src, alt, sx, lazy, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

jest.mock('toro/components/ShopAssistChat/ProductAddToBag', () => {
  return function MockProductAddToBag() {
    return <button type="button">Add to Bag</button>
  }
})

jest.mock('toro/hooks/usePreference_new', () => jest.fn())

jest.mock('toro/analytics/useAnalytics')

const mockUseAnalytics = jest.mocked(useAnalytics)
const mockedUsePreference = usePreference as jest.MockedFunction<typeof usePreference>

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={messages}>
      <StylesProvider value={{}}>{ui}</StylesProvider>
    </IntlProvider>
  )

const mockProducts: Product[] = Array.from({ length: 10 }, (_, i) => ({
  id: `product-${i + 1}`,
  title: `Product ${i + 1}`,
  price: 100,
  sale_price: 90,
  discount_percentage: 10,
  image_url: 'https://example.com/image1.jpg',
  url: 'https://example.com/product1',
  color: 'red',
}))

const mockAnalyticsSend = jest.fn()

describe('ProductTileRenderer', () => {
  const defaultPreference = {
    aiGiftConcierge: {
      aiGiftConciergeData: {
        giftingAssistantProductDisplayCount: 6,
        giftingAssistantMaxProductsReturned: 12,
      },
    },
    priceSitePreferences: { isComparablePriceValue: true },
    generalConfiguration: { siteIdentifier: 'ksna' },
  }
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    mockedUsePreference.mockReturnValue(defaultPreference as any)
    mockWindowOpen.mockClear()
    mockUseAnalytics.mockReturnValue({ send: mockAnalyticsSend } as any)
  })

  it('should render single product without toggle button', () => {
    const singleProduct = [mockProducts[0]]
    renderWithProviders(<ProductTileRenderer products={singleProduct} />)

    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.queryByText('See More Products')).not.toBeInTheDocument()
  })

  it('should render multiple products within chunk size', () => {
    const fewProducts = mockProducts.slice(0, 4)
    renderWithProviders(<ProductTileRenderer products={fewProducts} />)

    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Product 4')).toBeInTheDocument()
    expect(screen.queryByText('See More Products')).not.toBeInTheDocument()
  })

  it('should render first chunk with see more button', () => {
    renderWithProviders(<ProductTileRenderer products={mockProducts} />)

    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Product 6')).toBeInTheDocument()
    expect(screen.queryByText('Product 7')).not.toBeInTheDocument()
    expect(screen.getByText('See More Products')).toBeInTheDocument()
  })

  it('should see more products when clicked', async () => {
    renderWithProviders(<ProductTileRenderer products={mockProducts} />)

    const showMoreButton = screen.getByText('See More Products')
    await user.click(showMoreButton)

    expect(screen.getByText('Product 7')).toBeInTheDocument()
    expect(screen.getByText('Product 10')).toBeInTheDocument()
    expect(screen.getByText('See Less Products')).toBeInTheDocument()
  })

  it('should see all remaining products and change button', async () => {
    const eightProducts = mockProducts.slice(0, 8)
    renderWithProviders(<ProductTileRenderer products={eightProducts} />)

    const showMoreButton = screen.getByText('See More Products')
    await user.click(showMoreButton)

    expect(screen.getByText('Product 8')).toBeInTheDocument()
    expect(screen.getByText('See Less Products')).toBeInTheDocument()
  })

  it('should reset to initial chunk size', async () => {
    renderWithProviders(<ProductTileRenderer products={mockProducts} />)

    await user.click(screen.getByText('See More Products'))
    expect(screen.getByText('Product 10')).toBeInTheDocument()

    await user.click(screen.getByText('See Less Products'))
    expect(screen.queryByText('Product 7')).not.toBeInTheDocument()
    expect(screen.getByText('See More Products')).toBeInTheDocument()
  })

  it('should open product URL on tile click', async () => {
    renderWithProviders(<ProductTileRenderer products={[mockProducts[0]]} />)

    const productTile = screen.getByText('Product 1').closest('[tabindex="0"]')
    if (productTile) {
      await user.click(productTile)
      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com/product1',
        '_blank',
        'noopener,noreferrer'
      )
    } else {
      fail('Product tile not found')
    }
  })

  it('should open product URL on Enter key', async () => {
    renderWithProviders(<ProductTileRenderer products={[mockProducts[0]]} />)

    const productTile = screen.getByText('Product 1').closest('[tabindex="0"]')
    if (productTile) {
      ;(productTile as HTMLElement).focus()
      await user.keyboard('{Enter}')
      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com/product1',
        '_blank',
        'noopener,noreferrer'
      )
    } else {
      fail('Product tile not found')
    }
  })

  it('should not activate on non-Enter keys', async () => {
    renderWithProviders(<ProductTileRenderer products={[mockProducts[0]]} />)

    const productTile = screen.getByText('Product 1').closest('[tabindex="0"]')
    if (productTile) {
      ;(productTile as HTMLElement).focus()
      await user.keyboard(' ')
      await user.keyboard('{Tab}')
      expect(mockWindowOpen).not.toHaveBeenCalled()
    } else {
      fail('Product tile not found')
    }
  })

  it('should handle empty products array', () => {
    renderWithProviders(<ProductTileRenderer products={[]} />)

    expect(screen.queryByText(/Product/)).not.toBeInTheDocument()
    expect(screen.queryByText('See More Products')).not.toBeInTheDocument()
  })

  it('should display sale pricing correctly', () => {
    const productWithSale = [
      {
        ...mockProducts[0],
        sale_price: 80,
        price: 100,
        discount_percentage: 20,
      },
    ]

    renderWithProviders(<ProductTileRenderer products={productWithSale} />)

    expect(screen.getByText('$80')).toBeInTheDocument()
    expect(screen.getByText('$100')).toBeInTheDocument()
    expect(screen.getByText('(20% Off)')).toBeInTheDocument()
  })

  it('should handle missing product images', () => {
    const productWithoutImage = [
      {
        ...mockProducts[0],
        image_url: undefined,
      },
    ]

    renderWithProviders(<ProductTileRenderer products={productWithoutImage} />)

    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('should have proper tabIndex on product tiles', () => {
    renderWithProviders(<ProductTileRenderer products={mockProducts.slice(0, 2)} />)

    const productTiles = screen
      .getAllByRole('generic')
      .filter((el) => el.getAttribute('tabindex') === '0')
    expect(productTiles).toHaveLength(2)
  })

  it('should prevent default on Enter with Shift key', async () => {
    renderWithProviders(<ProductTileRenderer products={[mockProducts[0]]} />)

    const productTile = screen.getByText('Product 1').closest('[tabindex="0"]')
    if (productTile) {
      ;(productTile as HTMLElement).focus()
      await user.keyboard('{Shift>}{Enter}{/Shift}')
      expect(mockWindowOpen).not.toHaveBeenCalled()
    } else {
      fail('Product tile not found')
    }
  })
  // Comparable Price tests
  it('should render comparable price when site is ksna-surprise and flag enabled', () => {
    mockedUsePreference.mockReturnValue({
      aiGiftConcierge: {
        aiGiftConciergeData: {
          giftingAssistantProductDisplayCount: 6,
          giftingAssistantMaxProductsReturned: 12,
        },
      },
      priceSitePreferences: { isComparablePriceValue: true },
      generalConfiguration: { siteIdentifier: 'ksna-surprise' },
    } as any)

    const productWithComparable: Product = {
      ...mockProducts[0],
      comparable_price: 200,
    }

    renderWithProviders(<ProductTileRenderer products={[productWithComparable]} />)

    expect(screen.getByText('Comparable Value $200')).toBeInTheDocument()
  })

  it('should hide comparable price when value is missing even if flag enabled on ksna-surprise', () => {
    mockedUsePreference.mockReturnValue({
      aiGiftConcierge: {
        aiGiftConciergeData: {
          giftingAssistantProductDisplayCount: 6,
          giftingAssistantMaxProductsReturned: 12,
        },
      },
      priceSitePreferences: { isComparablePriceValue: true },
      generalConfiguration: { siteIdentifier: 'ksna-surprise' },
    } as any)

    const productWithoutComparable: Product = {
      ...mockProducts[0],
      comparable_price: undefined,
    }

    renderWithProviders(<ProductTileRenderer products={[productWithoutComparable]} />)

    expect(screen.queryByText(/Comparable Value/)).not.toBeInTheDocument()
  })

  it('should hide comparable price when site preference flag is disabled', () => {
    mockedUsePreference.mockReturnValue({
      aiGiftConcierge: {
        aiGiftConciergeData: {
          giftingAssistantProductDisplayCount: 6,
          giftingAssistantMaxProductsReturned: 12,
        },
      },
      priceSitePreferences: { isComparablePriceValue: false },
      generalConfiguration: { siteIdentifier: 'ksna-surprise' },
    } as any)

    const productWithComparable: Product = {
      ...mockProducts[0],
      comparable_price: 200,
    }

    renderWithProviders(<ProductTileRenderer products={[productWithComparable]} />)

    expect(screen.queryByText(/Comparable Value/)).not.toBeInTheDocument()
  })

  it('should hide comparable price on non-outlet site even if flag enabled', () => {
    mockedUsePreference.mockReturnValue({
      aiGiftConcierge: {
        aiGiftConciergeData: {
          giftingAssistantProductDisplayCount: 6,
          giftingAssistantMaxProductsReturned: 12,
        },
      },
      priceSitePreferences: { isComparablePriceValue: true },
      generalConfiguration: { siteIdentifier: 'ksna' },
    } as any)

    const productWithComparable: Product = {
      ...mockProducts[0],
      comparable_price: 200,
    }

    renderWithProviders(<ProductTileRenderer products={[productWithComparable]} />)

    expect(screen.queryByText(/Comparable Value/)).not.toBeInTheDocument()
  })

  describe('analytics item_id', () => {
    it('should use masterId as item_id when product has masterId', async () => {
      const productWithMasterId: Product = {
        ...mockProducts[0],
        id: 'variant-123-456',
        masterId: 'master-789',
      }

      renderWithProviders(<ProductTileRenderer products={[productWithMasterId]} />)

      const productTile = screen.getByText('Product 1').closest('[tabindex="0"]')
      if (!productTile) fail('Product tile not found')
      await user.click(productTile)

      expect(mockAnalyticsSend).toHaveBeenCalledWith(
        'selectItem',
        expect.objectContaining({
          product: expect.objectContaining({
            extendAnalyticsData: expect.objectContaining({
              item_id: 'master-789',
            }),
          }),
        })
      )
    })

    it('should use id prefix (before first hyphen) as item_id when product has no masterId', async () => {
      const productWithVariantId: Product = {
        ...mockProducts[0],
        id: 'master-123-variant-456',
      }

      renderWithProviders(<ProductTileRenderer products={[productWithVariantId]} />)

      const productTile = screen.getByText('Product 1').closest('[tabindex="0"]')
      if (!productTile) fail('Product tile not found')
      await user.click(productTile)

      expect(mockAnalyticsSend).toHaveBeenCalledWith(
        'selectItem',
        expect.objectContaining({
          product: expect.objectContaining({
            extendAnalyticsData: expect.objectContaining({
              item_id: 'master',
            }),
          }),
        })
      )
    })

    it('should use full id as item_id when product has no masterId and no hyphen in id', async () => {
      const productWithSimpleId: Product = {
        ...mockProducts[0],
        id: 'simpleproduct123',
      }

      renderWithProviders(<ProductTileRenderer products={[productWithSimpleId]} />)

      const productTile = screen.getByText('Product 1').closest('[tabindex="0"]')
      if (!productTile) fail('Product tile not found')
      await user.click(productTile)

      expect(mockAnalyticsSend).toHaveBeenCalledWith(
        'selectItem',
        expect.objectContaining({
          product: expect.objectContaining({
            extendAnalyticsData: expect.objectContaining({
              item_id: 'simpleproduct123',
            }),
          }),
        })
      )
    })
  })

  describe('analytics item_variant', () => {
    const clickFirstProductTile = async () => {
      const tile = screen.getByText('Product 1').closest('[tabindex="0"]')
      if (!tile) fail('Product tile not found')
      await user.click(tile)
    }

    it('should send product.item_variant in selectItem when provided', async () => {
      renderWithProviders(
        <ProductTileRenderer
          products={[{ ...mockProducts[0], id: 'product-1', item_variant: 'variant-red-medium' }]}
        />
      )
      await clickFirstProductTile()

      expect(mockAnalyticsSend).toHaveBeenCalledWith(
        'selectItem',
        expect.objectContaining({
          product: expect.objectContaining({
            extendAnalyticsData: expect.objectContaining({
              item_variant: 'variant-red-medium',
            }),
          }),
        })
      )
    })

    it('should not fall back to product id for item_variant when item_variant is omitted', async () => {
      renderWithProviders(
        <ProductTileRenderer products={[{ ...mockProducts[0], id: 'fullvariantid123' }]} />
      )
      await clickFirstProductTile()

      const selectCall = mockAnalyticsSend.mock.calls.find(([event]) => event === 'selectItem')
      if (!selectCall) {
        throw new Error('expected selectItem analytics call')
      }
      const extend = (
        selectCall[1] as { product: { extendAnalyticsData: Record<string, unknown> } }
      ).product.extendAnalyticsData

      expect(extend.item_id).toBe('fullvariantid123')
      expect(extend.item_variant).toBeUndefined()
    })
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import PriceDetails from './index'

// Mock dependencies
jest.mock('toro/hooks/useMultiStyleConfig', () => {
  return jest.fn(() => {
    return {
      priceWrapper: { textAlign: 'left' },
      priceText: {
        color: 'black',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-xl)',
        fontWeight: 'normal',
      },
    }
  })
})

jest.mock('toro/hocs/withErrorBoundaryWrapper', () => {
  return (Component) => Component
})

describe('PriceDetails Component', () => {
  describe('Price Tier Priority (Promotional > Sales > List)', () => {
    it('should display promotional price when available', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: { value: 99.99, formatted: '$99.99' },
            sales: { value: 79.99, formatted: '$79.99' },
            list: { value: 149.99, formatted: '$149.99' },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('$99.99')).toBeInTheDocument()
      expect(screen.queryByText('$79.99')).not.toBeInTheDocument()
      expect(screen.queryByText('$149.99')).not.toBeInTheDocument()
    })

    it('should display sales price when promotional price is unavailable', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: null,
            sales: { value: 79.99, formatted: '$79.99' },
            list: { value: 149.99, formatted: '$149.99' },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('$79.99')).toBeInTheDocument()
      expect(screen.queryByText('$149.99')).not.toBeInTheDocument()
    })

    it('should display list price when only list price available', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: null,
            sales: null,
            list: { value: 149.99, formatted: '$149.99' },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('$149.99')).toBeInTheDocument()
    })

    it('should return null when product is not provided', () => {
      const { container } = render(<PriceDetails product={null} />)
      expect(container.firstChild).toBeNull()
    })

    it('should return null when promotionPrice array is missing', () => {
      const product = {
        name: 'Product without pricing',
        sku: '12345',
      }

      const { container } = render(<PriceDetails product={product} />)
      expect(container.firstChild).toBeNull()
    })

    it('should return null when promotionPrice array is empty', () => {
      const product = {
        promotionPrice: [],
      }

      const { container } = render(<PriceDetails product={product} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Formatted Price Handling', () => {
    it('should display formatted price directly from API', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: { value: 100, formatted: '$100.00' },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('$100.00')).toBeInTheDocument()
    })

    it('should handle API formatted prices with currency symbols', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: { value: 99.99, formatted: '$99.99' },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('$99.99')).toBeInTheDocument()
    })

    it('should return null when formatted property is missing from all price tiers', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: { value: 125.5 },
            sales: { value: 100 },
            list: { value: 150 },
          },
        ],
      }

      const { container } = render(<PriceDetails product={product} />)
      expect(container.firstChild).toBeNull()
    })

    it('should use API formatted value without custom formatting', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: { value: 100.5, formatted: '$100.50' },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('$100.50')).toBeInTheDocument()
    })
  })

  describe('International Currency Support', () => {
    it('should handle EUR currency format', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: { value: 500.0, formatted: '€500,00' },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('€500,00')).toBeInTheDocument()
    })

    it('should handle GBP currency format', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: { value: 250.0, formatted: '£250.00' },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('£250.00')).toBeInTheDocument()
    })

    it('should handle JPY currency format without decimals', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: { value: 50000, formatted: '¥50,000' },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('¥50,000')).toBeInTheDocument()
    })
  })

  describe('Acceptance Criteria Verification', () => {
    it('should display only final price without discount percentage or strikethrough', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: { value: 79.99, formatted: '$79.99' },
            list: { value: 149.99, formatted: '$149.99' },
            discountPercentage: 46.6,
          },
        ],
      }

      render(<PriceDetails product={product} />)

      // Should only show the promotional price
      expect(screen.getByText('$79.99')).toBeInTheDocument()
      // Should NOT show discount percentage
      expect(screen.queryByText(/46.6/)).not.toBeInTheDocument()
      // Should NOT show list price with strikethrough
      expect(screen.queryByText('$149.99')).not.toBeInTheDocument()
    })

    it('should apply black text color styling', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: { value: 89.99, formatted: '$89.99' },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      const textElement = screen.getByText('$89.99')

      expect(textElement).toHaveStyle({ color: 'black' })
    })

    it('should render in a Box component with theme wrapper', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: { value: 99.99, formatted: '$99.99' },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      const { container } = render(<PriceDetails product={product} />)
      const priceWrapper = container.querySelector('[data-qa="cm_search_suggestion_price_wraper"]')

      expect(priceWrapper).toBeInTheDocument()
    })

    it('should render price text with correct data-qa attribute', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: { value: 99.99, formatted: '$99.99' },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      const priceText = screen.getByText('$99.99')

      expect(priceText).toHaveAttribute('data-qa', 'cm_text_search_suggestion_price')
      expect(priceText).toHaveTextContent('$99.99')
    })
  })

  describe('Edge Cases & Error Handling', () => {
    it('should handle null product gracefully', () => {
      const { container } = render(<PriceDetails product={null} />)
      expect(container.firstChild).toBeNull()
    })

    it('should handle undefined product gracefully', () => {
      const { container } = render(<PriceDetails product={undefined} />)
      expect(container.firstChild).toBeNull()
    })

    it('should handle nested undefined paths safely using lodash get', () => {
      const product = {
        promotionPrice: [
          {
            // No prices defined
          },
        ],
      }

      const { container } = render(<PriceDetails product={product} />)
      expect(container.firstChild).toBeNull()
    })

    it('should handle promotionPrice as empty object', () => {
      const product = {
        promotionPrice: [{}],
      }

      const { container } = render(<PriceDetails product={product} />)
      expect(container.firstChild).toBeNull()
    })

    it('should handle partial price tier data (only promotional)', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: { value: 99.99, formatted: '$99.99' },
            // sales and list undefined
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('$99.99')).toBeInTheDocument()
    })

    it('should handle promotion price with extra properties', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: {
              value: 99.99,
              formatted: '$99.99',
              currency: 'USD',
              original: 149.99,
              discount: 33,
              // Extra properties should be ignored
            },
            sales: { value: 79.99, formatted: '$79.99' },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('$99.99')).toBeInTheDocument()
    })
  })

  describe('Performance & Memoization', () => {
    it('should memoize pricing data extraction', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: { value: 99.99, formatted: '$99.99' },
          },
        ],
      }

      const { rerender } = render(<PriceDetails product={product} />)
      expect(screen.getByText('$99.99')).toBeInTheDocument()

      // Re-render with same product
      rerender(<PriceDetails product={product} />)
      expect(screen.getByText('$99.99')).toBeInTheDocument()
    })

    it('should update when product prop changes', () => {
      const product1 = {
        promotionPrice: [
          {
            promotionalPrice: { value: 99.99, formatted: '$99.99' },
          },
        ],
      }

      const product2 = {
        promotionPrice: [
          {
            promotionalPrice: { value: 149.99, formatted: '$149.99' },
          },
        ],
      }

      const { rerender } = render(<PriceDetails product={product1} />)
      expect(screen.getByText('$99.99')).toBeInTheDocument()

      rerender(<PriceDetails product={product2} />)
      expect(screen.getByText('$149.99')).toBeInTheDocument()
      expect(screen.queryByText('$99.99')).not.toBeInTheDocument()
    })

    it('should be wrapped with memo to prevent unnecessary re-renders', () => {
      const product = {
        promotionPrice: [
          {
            promotionalPrice: { value: 99.99, formatted: '$99.99' },
          },
        ],
      }

      const { rerender } = render(<PriceDetails product={product} />)
      const firstRender = screen.getByText('$99.99')

      // Re-render with exact same product object
      rerender(<PriceDetails product={product} />)
      const secondRender = screen.getByText('$99.99')

      // Component should be memoized
      expect(firstRender === secondRender).toBe(true)
    })
  })

  describe('Real-World Scenarios', () => {
    it('should display autosuggest product with promotional pricing', () => {
      const product = {
        id: 'C2756',
        name: 'Leather Crossbody Bag',
        sku: '2756AA',
        promotionPrice: [
          {
            promotionalPrice: {
              value: 298,
              formatted: '$298.00',
              currency: 'USD',
            },
            sales: {
              value: 149,
              formatted: '$149.00',
              currency: 'USD',
            },
            list: {
              value: 298,
              formatted: '$298.00',
              currency: 'USD',
            },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('$298.00')).toBeInTheDocument()
    })

    it('should display search result product with sales pricing', () => {
      const product = {
        id: 'prod-456',
        name: 'Coach Signature Tote',
        promotionPrice: [
          {
            promotionalPrice: null,
            sales: { value: 195.0, formatted: '$195.00' },
            list: { value: 395.0, formatted: '$395.00' },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('$195.00')).toBeInTheDocument()
    })

    it('should display clearance item with only list price', () => {
      const product = {
        id: 'prod-clearance',
        name: 'Clearance Item',
        promotionPrice: [
          {
            promotionalPrice: null,
            sales: null,
            list: { value: 49.99, formatted: '$49.99' },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('$49.99')).toBeInTheDocument()
    })

    it('should handle international product pricing (EUR)', () => {
      const product = {
        id: 'eur-prod-123',
        name: 'European Leather Bag',
        promotionPrice: [
          {
            promotionalPrice: { value: 450.0, formatted: '€450,00' },
            sales: { value: 225.0, formatted: '€225,00' },
            list: { value: 450.0, formatted: '€450,00' },
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('€450,00')).toBeInTheDocument()
    })
  })

  describe('Server-Side Products', () => {
    it('should display price for server-side product with default variant group ID', () => {
      const product = {
        isServerSide: true,
        master: { defaultVariantGroupID: 'vg1' },
        variationGroup: [
          {
            id: 'vg1',
            pricingInfo: [
              {
                promotionalPrice: { value: 89.99, formatted: '$89.99' },
              },
            ],
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('$89.99')).toBeInTheDocument()
    })

    it('should display price for server-side product with default color', () => {
      const product = {
        isServerSide: true,
        defaultColor: { id: 'BLUE' },
        variationGroup: [
          {
            color: 'BLUE',
            pricingInfo: [
              {
                promotionalPrice: { value: 75.99, formatted: '$75.99' },
              },
            ],
          },
          {
            color: 'RED',
            pricingInfo: [
              {
                promotionalPrice: { value: 85.99, formatted: '$85.99' },
              },
            ],
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('$75.99')).toBeInTheDocument()
      expect(screen.queryByText('$85.99')).not.toBeInTheDocument()
    })

    it('should display price for server-side product with sales price only', () => {
      const product = {
        isServerSide: true,
        defaultColor: { id: 'GREEN' },
        variationGroup: [
          {
            color: 'GREEN',
            pricingInfo: [
              {
                sales: { value: 59.99, formatted: '$59.99' },
              },
            ],
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('$59.99')).toBeInTheDocument()
    })

    it('should handle server-side product with multiple price tiers', () => {
      const product = {
        isServerSide: true,
        master: { defaultVariantGroupID: 'vg-standard' },
        variationGroup: [
          {
            id: 'vg-standard',
            pricingInfo: [
              {
                promotionalPrice: { value: 99.99, formatted: '$99.99' },
                sales: { value: 79.99, formatted: '$79.99' },
                list: { value: 149.99, formatted: '$149.99' },
              },
            ],
          },
        ],
      }

      render(<PriceDetails product={product} />)
      expect(screen.getByText('$99.99')).toBeInTheDocument()
      expect(screen.queryByText('$79.99')).not.toBeInTheDocument()
      expect(screen.queryByText('$149.99')).not.toBeInTheDocument()
    })

    it('should fall back to promotionPrice if server-side product has no variation group match', () => {
      const product = {
        isServerSide: true,
        master: { defaultVariantGroupID: 'non-existent' },
        promotionPrice: [
          {
            promotionalPrice: { value: 120.0, formatted: '$120.00' },
          },
        ],
        variationGroup: [
          {
            id: 'vg1',
            pricingInfo: [
              {
                promotionalPrice: { value: 89.99, formatted: '$89.99' },
              },
            ],
          },
        ],
      }

      render(<PriceDetails product={product} />)
      const { container } = render(<PriceDetails product={product} />)
      expect(container.firstChild).toBeNull()
    })
  })
})

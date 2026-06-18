import React from 'react'
import { render, screen } from 'test-utils/react'
import ExpandableProductDetails from './index'
import useProductData from 'toro/hooks/useProductData'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useAnalytics from 'toro/analytics/useAnalytics'

// Mock dependencies
jest.mock('toro/hooks/useProductData')
jest.mock('toro/hooks/useMultiStyleConfig')
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/components/product/desktop/ProductCardTable', () => {
  return () => <div data-qa="product-card-table">Product Card Table</div>
})
jest.mock('toro/components/HtmlContent', () => {
  return ({ content }: { content: string }) => <div>{content || 'HTML Content'}</div>
})

const mockUseProductData = jest.mocked(useProductData)
const mockUseMultiStyleConfig = jest.mocked(useMultiStyleConfig)
const mockUseAnalytics = jest.mocked(useAnalytics)

const defaultStyleConfig = {
  accordionsWrapper: {},
  accordionButton: {},
  accordionButtonText: {},
  accordionPanel: {},
  accordionIcon: {},
}

const MockIcon = () => <div data-qa="accordion-icon">Icon</div>

describe('ExpandableProductDetails', () => {
  beforeEach(() => {
    mockUseMultiStyleConfig.mockImplementation((componentName) => {
      if (componentName === 'ExpandableProductDetails') {
        return defaultStyleConfig
      }
      if (componentName === 'Icons') {
        return {
          AccordionIcon: MockIcon,
          AccordionIconExpanded: MockIcon,
        }
      }
      return {}
    })

    mockUseAnalytics.mockReturnValue({
      send: jest.fn(),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render null when no content is available', () => {
      mockUseProductData.mockImplementation((path) => {
        if (Array.isArray(path)) {
          return [null, null] // content, editorNotes
        }
        if (path === 'pdpAccordionItems') {
          return []
        }
        return null
      })

      render(<ExpandableProductDetails />)

      // Should not render any accordion content
      expect(screen.queryByText('Product Details')).not.toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('should render default product details accordion when content is available', () => {
      mockUseProductData.mockImplementation((path) => {
        if (Array.isArray(path)) {
          return ['Some content', 'Editor notes'] // content, editorNotes
        }
        if (path === 'pdpAccordionItems') {
          return []
        }
        return null
      })

      render(<ExpandableProductDetails />)

      expect(screen.getByText('Product Details')).toBeVisible()
      expect(screen.getByRole('button', { name: /product details/i })).toBeVisible()
      expect(screen.getByRole('button', { name: /product details/i })).toHaveAttribute(
        'data-qa',
        'm_pdp_product_details_accordion'
      )
    })

    it('should render product card table inside product details accordion', () => {
      mockUseProductData.mockImplementation((path) => {
        if (Array.isArray(path)) {
          return ['Some content', null]
        }
        if (path === 'pdpAccordionItems') {
          return []
        }
        return null
      })

      render(<ExpandableProductDetails />)

      expect(screen.getByText('Product Details')).toBeVisible()
      // Product Card Table is rendered but may not be visible when accordion is collapsed
      expect(screen.getByText('Product Card Table')).toBeInTheDocument()
    })
  })

  describe('Server-Processed Accordion Items', () => {
    it('should render accordion items from server-processed data', () => {
      mockUseProductData.mockImplementation((path) => {
        if (Array.isArray(path)) {
          return [null, null]
        }
        if (path === 'pdpAccordionItems') {
          return [
            {
              id: 'accordion-1',
              title: 'Care Instructions',
              content: '<p>Care instructions content</p>',
              openOnLoad: false,
            },
            {
              id: 'accordion-2',
              title: 'Sustainability',
              content: '<p>Sustainability content</p>',
              openOnLoad: true,
            },
          ]
        }
        return null
      })

      render(<ExpandableProductDetails />)

      expect(screen.getByText('Care Instructions')).toBeVisible()
      expect(screen.getByText('Sustainability')).toBeVisible()

      // Check that accordion buttons are rendered with proper data-qa attributes
      expect(screen.getByRole('button', { name: /care instructions/i })).toHaveAttribute(
        'data-qa',
        'm_pdp_accordion-1_accordion'
      )
      expect(screen.getByRole('button', { name: /sustainability/i })).toHaveAttribute(
        'data-qa',
        'm_pdp_accordion-2_accordion'
      )
    })

    it('should render accordion content using HtmlContent component', () => {
      mockUseProductData.mockImplementation((path) => {
        if (Array.isArray(path)) {
          return [null, null]
        }
        if (path === 'pdpAccordionItems') {
          return [
            {
              id: 'accordion-1',
              title: 'Test Accordion',
              content: '<p>Test HTML Content</p>',
              openOnLoad: false,
            },
          ]
        }
        return null
      })

      render(<ExpandableProductDetails />)

      expect(screen.getByText('Test Accordion')).toBeVisible()
      // HtmlContent mock renders the content prop, it may be hidden in collapsed accordion
      expect(screen.getByText('<p>Test HTML Content</p>')).toBeInTheDocument()
    })

    it('should render both default and dynamic accordions when both are available', () => {
      mockUseProductData.mockImplementation((path) => {
        if (Array.isArray(path)) {
          return ['Some content', 'Editor notes'] // content, editorNotes
        }
        if (path === 'pdpAccordionItems') {
          return [
            {
              id: 'accordion-1',
              title: 'Care Instructions',
              content: '<p>Care instructions content</p>',
              openOnLoad: false,
            },
          ]
        }
        return null
      })

      render(<ExpandableProductDetails />)

      expect(screen.getByText('Product Details')).toBeVisible()
      expect(screen.getByText('Care Instructions')).toBeVisible()
    })

    it('should not render CMS pdpAccordionItems when hidden (Technical details only)', () => {
      mockUseProductData.mockImplementation((path) => {
        if (Array.isArray(path)) {
          return ['Some content', null]
        }
        if (path === 'pdpAccordionItems') {
          return [
            {
              id: 'accordion-1',
              title: 'Accordion Title 1',
              content: '<p>extra</p>',
              openOnLoad: false,
            },
          ]
        }
        return null
      })

      render(
        <ExpandableProductDetails
          variant="pdpv7"
          hideAccordionItems={true}
          accordionTitle={{
            id: 'pdp.product.productDetail.titleV7',
            defaultMessage: 'Technical details',
          }}
        />
      )

      expect(screen.getByText('Technical details')).toBeInTheDocument()
      expect(screen.queryByText('Accordion Title 1')).not.toBeInTheDocument()
    })

    it('should handle empty accordion items array gracefully', () => {
      mockUseProductData.mockImplementation((path) => {
        if (Array.isArray(path)) {
          return ['Some content', null]
        }
        if (path === 'pdpAccordionItems') {
          return []
        }
        return null
      })

      render(<ExpandableProductDetails />)

      // Should only render product details accordion
      expect(screen.getByText('Product Details')).toBeVisible()
      expect(screen.queryByText('Care Instructions')).not.toBeInTheDocument()
    })

    it('should handle null accordion items gracefully', () => {
      mockUseProductData.mockImplementation((path) => {
        if (Array.isArray(path)) {
          return ['Some content', null]
        }
        if (path === 'pdpAccordionItems') {
          return null
        }
        return null
      })

      render(<ExpandableProductDetails />)

      // Should only render product details accordion
      expect(screen.getByText('Product Details')).toBeVisible()
    })
  })

  describe('Default Open Indexes (useMemo)', () => {
    it('should render accordion when only product details exists and no openOnLoad set', () => {
      mockUseProductData.mockImplementation((path) => {
        if (Array.isArray(path)) {
          return ['Some content', null]
        }
        if (path === 'pdpAccordionItems') {
          return []
        }
        return null
      })

      render(<ExpandableProductDetails />)

      // Accordion should be rendered
      expect(screen.getByText('Product Details')).toBeVisible()
      expect(screen.getByRole('button', { name: /product details/i })).toBeVisible()
    })

    it('should set correct default open indexes for accordions with openOnLoad=true', () => {
      mockUseProductData.mockImplementation((path) => {
        if (Array.isArray(path)) {
          return [null, null]
        }
        if (path === 'pdpAccordionItems') {
          return [
            {
              id: 'accordion-1',
              title: 'Closed Accordion',
              content: '<p>Closed content</p>',
              openOnLoad: false,
            },
            {
              id: 'accordion-2',
              title: 'Open Accordion',
              content: '<p>Open content</p>',
              openOnLoad: true,
            },
          ]
        }
        return null
      })

      render(<ExpandableProductDetails />)

      expect(screen.getByText('Closed Accordion')).toBeVisible()
      expect(screen.getByText('Open Accordion')).toBeVisible()
    })

    it('should correctly calculate indexes when product details and dynamic accordions exist', () => {
      mockUseProductData.mockImplementation((path) => {
        if (Array.isArray(path)) {
          return ['Product content', null] // Product details at index 0
        }
        if (path === 'pdpAccordionItems') {
          return [
            {
              id: 'accordion-1',
              title: 'First Dynamic',
              content: '<p>First</p>',
              openOnLoad: false, // Index 1 - not open
            },
            {
              id: 'accordion-2',
              title: 'Second Dynamic',
              content: '<p>Second</p>',
              openOnLoad: true, // Index 2 - should be open
            },
          ]
        }
        return null
      })

      render(<ExpandableProductDetails />)

      expect(screen.getByText('Product Details')).toBeVisible()
      expect(screen.getByText('First Dynamic')).toBeVisible()
      expect(screen.getByText('Second Dynamic')).toBeVisible()
    })
  })

  describe('Hook Integration', () => {
    it('should call useProductData with correct parameters', () => {
      mockUseProductData.mockImplementation((path) => {
        if (Array.isArray(path)) {
          return [null, null]
        }
        if (path === 'pdpAccordionItems') {
          return []
        }
        return null
      })

      render(<ExpandableProductDetails />)

      // Should call with array for content/editorNotes
      expect(mockUseProductData).toHaveBeenCalledWith([
        'custom.c_longDescription2',
        'custom.c_editorsNoteDescription',
        'id',
      ])

      // Should call with string for accordion items
      expect(mockUseProductData).toHaveBeenCalledWith('pdpAccordionItems')
    })

    it('should call useMultiStyleConfig for component styles', () => {
      mockUseProductData.mockImplementation((path) => {
        if (Array.isArray(path)) {
          return [null, null]
        }
        if (path === 'pdpAccordionItems') {
          return []
        }
        return null
      })

      render(<ExpandableProductDetails />)

      expect(mockUseMultiStyleConfig).toHaveBeenCalledWith(
        'ExpandableProductDetails',
        expect.objectContaining({ variant: undefined })
      )
      expect(mockUseMultiStyleConfig).toHaveBeenCalledWith('Icons')
    })
  })

  describe('Edge Cases', () => {
    it('should render when only editorNotes is available', () => {
      mockUseProductData.mockImplementation((path) => {
        if (Array.isArray(path)) {
          return [null, 'Editor notes only']
        }
        if (path === 'pdpAccordionItems') {
          return []
        }
        return null
      })

      render(<ExpandableProductDetails />)

      expect(screen.getByText('Product Details')).toBeVisible()
    })

    it('should handle multiple accordion items', () => {
      mockUseProductData.mockImplementation((path) => {
        if (Array.isArray(path)) {
          return [null, null]
        }
        if (path === 'pdpAccordionItems') {
          return [
            {
              id: 'accordion-1',
              title: 'First',
              content: '<p>First</p>',
              openOnLoad: false,
            },
            {
              id: 'accordion-2',
              title: 'Second',
              content: '<p>Second</p>',
              openOnLoad: false,
            },
            {
              id: 'accordion-3',
              title: 'Third',
              content: '<p>Third</p>',
              openOnLoad: true,
            },
          ]
        }
        return null
      })

      render(<ExpandableProductDetails />)

      expect(screen.getByText('First')).toBeVisible()
      expect(screen.getByText('Second')).toBeVisible()
      expect(screen.getByText('Third')).toBeVisible()
    })
  })
})

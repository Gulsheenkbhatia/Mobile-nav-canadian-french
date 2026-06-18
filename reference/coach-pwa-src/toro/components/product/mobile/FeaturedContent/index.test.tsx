import React from 'react'
import { render, screen } from 'test-utils/react'
import FeaturedContent from './index'
import useProductData from 'toro/hooks/useProductData'
import { getProductImageSrc } from 'toro/helpers/productImages'
import { mockIntersectionObserver } from 'test-utils/mock-utils'

// Mock dependencies
jest.mock('toro/hooks/useProductData')
jest.mock('toro/helpers/productImages')

// Get typed mock functions
const mockUseProductData = jest.mocked(useProductData)
const mockGetProductImageSrc = jest.mocked(getProductImageSrc)

// Type definitions for test data
interface MockImageData {
  src: string
  alt?: string
  title?: string
}

// Test constants
const DEFAULT_HEADER = 'Featured Collection'
const DEFAULT_IMAGE_SRC = 'https://example.com/image.jpg'
const DEFAULT_IMAGE_ALT = 'Featured product image'
const DEFAULT_IMAGE_TITLE = 'Featured Product'
const TRANSFORMED_IMAGE_SRC = 'https://example.com/image-mobile-pdp.jpg'

const DEFAULT_IMAGE_DATA: MockImageData = {
  src: DEFAULT_IMAGE_SRC,
  alt: DEFAULT_IMAGE_ALT,
  title: DEFAULT_IMAGE_TITLE,
}

// Helper functions
const setupMocks = (
  header: string | null = DEFAULT_HEADER,
  image: MockImageData | null = DEFAULT_IMAGE_DATA,
  transformedImageSrc: string = TRANSFORMED_IMAGE_SRC
) => {
  mockUseProductData.mockReturnValue([header, image])
  mockGetProductImageSrc.mockReturnValue(transformedImageSrc)
  mockIntersectionObserver()
}

const renderComponent = () => {
  return render(<FeaturedContent />, {
    contexts: {
      PWAContext: {
        appData: {
          siteId: 'coh_us_rt',
          brand: 'coach',
        },
      },
    },
  })
}

describe('FeaturedContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setupMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render complete component structure with all elements', () => {
    renderComponent()

    const container = screen.getByTestId('pdp_featured_content')
    const header = screen.getByTestId('pdp_featured_content_header')
    const image = screen.getByTestId('pdp_featured_content_image')

    // Verify all elements are rendered
    expect(container).toBeVisible()
    expect(header).toBeVisible()
    expect(image).toBeVisible()

    // Verify header structure and content
    expect(header.tagName).toBe('H2')
    expect(header).toHaveTextContent(DEFAULT_HEADER)

    // Verify image attributes
    expect(image).toHaveAttribute('src', TRANSFORMED_IMAGE_SRC)
    expect(image).toHaveAttribute('alt', DEFAULT_IMAGE_ALT)
    expect(image).toHaveAttribute('title', DEFAULT_IMAGE_TITLE)
  })

  it('should return null when featuredContentData is null or undefined', () => {
    setupMocks(null, null)
    renderComponent()
    expect(screen.queryByTestId('pdp_featured_content')).not.toBeInTheDocument()
  })

  it('should use header as fallback for image alt and title when not provided', () => {
    const imageWithoutAltOrTitle: MockImageData = {
      src: DEFAULT_IMAGE_SRC,
    }
    setupMocks(DEFAULT_HEADER, imageWithoutAltOrTitle)

    renderComponent()

    const image = screen.getByTestId('pdp_featured_content_image')
    expect(image).toHaveAttribute('alt', DEFAULT_HEADER)
    expect(image).toHaveAttribute('title', DEFAULT_HEADER)
  })

  it('should process and transform image src correctly', () => {
    renderComponent()

    expect(mockGetProductImageSrc).toHaveBeenCalledTimes(1)
    expect(mockGetProductImageSrc).toHaveBeenCalledWith(DEFAULT_IMAGE_SRC, 'mobile', 'pdp')
  })

  it('should process and display transformed image src correctly', () => {
    const customTransformedSrc = 'https://example.com/custom-transformed.jpg'
    setupMocks(DEFAULT_HEADER, DEFAULT_IMAGE_DATA, customTransformedSrc)

    renderComponent()

    const image = screen.getByTestId('pdp_featured_content_image')
    expect(image).toHaveAttribute('src', customTransformedSrc)
  })

  it('should handle edge cases gracefully', () => {
    // Empty header but with image should still render
    setupMocks('', DEFAULT_IMAGE_DATA)
    renderComponent()

    const header = screen.getByTestId('pdp_featured_content_header')
    expect(header).toHaveTextContent('')
  })

  it('should display custom header text correctly', () => {
    const customHeader = 'Custom Featured Header'
    setupMocks(customHeader, DEFAULT_IMAGE_DATA)

    renderComponent()

    expect(screen.getByText(customHeader)).toBeVisible()
  })
})

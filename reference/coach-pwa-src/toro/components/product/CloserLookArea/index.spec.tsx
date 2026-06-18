import React from 'react'
import { render, fireEvent, waitFor, cleanup } from 'test-utils/react'
import CloserLookArea from 'toro/components/product/CloserLookArea'
import { mockIntersectionObserver } from 'test-utils/mock-utils'

mockIntersectionObserver()

jest.mock('toro/components/Image', () => ({ src, alt, onImageLoad, onError }) => (
  <img src={src} alt={alt} onLoad={onImageLoad} onError={onError} />
))

const defaultProps = {
  cLHeader: 'Sam Icon Daisy',
  cLText: 'Medium',
  cLImageSuffix: '4',
  closerLookImageSrc: 'image-src',
  variant: 'default',
}

const renderComponent = (props = {}) => {
  return {
    ...render(<CloserLookArea {...defaultProps} {...props} />, {
      contexts: {
        ViewportContext: { isDesktop: true, isMobile: false },
        ProductMainSectionBreakpointContext: {
          allLevelsProductsData: {
            product: {
              name: 'Product Name',
              productId: 'product123',
              sku: 'sku123',
              description: 'Product Description',
              categories: ['Category > Subcategory'],
              price: {
                value: 100,
                currency: 'USD',
              },
              originalPrice: {
                value: 120,
                currency: 'USD',
              },
              url: 'https://coach.com/product',
              images: [
                { src: 'https://coach.com/image1.jpg' },
                { src: 'https://coach.com/image2.jpg' },
              ],
              groupId: 'group123',
            },
            masterData: {
              name: 'Master Product Name',
              productId: 'master123',
              sku: 'mastersku123',
              description: 'Master Product Description',
              categories: ['Master Category > Subcategory'],
              price: {
                value: 150,
                currency: 'USD',
              },
              originalPrice: {
                value: 180,
                currency: 'USD',
              },
              url: 'https://coach.com/master-product',
              images: [
                { src: 'https://coach.com/master-image1.jpg' },
                { src: 'https://coach.com/master-image2.jpg' },
              ],
              groupId: 'mastergroup123',
            },
            variationGroupData: {
              name: 'Variation Group Name',
              productId: 'variation123',
              sku: 'variationsku123',
              description: 'Variation Group Description',
              categories: ['Variation Category > Subcategory'],
              price: {
                value: 80,
                currency: 'USD',
              },
              originalPrice: {
                value: 100,
                currency: 'USD',
              },
              url: 'https://coach.com/variation-product',
              images: [
                { src: 'https://coach.com/variation-image1.jpg' },
                { src: 'https://coach.com/variation-image2.jpg' },
              ],
              groupId: 'variationgroup123',
            },
          },
          variationControlsProps: {
            selectedVariantData: {
              price: 100,
              availability: 'In Stock',
            },
          },
          variationTangibleeProps: {},
          isOutlet: false,
          selectedVariantData: {
            price: 100,
            availability: 'In Stock',
          },
          tangibleeWidgetProps: {
            onHeroImage: true,
            isVisible: true,
          },
          cart: [],
          wishlists: [],
          klarnaDetails: [],
          onPurposeProps: [],
        },
      },
    }),
  }
}

describe('CloserLookArea Component', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })
  // Renders the closer look images correctly and displays the correct image caption
  it('should render closer look image correctly', async () => {
    const { getByRole, getByText } = renderComponent()
    const image = getByRole('img')
    expect(image).toHaveAttribute('src', `${defaultProps.closerLookImageSrc}?$desktopProduct$`)
    expect(image).toBeVisible()
    expect(getByText(defaultProps.cLHeader)).toBeVisible()
    expect(getByText(defaultProps.cLText)).toBeVisible()
  })

  // Verify that the component handles different image sources and alt texts
  it('should handle different image sources and alt texts', () => {
    const { getByRole } = renderComponent({ closerLookImageSrc: 'new-src', cLHeader: 'New Header' })
    expect(getByRole('img')).toHaveAttribute('src', 'new-src?$desktopProduct$')
    expect(getByRole('heading', { name: 'New Header' })).toBeVisible()
  })

  // Verify manageSkeleton function: should hide skeleton when image loads
  it('should hide skeleton when image is loaded', async () => {
    const { getByRole, queryByTestId } = renderComponent({ cLImageSuffix: '4' })
    const image = getByRole('img')

    fireEvent.load(image)

    await waitFor(() => {
      expect(queryByTestId('skeleton-loader')).toBeNull()
    })
  })

  // Verify that the component do not render when image fails to load
  it('should not render the component when image fails to load', async () => {
    const { queryByRole } = renderComponent({ closerLookImageSrc: '' })

    await waitFor(() => {
      expect(queryByRole('img')).toBeNull()
    })
  })
})

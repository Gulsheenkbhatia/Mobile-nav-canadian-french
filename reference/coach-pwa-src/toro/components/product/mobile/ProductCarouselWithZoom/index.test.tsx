import React from 'react'
import { render, screen } from 'test-utils/react'
import { useAtomValue } from 'jotai/utils'
import ProductCarouselWithZoom from './index'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import useAnalytics from 'toro/analytics/useAnalytics'
import { getHeroSwatchInteractionEvent } from 'toro/helpers/pdpGaEvents'
import usePreference from 'toro/hooks/usePreference_new'

// Create mock functions before mocking modules
const mockUseTemplate = jest.fn()
const mockUseExperiment = jest.fn()
const mockUseSimilarOptionsOnPDP = jest.fn()

// Mock dependencies
jest.mock('jotai/utils')
jest.mock('toro/hooks/useMultiStyleConfig')
jest.mock('toro/hooks/useSelectedColorData')
jest.mock('toro/hooks/useSelectedVariantData')
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/helpers/pdpGaEvents')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useTemplate', () => {
  return (templates: any) => mockUseTemplate(templates)
})
jest.mock('toro/hooks/useExperiment', () => {
  return (experiment: any) => mockUseExperiment(experiment)
})
jest.mock('toro/hooks/useSimilarOptionsOnPDP', () => {
  return () => mockUseSimilarOptionsOnPDP()
})
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (fn: any) => {
    const Component = fn()
    return Component
  },
}))
jest.mock('toro/components/LastSlideWithSimilarOptions', () => {
  return function MockLastSlideWithSimilarOptions() {
    return <div data-qa="mock-last-slide-with-similar-options">Last Slide</div>
  }
})
jest.mock('toro/components/Box', () => {
  return function MockBox({ children, sx, ...props }: any) {
    return (
      <div data-qa="mock-box" {...props}>
        {children}
      </div>
    )
  }
})
jest.mock('toro/components/product/ProductMediaArea/ProductMedia', () => {
  return function MockProductMedia(props: any) {
    return (
      <div
        data-qa="mock-product-media"
        data-can-zoom={props.canZoom}
        data-has-zoomed-image={props.hasZoomedImage}
        data-loading={props.loading}
        data-idx={props.idx}
      >
        {props.alt || 'Product Media'}
      </div>
    )
  }
})
jest.mock('toro/components/product/CarouselVideo', () => {
  return function MockCarouselVideo(props: any) {
    return (
      <div
        data-qa="mock-carousel-video"
        data-is-active={props.isActive}
        data-object-fit={props.objectFit}
        data-is-play={props.isPlay}
        data-muted={props.muted}
        data-is-gallery={props.isGallery}
      >
        Video: {props.videoSrc}
      </div>
    )
  }
})
jest.mock('toro/components/SplideSlider', () => {
  return function MockSplideSlider({
    children,
    onIndexChange,
    modifiedThumbnailsArrows,
    initialIndex,
    innerRef,
    onDragged,
    onScrolled,
    ...props
  }: any) {
    // Exclude initialIndex, innerRef, onDragged, and onScrolled from props to avoid React warnings
    return (
      <div data-qa="mock-splide-slider" {...props}>
        <div data-qa="prev-arrow" onClick={() => onIndexChange?.(0)}>
          {modifiedThumbnailsArrows?.prevCustomArrow}
        </div>
        <div data-qa="slider-content">{children}</div>
        <div data-qa="next-arrow" onClick={() => onIndexChange?.(1)}>
          {modifiedThumbnailsArrows?.nextCustomArrow}
        </div>
      </div>
    )
  }
})
jest.mock('toro/components/Button', () => {
  return function MockButton({ children, ...props }: any) {
    return <button {...props}>{children}</button>
  }
})
jest.mock('toro/icons/arrow.svg', () => {
  return function MockArrow() {
    return <span data-qa="arrow-icon">→</span>
  }
})
jest.mock('toro/components/product/desktop/ProductTangibleeControl', () => {
  function MockProductMedia(props: any) {
    return (
      <div
        data-qa="mock-product-tangiblee-control"
        data-type={props.type}
        data-image-url={props.imageUrl}
      >
        Product Tangiblee Control
      </div>
    )
  }
  return {
    __esModule: true, // 👈 this tells Jest it's an ES module
    default: MockProductMedia,
    TangibleeControlType: {
      media: 'media',
      details: 'details',
      vpcMedia: 'vpcMedia',
      vpcDetails: 'vpcDetails',
    },
  }
})
jest.mock('toro/components/product/AccessorizeIt/AccessorizeItButton', () => {
  return function MockAccessorizeItButton() {
    return <div data-qa="mock-accessorize-it-button">Add a Charm</div>
  }
})

const mockUseAccessorizeItCtaTarget = jest.fn()
jest.mock('toro/components/product/AccessorizeIt/hooks', () => ({
  useAccessorizeItCtaTarget: (...args: any[]) => mockUseAccessorizeItCtaTarget(...args),
}))

const mockUseAtomValue = jest.mocked(useAtomValue)
const mockUseMultiStyleConfig = jest.mocked(useMultiStyleConfig)
const mockUseSelectedColorData = jest.mocked(useSelectedColorData)
const mockUseSelectedVariantData = jest.mocked(useSelectedVariantData)
const mockUseAnalytics = jest.mocked(useAnalytics)
const mockGetHeroSwatchInteractionEvent = jest.mocked(getHeroSwatchInteractionEvent)
const mockUsePreference = jest.mocked(usePreference)

const defaultRenderOptions = {
  contexts: {
    PWAContext: { appData: {} },
  },
}

describe('ProductCarouselWithZoom', () => {
  const defaultStyles = {
    productCarouselWrapper: { padding: '10px' },
    productMediaItem: { margin: '5px' },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAtomValue.mockReturnValue('coach')
    mockUseMultiStyleConfig.mockReturnValue(defaultStyles)
    mockUseSelectedColorData.mockReturnValue([{ full: [] }, 'color123'])
    mockUseSelectedVariantData.mockReturnValue('variant123')
    mockUseAnalytics.mockReturnValue({
      send: jest.fn(),
    })
    mockGetHeroSwatchInteractionEvent.mockReturnValue([])
    mockUsePreference.mockReturnValue({
      toggleSiteFeatures: {
        similarOptionsCTAConfig: {
          PDP: {
            enable: false,
          },
        },
      },
      generalConfiguration: {
        enableNewGlobalHeader: false,
      },
    })
    mockUseTemplate.mockReturnValue(false)
    mockUseExperiment.mockReturnValue(false)
    mockUseSimilarOptionsOnPDP.mockReturnValue({
      isSimilarOptionOnPDPEnabled: false,
      extendMediaForSimilarOption: (medias: any[]) => medias,
    })
    mockUseAccessorizeItCtaTarget.mockReturnValue(null)
  })

  describe('Component Rendering', () => {
    it('should render successfully with default props', () => {
      render(<ProductCarouselWithZoom />, defaultRenderOptions)

      expect(screen.getByTestId('mock-splide-slider')).toBeVisible()
    })

    it('should apply correct styles to wrapper', () => {
      const customStyles = {
        productCarouselWrapper: { backgroundColor: 'red' },
        productMediaItem: { border: '1px solid blue' },
      }
      mockUseMultiStyleConfig.mockReturnValue(customStyles)

      render(<ProductCarouselWithZoom />, defaultRenderOptions)

      const wrapper = screen.getByTestId('mock-box')
      expect(wrapper).toBeVisible()
    })
  })

  describe('Media Handling', () => {
    describe('Empty Media (Fallback)', () => {
      it('should render fallback ProductMedia when no media is available', () => {
        mockUseSelectedColorData.mockReturnValue([{ full: [] }, 'color123'])

        render(<ProductCarouselWithZoom />, defaultRenderOptions)

        const productMedia = screen.getByTestId('mock-product-media')
        expect(productMedia).toBeVisible()
        expect(productMedia).toHaveTextContent('coach Brand Image')
        expect(productMedia).toHaveAttribute('data-can-zoom', 'false')
        expect(productMedia).toHaveAttribute('data-has-zoomed-image', 'false')
        expect(productMedia).toHaveAttribute('data-idx', '0')
      })

      it('should render fallback with correct brand name', () => {
        mockUseAtomValue.mockReturnValue('kate-spade')
        mockUseSelectedColorData.mockReturnValue([{ full: [] }, 'color123'])

        render(<ProductCarouselWithZoom />, defaultRenderOptions)

        const productMedia = screen.getByTestId('mock-product-media')
        expect(productMedia).toHaveTextContent('kate-spade Brand Image')
      })
    })

    describe('Image Media', () => {
      const imageMedia = [
        {
          type: 'image',
          src: 'image1.jpg',
          alt: 'Product Image 1',
        },
        {
          type: 'image',
          src: 'image2.jpg',
          alt: 'Product Image 2',
        },
      ]

      it('should render image media correctly', () => {
        mockUseSelectedColorData.mockReturnValue([{ full: imageMedia }, 'color123'])

        render(<ProductCarouselWithZoom />, defaultRenderOptions)

        const productMedias = screen.getAllByTestId('mock-product-media')
        expect(productMedias).toHaveLength(2)

        expect(productMedias[0]).toHaveAttribute('data-can-zoom', 'true')
        expect(productMedias[0]).toHaveAttribute('data-has-zoomed-image', 'false')
        expect(productMedias[0]).toHaveAttribute('data-loading', 'eager')
        expect(productMedias[0]).toHaveAttribute('data-idx', '0')

        expect(productMedias[1]).toHaveAttribute('data-loading', 'lazy')
        expect(productMedias[1]).toHaveAttribute('data-idx', '1')
      })
    })

    describe('Video Media', () => {
      const videoMedia = [
        {
          type: 'video',
          src: 'video1.mp4',
          poster: { src: 'poster1.jpg' },
        },
      ]

      it('should render video media correctly', () => {
        mockUseSelectedColorData.mockReturnValue([{ full: videoMedia }, 'color123'])

        render(<ProductCarouselWithZoom />, defaultRenderOptions)

        const carouselVideo = screen.getByTestId('mock-carousel-video')
        expect(carouselVideo).toBeVisible()
        expect(carouselVideo).toHaveTextContent('Video: video1.mp4')
        expect(carouselVideo).toHaveAttribute('data-is-active', 'true')
        expect(carouselVideo).toHaveAttribute('data-object-fit', 'contain')
        expect(carouselVideo).toHaveAttribute('data-is-play', 'true')
        expect(carouselVideo).toHaveAttribute('data-muted', 'true')
        expect(carouselVideo).toHaveAttribute('data-is-gallery', 'true')
      })
    })

    describe('Mixed Media Types', () => {
      const mixedMedia = [
        {
          type: 'image',
          src: 'image1.jpg',
          alt: 'Product Image 1',
        },
        {
          type: 'video',
          src: 'video1.mp4',
          poster: { src: 'poster1.jpg' },
        },
      ]

      it('should render mixed media types correctly', () => {
        mockUseSelectedColorData.mockReturnValue([{ full: mixedMedia }, 'color123'])

        render(<ProductCarouselWithZoom />, defaultRenderOptions)

        expect(screen.getByTestId('mock-product-media')).toBeVisible()
        expect(screen.getByTestId('mock-carousel-video')).toBeVisible()
      })
    })
  })

  describe('Navigation Arrows', () => {
    it('should render custom navigation arrows', () => {
      render(<ProductCarouselWithZoom />, defaultRenderOptions)

      const prevArrow = screen.getByTestId('prev-arrow')
      const nextArrow = screen.getByTestId('next-arrow')

      expect(prevArrow).toBeVisible()
      expect(nextArrow).toBeVisible()

      // Check that arrows contain the Button components with correct props
      const prevButton = prevArrow.querySelector('button')
      const nextButton = nextArrow.querySelector('button')

      expect(prevButton).toHaveClass('splide__arrow', 'splide__arrow--prev')
      expect(prevButton).toHaveAttribute('data-qa', 'left_arrow_heroGallery')

      expect(nextButton).toHaveClass('splide__arrow', 'splide__arrow--next')
      expect(nextButton).toHaveAttribute('data-qa', 'right_arrow_heroGallery')
    })

    it('should display arrow icons in navigation buttons', () => {
      render(<ProductCarouselWithZoom />, defaultRenderOptions)

      const arrowIcons = screen.getAllByTestId('arrow-icon')
      expect(arrowIcons).toHaveLength(2)

      arrowIcons.forEach((icon) => {
        expect(icon).toHaveTextContent('→')
      })
    })
  })

  describe('SplideSlider Configuration', () => {
    it('should pass correct options to SplideSlider', () => {
      render(<ProductCarouselWithZoom />, defaultRenderOptions)

      const slider = screen.getByTestId('mock-splide-slider')
      // Check that options object is passed (will show as [object Object] in HTML)
      expect(slider).toHaveAttribute('options', '[object Object]')
    })

    it('should pass styles to SplideSlider', () => {
      const customStyles = {
        productCarouselWrapper: { backgroundColor: 'blue' },
        productMediaItem: { border: '2px solid red' },
      }
      mockUseMultiStyleConfig.mockReturnValue(customStyles)

      render(<ProductCarouselWithZoom />, defaultRenderOptions)

      const slider = screen.getByTestId('mock-splide-slider')
      // Check that styles object is passed (will show as [object Object] in HTML)
      expect(slider).toHaveAttribute('styles', '[object Object]')
    })
  })

  describe('State Management', () => {
    it('should handle selectedColorId changes', () => {
      const { rerender } = render(<ProductCarouselWithZoom />, defaultRenderOptions)

      // Change selectedColorId
      mockUseSelectedColorData.mockReturnValue([{ full: [] }, 'newColor456'])
      rerender(<ProductCarouselWithZoom />)

      expect(screen.getByTestId('mock-splide-slider')).toBeVisible()
    })

    it('should handle brand changes', () => {
      const { rerender } = render(<ProductCarouselWithZoom />, defaultRenderOptions)

      // Change brand
      mockUseAtomValue.mockReturnValue('coach')
      rerender(<ProductCarouselWithZoom />)

      const productMedia = screen.getByTestId('mock-product-media')
      expect(productMedia).toHaveTextContent('coach Brand Image')
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined media gracefully', () => {
      mockUseSelectedColorData.mockReturnValue([undefined, 'color123'])

      expect(() => render(<ProductCarouselWithZoom />, defaultRenderOptions)).not.toThrow()
      // When media is undefined, fallback ProductMedia should render
      expect(screen.getByTestId('mock-product-media')).toBeVisible()
      expect(screen.getByTestId('mock-product-media')).toHaveTextContent('coach Brand Image')
    })

    it('should handle null media gracefully', () => {
      mockUseSelectedColorData.mockReturnValue([null, 'color123'])

      expect(() => render(<ProductCarouselWithZoom />, defaultRenderOptions)).not.toThrow()
      // When media is null, fallback ProductMedia should render
      expect(screen.getByTestId('mock-product-media')).toBeVisible()
      expect(screen.getByTestId('mock-product-media')).toHaveTextContent('coach Brand Image')
    })

    it('should handle media without full property', () => {
      mockUseSelectedColorData.mockReturnValue([{}, 'color123'])

      expect(() => render(<ProductCarouselWithZoom />, defaultRenderOptions)).not.toThrow()
      // When media.full is missing, fallback ProductMedia should render
      expect(screen.getByTestId('mock-product-media')).toBeVisible()
      expect(screen.getByTestId('mock-product-media')).toHaveTextContent('coach Brand Image')
    })

    it('should handle video media without poster', () => {
      const videoWithoutPoster = [
        {
          type: 'video',
          src: 'video1.mp4',
        },
      ]
      mockUseSelectedColorData.mockReturnValue([{ full: videoWithoutPoster }, 'color123'])

      render(<ProductCarouselWithZoom />, defaultRenderOptions)

      const carouselVideo = screen.getByTestId('mock-carousel-video')
      expect(carouselVideo).toBeVisible()
      expect(carouselVideo).toHaveTextContent('Video: video1.mp4')
    })

    it('should handle empty selectedColorId', () => {
      mockUseSelectedColorData.mockReturnValue([{ full: [] }, ''])

      expect(() => render(<ProductCarouselWithZoom />, defaultRenderOptions)).not.toThrow()
      // When selectedColorId is empty, fallback ProductMedia should still render
      expect(screen.getByTestId('mock-product-media')).toBeVisible()
      expect(screen.getByTestId('mock-product-media')).toHaveTextContent('coach Brand Image')
    })

    it('should handle null selectedColorId', () => {
      mockUseSelectedColorData.mockReturnValue([{ full: [] }, null])

      expect(() => render(<ProductCarouselWithZoom />, defaultRenderOptions)).not.toThrow()
      // When selectedColorId is null, fallback ProductMedia should still render
      expect(screen.getByTestId('mock-product-media')).toBeVisible()
      expect(screen.getByTestId('mock-product-media')).toHaveTextContent('coach Brand Image')
    })
  })

  describe('Accessibility', () => {
    it('should have proper data-qa attributes on navigation arrows', () => {
      render(<ProductCarouselWithZoom />, defaultRenderOptions)

      const prevButton = screen.getByTestId('prev-arrow').querySelector('button')
      const nextButton = screen.getByTestId('next-arrow').querySelector('button')

      expect(prevButton).toHaveAttribute('data-qa', 'left_arrow_heroGallery')
      expect(nextButton).toHaveAttribute('data-qa', 'right_arrow_heroGallery')
    })

    it('should render with proper alt text for fallback image', () => {
      mockUseAtomValue.mockReturnValue('coach')
      mockUseSelectedColorData.mockReturnValue([{ full: [] }, 'color123'])

      render(<ProductCarouselWithZoom />, defaultRenderOptions)

      const productMedia = screen.getByTestId('mock-product-media')
      expect(productMedia).toHaveTextContent('coach Brand Image')
    })
  })

  describe('Performance Considerations', () => {
    it('should set loading="eager" for first image and "lazy" for subsequent images', () => {
      const multipleImages = [
        { type: 'image', src: 'image1.jpg', alt: 'Image 1' },
        { type: 'image', src: 'image2.jpg', alt: 'Image 2' },
        { type: 'image', src: 'image3.jpg', alt: 'Image 3' },
      ]
      mockUseSelectedColorData.mockReturnValue([{ full: multipleImages }, 'color123'])

      render(<ProductCarouselWithZoom />, defaultRenderOptions)

      const productMedias = screen.getAllByTestId('mock-product-media')
      expect(productMedias[0]).toHaveAttribute('data-loading', 'eager')
      expect(productMedias[1]).toHaveAttribute('data-loading', 'lazy')
      expect(productMedias[2]).toHaveAttribute('data-loading', 'lazy')
    })
  })

  describe('Component Integration', () => {
    it('should integrate properly with useMultiStyleConfig hook', () => {
      const customStyles = {
        productCarouselWrapper: {
          backgroundColor: 'red',
          padding: '20px',
        },
        productMediaItem: {
          border: '1px solid blue',
          margin: '10px',
        },
      }
      mockUseMultiStyleConfig.mockReturnValue(customStyles)

      render(<ProductCarouselWithZoom />, defaultRenderOptions)

      expect(mockUseMultiStyleConfig).toHaveBeenCalledWith('ProductCarousel', {
        variant: undefined,
      })
      expect(screen.getByTestId('mock-splide-slider')).toBeVisible()
    })

    it('should integrate properly with useSelectedColorData hook', () => {
      const mediaData = { full: [{ type: 'image', src: 'test.jpg' }] }
      const colorId = 'test-color-123'
      mockUseSelectedColorData.mockReturnValue([mediaData, colorId])

      render(<ProductCarouselWithZoom />, defaultRenderOptions)

      expect(mockUseSelectedColorData).toHaveBeenCalledWith(['media', 'id'])
    })

    it('should integrate properly with brandAtom', () => {
      mockUseAtomValue.mockReturnValue('kate-spade')

      render(<ProductCarouselWithZoom />, defaultRenderOptions)

      expect(mockUseAtomValue).toHaveBeenCalledWith(expect.any(Object)) // brandAtom
    })
  })

  describe('AccessorizeIt CTA Asset Targeting', () => {
    const imageMedia = [
      { type: 'image', src: 'https://coach.scene7.com/is/image/Coach/cr508_b4ha_a92' },
      { type: 'image', src: 'https://coach.scene7.com/is/image/Coach/cr508_b4ha_a88' },
      { type: 'image', src: 'https://coach.scene7.com/is/image/Coach/cr508_b4ha_a6' },
    ]

    it('renders AccessorizeItButton only on the target index from hook', () => {
      mockUseExperiment.mockReturnValue(true)
      mockUseAccessorizeItCtaTarget.mockReturnValue(1)
      mockUseSelectedColorData.mockReturnValue([{ full: imageMedia }, 'color123'])

      render(<ProductCarouselWithZoom />, defaultRenderOptions)

      const buttons = screen.getAllByTestId('mock-accessorize-it-button')
      expect(buttons).toHaveLength(1)
    })

    it('does not render AccessorizeItButton when hook returns null', () => {
      mockUseExperiment.mockReturnValue(true)
      mockUseAccessorizeItCtaTarget.mockReturnValue(null)
      mockUseSelectedColorData.mockReturnValue([{ full: imageMedia }, 'color123'])

      render(<ProductCarouselWithZoom />, defaultRenderOptions)

      expect(screen.queryByTestId('mock-accessorize-it-button')).not.toBeInTheDocument()
    })

    it('does not render AccessorizeItButton when experiment is disabled', () => {
      mockUseExperiment.mockReturnValue(false)
      mockUseAccessorizeItCtaTarget.mockReturnValue(0)
      mockUseSelectedColorData.mockReturnValue([{ full: imageMedia }, 'color123'])

      render(<ProductCarouselWithZoom />, defaultRenderOptions)

      expect(screen.queryByTestId('mock-accessorize-it-button')).not.toBeInTheDocument()
    })
  })
})

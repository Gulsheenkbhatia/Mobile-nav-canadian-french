import { render, CustomRenderOptions } from 'test-utils/react'
import ProductCarouselMobile from 'toro/components/product/ProductMediaArea/ProductCarouselMobile/index'
import { useAtomValue } from 'jotai/utils'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePreference from 'toro/hooks/usePreference_new'
import useReviewOverlayImageSrc from 'toro/hooks/useReviewOverlayImageSrc'
import useViewportType from 'toro/hooks/useViewportType'
import { pdpReviewsAtom, isFirstViewedAtom } from 'store/pdp.atom'

jest.mock('jotai/utils')
jest.mock('toro/hooks/useExperiment')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useMultiStyleConfig')
jest.mock('toro/hooks/useReviewOverlayImageSrc')
jest.mock('toro/helpers/jotai/useAtomSetter')
jest.mock('toro/hooks/useViewportType')

jest.mock('toro/components/SplideSlider', () => ({ children }) => (
  <div data-qa="splide-slider">{children}</div>
))
jest.mock('toro/components/ReviewOverlayOnImage', () => () => (
  <div data-qa="ReviewOverlayOnImage">Review Overlay</div>
))
jest.mock('toro/components/SimilarOptionJumpLink', () => () => (
  <div data-qa="similar-option-jump-link">Similar Option Jump Link</div>
))
jest.mock(
  'toro/components/product/ProductMediaArea/ProductHeroBottomWidgets/ProductHeroBottomWidgets',
  () => () => <div data-testid="ProductHeroBottomWidgets">Product Hero Bottom Widgets</div>
)
jest.mock('toro/components/product/ProductMediaArea/ProductMedia', () => ({ src, alt }) => (
  <img src={src} alt={alt} />
))
jest.mock('toro/components/product/CarouselVideo', () => ({ src, poster }) => (
  <video poster="https://coach.scene7.com/is/image/Coach/5696_ime74_a0?$mobileProductV3$">
    <source
      src="https://assets.coach.com/na/media/EOS/pdp/5696_IMAA8_CITY_TT.mp4"
      type="video/mp4"
    />
    Your browser does not support HTML5 video.
  </video>
))

jest.mock('toro/components/product/ProductMediaArea/ProductMediaTangibleeControls', () => () => (
  <div>Mocked ProductMediaTangibleeControls</div>
))

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        locale: 'en-US',
      },
    },
  },
}

const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
const mockedUseExperiment = useExperiment as jest.MockedFn<typeof useExperiment>
const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>
const mockedUseReviewOverLayImageSrc = useReviewOverlayImageSrc as jest.MockedFn<
  typeof useReviewOverlayImageSrc
>
const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>

const mockOnSwatchInteraction = jest.fn()

const defaultProps = {
  isVisible: false,
  media: {
    full: [
      {
        src: 'https://coach.scene7.com/is/image/Coach/5696_ime74_a0?$mobileProductV3$',
        type: 'image',
        alt: 'Product Image 1',
      },
      {
        src: 'https://assets.coach.com/na/media/EOS/pdp/5696_IMAA8_CITY_TT.mp4',
        type: 'video',
        poster: 'https://coach.scene7.com/is/image/Coach/5696_ime74_a0?$mobileProductV3$',
      },
      {
        src: 'https://coach.scene7.com/is/image/Coach/5696_ime74_a91?$mobileProductV3$',
        type: 'image',
        alt: 'Product Image 2',
      },
    ],
  },
  canZoom: true,
  hasZoomedImage: false,
  onMediaClick: jest.fn(),
  initialIdx: 0,
  selectedVariant: { id: 'variant-1' },
  onSwatchInteraction: mockOnSwatchInteraction,
  brand: 'Coach',
  selectedColor: 'red',
  imageEditorialCopy: { editorialCopy: [{ imageType: 'image' }] },
  tangiblee: {},
  isSimilarOptionOnPDP: false,
  reviewsData: [
    { id: 1, text: 'Great product!', rating: 5 },
    { id: 2, text: 'Good quality.', rating: 4 },
  ],
  isSwatchChanged: false,
}

const makeSetup = (props: any = {}) => {
  const combinedProps = { ...defaultProps, ...props }
  return render(<ProductCarouselMobile {...combinedProps} />, renderOptions)
}

describe('ProductCarouselMobile', () => {
  beforeEach(() => {
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case isFirstViewedAtom:
          return true
        case pdpReviewsAtom:
          return []
        default:
          return null
      }
    })
    mockedUseExperiment.mockImplementation((experiment) => {
      switch (experiment) {
        case EXPERIMENTS.PDP_V3:
          return false
        case EXPERIMENTS.PDP_LANDING_WITH_VIDEO_FIRST_ALT_IMAGE:
          return false
        default:
          return false
      }
    })
    mockedUsePreference.mockImplementation(() => ({
      tangiblee: { enableStrategicTangiblee: true },
    }))
    mockedUseReviewOverLayImageSrc.mockImplementation(
      () => 'https://coach.scene7.com/is/image/Coach/5696_ime74_a0?$mobileProductV3$'
    )
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: false, isMobile: true }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the component correctly with images and videos', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('splide-slider')).toBeVisible()
  })

  it('displays the Brand when there is empty media', () => {
    makeSetup({ media: {} })
    const imageElement = document.querySelector('img[alt="Coach Brand Image"]')
    expect(imageElement).toBeVisible()
  })

  it('renders the component correctly with medias more than three', () => {
    const mediaData = {
      full: [
        {
          src: 'https://coach.scene7.com/is/image/Coach/5696_ime74_a0?$mobileProductV3$',
          type: 'image',
          alt: 'Product Image 1',
        },
        {
          src: 'https://coach.scene7.com/is/image/Coach/5696_ime74_a91?$mobileProductV3$',
          type: 'image',
          alt: 'Product Image 2',
        },
        {
          src: 'https://assets.coach.com/na/media/EOS/pdp/5696_IMAA8_CITY_TT.mp4',
          type: 'video',
          poster: 'https://coach.scene7.com/is/image/Coach/5696_ime74_a0?$mobileProductV3$',
        },
        {
          src: 'https://coach.scene7.com/is/image/Coach/5696_ime74_a3?$mobileProductV3$',
          type: 'image',
          alt: 'Product Image 3',
        },
      ],
    }
    const { getByTestId } = makeSetup({
      media: mediaData,
    })

    const imgElements = document.querySelectorAll('img')
    const videoElements = document.querySelectorAll('video')
    const totalMedia = imgElements.length + videoElements.length
    expect(getByTestId('splide-slider')).toBeVisible()
    expect(totalMedia).toBeGreaterThan(3)
  })

  it('renders the component with proper classname', () => {
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case isFirstViewedAtom:
          return true
        case pdpReviewsAtom:
          return []
        default:
          return null
      }
    })
    mockedUseExperiment.mockImplementation((experiment) => {
      switch (experiment) {
        case EXPERIMENTS.PDP_V3:
          return true
        case EXPERIMENTS.PDP_LANDING_WITH_VIDEO_FIRST_ALT_IMAGE:
          return false
        default:
          return false
      }
    })
    const { container } = render(<ProductCarouselMobile {...defaultProps} />, renderOptions)
    const element = container.firstChild
    expect(element).toHaveClass('pdp_mobile_splide-slider pagination-v3-mobile')
  })

  it('should render view similar options on the last slide when isSimilarOptionOnPDP is true and tabbed pdp is not eligible', () => {
    makeSetup({ isSimilarOptionOnPDP: true })
    const imageElements = document.querySelectorAll('img')
    const firstImageSrc = imageElements[0].getAttribute('src')
    const lastImageSrc = imageElements[imageElements.length - 1].getAttribute('src')

    expect(firstImageSrc).toEqual(lastImageSrc)
  })

  it('should render the component with video media at first when isPdpLandingWithVideoFirstAltImage is true and swatch is not changed', () => {
    mockedUseExperiment.mockImplementation((experiment) => {
      switch (experiment) {
        case EXPERIMENTS.PDP_V3:
          return false
        case EXPERIMENTS.PDP_LANDING_WITH_VIDEO_FIRST_ALT_IMAGE:
          return true
        default:
          return false
      }
    })
    const { getByTestId } = makeSetup({ isSwatchChanged: false })
    expect(getByTestId('splide-slider')).toBeVisible()

    const videoElement = document.querySelector('video')
    const imageElements = document.querySelectorAll('img')
    const videoIndex = Array.from(
      document.querySelectorAll('div[data-qa="splide-slider"] > *')
    ).indexOf(videoElement)
    const firstImageIndex = Array.from(
      document.querySelectorAll('div[data-qa="splide-slider"] > *')
    ).indexOf(imageElements[0])

    expect(videoIndex).toBeLessThan(firstImageIndex)
  })

  it('renders the component correctly when tabbed pdp is eligible', () => {
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case isFirstViewedAtom:
          return true
        case pdpReviewsAtom:
          return []
        default:
          return null
      }
    })
    const { getByTestId } = makeSetup()
    expect(getByTestId('splide-slider')).toBeVisible()
  })

  it('handles the scenario when pdp reviews is not empty', () => {
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case isFirstViewedAtom:
          return true
        case pdpReviewsAtom:
          return [
            { id: 1, text: 'Great product!', rating: 5 },
            { id: 2, text: 'Good quality.', rating: 4 },
          ]
        default:
          return null
      }
    })
    const { getByTestId } = makeSetup()
    expect(getByTestId('splide-slider')).toBeVisible()
  })

  it('handles the scenario when imageEditorialCopy is null', () => {
    const { getByTestId } = makeSetup({ imageEditorialCopy: null })
    expect(getByTestId('splide-slider')).toBeVisible()
  })

  it('renders review overlay on image for specific media', () => {
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case isFirstViewedAtom:
          return true
        case pdpReviewsAtom:
          return [
            { id: 1, text: 'Great product!', rating: 5 },
            { id: 2, text: 'Good quality.', rating: 4 },
          ]
        default:
          return null
      }
    })
    const { getByTestId } = makeSetup({ isSimilarOptionOnPDP: true, initialIdx: 3 })
    expect(getByTestId('ReviewOverlayOnImage')).toBeVisible()
  })
})

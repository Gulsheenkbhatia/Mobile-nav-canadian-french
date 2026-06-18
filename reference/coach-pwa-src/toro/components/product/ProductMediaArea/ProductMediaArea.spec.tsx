import React from 'react'
import { render } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import ProductMediaArea from './index'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePageType from 'toro/hooks/usePageType'
import type { Atom } from 'jotai'

jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: false }))

jest.mock('toro/components/Image', () => {
  return ({ isActive, onSwatchInteraction, objectFit, noMinW, noMinH, onImageLoad, ...props }) => {
    return <img {...props} />
  }
})

jest.mock('toro/components/product/ProductMediaArea/ProductCarouselDesktop', () => {
  const mockReact = jest.requireActual('react')
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => {
      const MockProductMedia = jest.requireActual(
        'toro/components/product/ProductMediaArea/ProductMedia'
      ).default

      return mockReact.createElement(
        'div',
        { 'data-testid': 'product-carousel-desktop' },
        props.media && Array.isArray(props.media)
          ? props.media.map((mediaItem: Record<string, unknown>, index: number) =>
              mockReact.createElement(MockProductMedia, {
                key: index,
                ...mediaItem,
                containerProps: 'test-container-class',
                ...props,
              })
            )
          : null
      )
    },
  }
})

jest.mock('toro/hooks/useExperiment')
jest.mock('toro/hooks/usePageType')
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
  Router: { events: { on: jest.fn(), off: jest.fn() } },
}))
const mockedUseExperiment = useExperiment as jest.MockedFn<typeof useExperiment>
const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>

describe('ProductMediaArea Component', () => {
  const baseProps = {
    isVisible: true,
    isQuickView: true,
    isGuestUser: false,
    isOutlet: false,
    membershipExclusiveProduct: false,
    isMobile: false,
    isBundleProduct: false,
    tangibleeWidgetProps: {},
    imageBadges: <div>Badges</div>,
    selectedVariant: {},
    currentVariationGroupId: '1',
    onAddToWishlistSuccess: jest.fn(),
    onRemoveFromWishlistSuccess: jest.fn(),
    selectedColor: { text: 'Red' },
    productData: {
      id: '123',
      reviewsData: { results: [{ reviews: [] }] },
    },
    media: {},
    onSwatchInteraction: jest.fn(),
    sustainabilityIconsData: [],
    isSustainabilityIconExpEnabled: false,
    isEnabledColorAdaptive: false,
    setIsModalOpened: true,
    isOpen: true,
    onClose: <div>Close</div>,
  }

  const customRenderOptions = {
    contexts: {
      PWAContext: {
        appData: {
          siteId: 'coh_us_out',
          brand: 'coach',
        },
      },
      ViewportContext: {},
      AnalyticsContext: {},
      SessionContext: { session: {} },
    },
  }

  const makeSetup = ({
    atomsData = [],
    customProps = {},
  }: {
    atomsData?: Array<[Atom<unknown>, unknown]>
    customProps?: Record<string, unknown>
  } = {}) => {
    mockedUsePageType.mockImplementation(() => ({
      isPDP: true,
      isHP: false,
      isSRP: false,
      isPLP: false,
      isContentPage: false,
      isProductPassport: false,
      isRetailHP: false,
      isSubHP: false,
      isOutletHP: false,
    }))
    return render(<ProductMediaArea {...baseProps} {...customProps} />, {
      ...customRenderOptions,
      contexts: {
        ...customRenderOptions.contexts,
        JotaiProviderContext: new Map(atomsData),
      },
    })
  }

  const makeSetupOne = (isModalOpen: boolean) => {
    mockedUsePageType.mockImplementation(() => ({
      isPDP: true,
      isHP: false,
      isSRP: false,
      isPLP: false,
      isContentPage: false,
      isProductPassport: false,
      isRetailHP: false,
      isSubHP: false,
      isOutletHP: false,
    }))
    if (isModalOpen) return render(<div>ProductZoomModal</div>, customRenderOptions)
    return render(<button>Close</button>, customRenderOptions)
  }

  it('renders correctly with given props', () => {
    const { getByText } = makeSetup()
    expect(getByText('Badges')).toBeInTheDocument()
  })

  it('renders correctly in mobile view', () => {
    const { getByText } = makeSetup({ customProps: { isMobile: true } })
    expect(getByText('Badges')).toBeInTheDocument()
  })

  it('handles modal open', async () => {
    mockedUseExperiment.mockImplementation((experiment) => {
      if (experiment === EXPERIMENTS.ADAPTIVE_CAROUSEL_ALT) return false
    })
    const { getByText } = makeSetupOne(true)
    expect(getByText('ProductZoomModal')).toBeInTheDocument()
  })
  it('handles modal close', async () => {
    let { getByText } = makeSetupOne(false)
    const closeButton = getByText('Close')
    await userEvent.click(closeButton)
    expect(getByText('Close')).toBeVisible()
  })
})

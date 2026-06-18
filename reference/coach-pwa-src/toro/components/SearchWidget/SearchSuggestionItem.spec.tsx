import { render } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import SearchSuggestionItem from 'toro/components/SearchWidget/SearchSuggestionItem'
import usePreference from 'toro/hooks/usePreference_new'
import type { Atom } from 'jotai'
import { SearchSuggestionProduct } from 'toro/types/productTypes'

jest.mock('toro/hooks/useViewportType', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  })),
}))

jest.mock('toro/hooks/usePreference_new')
const mockedUsePreference = jest.mocked(usePreference)

jest.mock('toro/hooks/usePricePreferences', () => jest.fn(() => ({ currency: 'USD' })))

jest.mock('toro/components/Link', () => {
  const OriginalLink = jest.requireActual('toro/components/Link').default
  return ({ onClick, ...props }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      if (onClick) {
        onClick(e)
      }
    }
    return <OriginalLink {...props} onClick={handleClick} />
  }
})
jest.mock('toro/analytics/ImpressionSensor', () => ({ children, onVisible }: any) => {
  onVisible()
  return <div>{children}</div>
})

const customRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

const mockProduct = {
  defaultColor: {
    media: {
      thumbnail: { src: 'https://coach.scene7.com/is/image/Coach/ch857_b4mer_a0?$image400$' },
    },
  },
  media: {
    thumbnails: [{ src: 'https://coach.scene7.com/is/image/Coach/c0689_b4bk_a0?$image400$' }],
    thumbnail: { src: 'https://coach.scene7.com/is/image/Coach/77840_b4p1y_a0?$image400$' },
  },
  name: 'Tabby Shoulder Bag',
  url: 'https://www.coach.com/products/tabby-shoulder-bag-26/CH857.html?frp=CH857+B4MER',
  masterId: 'test123',
  hitType: 'set',
  thumbnail: { alt: 'description of the product' },
}

const mockStyles = {
  searchSuggestionItemWrapper: {},
  searchSuggestionItemLinkImage: {},
  searchSuggestionItemText: {},
  searchSuggestionItemPriceWrapper: {},
  searchSuggestionItemFooterWrapper: {},
  searchSuggestionItemFooterImage: {},
  searchSuggestionItemFooterProductName: {},
  searchSuggestionItemFooterProductText: {},
  searchSuggestionItemFooterPrice: {},
}

const onClickMock = jest.fn()
const onVisibleMock = jest.fn()

const defaultProps = {
  product: mockProduct as unknown as SearchSuggestionProduct,
  styleVariant: 'desktop' as const,
  isComparablePriceValue: true,
  onClick: onClickMock,
  onVisible: onVisibleMock,
  styles: mockStyles,
}

const makeSetup = ({
  atomsData = [],
  customProps = {},
  preferences = {},
}: {
  atomsData?: Array<[Atom<unknown>, unknown]>
  customProps?: Record<string, unknown>
  preferences?: Record<string, unknown>
} = {}) => {
  const combinedProps = { ...defaultProps, ...customProps }
  mockedUsePreference.mockImplementation(() => ({
    toggleSiteFeatures: {},
    searchSuggestions: { enableAltImages: true },
    priceSitePreferences: { hideListPrice: false },
    coachtopia: {
      coachtopiaHomeURL: '/shop/coachtopia',
    },
    generalConfiguration: {},
    navFlyoutStylings: {},
    plpTemplateConfigurations: {},
    certonaConfiguration: {},
    ...preferences,
  }))
  return render(<SearchSuggestionItem {...combinedProps} />, {
    ...customRenderOptions,
    contexts: {
      ...customRenderOptions.contexts,
      JotaiProviderContext: new Map(atomsData),
    },
  })
}

describe('SearchSuggestionItem', () => {
  beforeEach(() => {
    mockedUsePreference.mockImplementation(() => ({
      searchSuggestions: { enableAltImages: true },
      priceSitePreferences: { hideListPrice: false },
      coachtopia: {
        coachtopiaHomeURL: 'https://coachtopia.coach.com',
        enabled: true,
      },
      generalConfiguration: {
        changeSalePriceColor: false,
        siteIdentifier: 'coach',
      },
      navFlyoutStylings: {
        chooseNavTheme: 'default',
      },
      plpTemplateConfigurations: {
        HideDiscountPercentageOnPLP: false,
      },
      certonaConfiguration: {
        certonaPriceDisplay: true,
      },
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the component and display product name and image correctly', () => {
    const { getByText, getByRole } = makeSetup()
    expect(getByText('Tabby Shoulder Bag')).toBeVisible()
    expect(getByRole('img')).toHaveAttribute(
      'src',
      'https://coach.scene7.com/is/image/Coach/c0689_b4bk_a0?$image400$'
    )
    expect(onVisibleMock).toHaveBeenCalled()
  })

  it('should call onClick when the link is clicked', async () => {
    const { getAllByRole } = makeSetup()
    const link = getAllByRole('link')
    await userEvent.click(link[0])
    expect(onClickMock).toHaveBeenCalled()
  })

  it('should display alternate images when enabledAltImages is true', () => {
    const { getByRole } = makeSetup()
    const image = getByRole('img')
    expect(image).toHaveAttribute(
      'src',
      'https://coach.scene7.com/is/image/Coach/c0689_b4bk_a0?$image400$'
    )
  })

  it('should render component properly when hitType in not set', () => {
    const mockProductNonBundled = {
      ...mockProduct,
      hitType: 'add',
      defaultColor: { media: { thumbnail: { src: '' } } },
    }
    const { getByText } = makeSetup({ customProps: { product: mockProductNonBundled } })
    expect(getByText('Tabby Shoulder Bag')).toBeVisible()
  })

  it('should toggle hover state correctly', async () => {
    const { getByTestId } = makeSetup()
    const wrapper = getByTestId('d_hs_sugg_tile_pdtimg')
    await userEvent.hover(wrapper)
    expect(wrapper).toHaveAttribute('name', 'searchSuggestionItemWrapper')
  })

  it('should display correct qa attributes based on styleVariant', () => {
    const { getByRole } = makeSetup({ customProps: { styleVariant: 'footer' } })
    expect(getByRole('img')).toHaveAttribute('data-qa', 'cm_tile_link_pt_img')
  })

  it('should render the component correctly when styleVariant prop is mobileV2', () => {
    const { getByTestId } = makeSetup({ customProps: { styleVariant: 'mobileV2' } })
    expect(getByTestId('d_hs_sugg_tile_pdtimg')).toBeVisible()
  })

  it('should render the component correctly when styleVariant prop is among mobile variants', () => {
    const { getByTestId } = makeSetup({ customProps: { styleVariant: 'mobileExposed' } })
    expect(getByTestId('d_hs_sugg_tile_pdtimg')).toBeVisible()
  })

  it('should handle mouse out correctly', async () => {
    const { getByTestId } = makeSetup()
    const wrapper = getByTestId('d_hs_sugg_tile_pdtimg')
    await userEvent.unhover(wrapper)
    expect(wrapper).toHaveAttribute('name', 'searchSuggestionItemWrapper')
  })
})

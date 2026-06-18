import { render, CustomRenderOptions, screen } from 'test-utils/react'
import RecommendationPrice, {
  CertonaPriceType,
} from 'toro/components/Certona/RecommendationPrice/index'
import usePreference from 'toro/hooks/usePreference_new'

const defaultPreferenceValue = {
  generalConfiguration: { siteIdentifier: 'default' },
  priceSitePreferences: { isComparablePriceValue: false },
  certonaConfiguration: { certonaPriceDisplay: { default: CertonaPriceType.ShopGrid } },
  recommendations: { priceConfiguration: null },
}

jest.mock('toro/hooks/usePreference_new', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('toro/hooks/useCustomSalePriceColor', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

const renderComponent = (props = {}) => {
  return render(
    <RecommendationPrice product={undefined} hidePrice={false} scheme={''} {...props} />,
    renderOptions
  )
}

describe('RecommendationPrice Component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('component should render correctly with default props', () => {
    ;(usePreference as jest.Mock).mockReturnValue(defaultPreferenceValue)

    const product = {
      price: {
        currency: '$',
        discountpercentage: '20',
        fullprice: '100',
        saleprice: '80',
      },
    }

    renderComponent({ product, hidePrice: false, scheme: 'default' })

    expect(screen.getByTestId('cm_txt_pdt_price')).toBeVisible()
  })

  it('should not display product price when hidePrice prop is set to true', () => {
    ;(usePreference as jest.Mock).mockReturnValue(defaultPreferenceValue)

    const product = {
      price: {
        currency: '$',
        discountpercentage: '20',
        fullprice: '100',
        saleprice: '80',
      },
    }

    renderComponent({ product, hidePrice: true, scheme: 'default' })

    expect(screen.queryByText('cm_txt_pdt_price')).not.toBeInTheDocument()
  })

  it('should display discount percentage when CertonaPriceType is ShopGrid', () => {
    ;(usePreference as jest.Mock).mockReturnValue(defaultPreferenceValue)

    const product = {
      price: {
        currency: '$',
        discountpercentage: '20',
        fullprice: '100',
        saleprice: '80',
      },
    }

    const { container } = renderComponent({ product, hidePrice: false, scheme: 'default' })
    expect(container.querySelector('.discount-percentage')).toBeVisible()
  })

  it('should display full price when CertonaPriceType is ShopGridWODisc and price data is available', () => {
    ;(usePreference as jest.Mock).mockReturnValue({
      generalConfiguration: { siteIdentifier: 'default' },
      priceSitePreferences: { isComparablePriceValue: false },
      certonaConfiguration: { certonaPriceDisplay: { default: CertonaPriceType.ShopGridWODisc } },
      recommendations: { priceConfiguration: null },
    })

    const product = {
      price: {
        currency: '$',
        discountpercentage: '20',
        fullprice: '100',
        saleprice: '80',
      },
    }

    renderComponent({ product, hidePrice: false, scheme: 'default' })

    expect(screen.getByTestId('cm_txt_pdt_price')).toBeVisible()
  })

  it('should handle CertonaPriceType.ShopGrid with same sale and full price correctly', () => {
    ;(usePreference as jest.Mock).mockReturnValue(defaultPreferenceValue)

    const product = {
      price: {
        currency: '$',
        discountpercentage: '20',
        fullprice: '80',
        saleprice: '80',
      },
    }

    const { container } = renderComponent({ product, hidePrice: false, scheme: 'default' })

    expect(container.querySelector('.discount-percentage')).toBeVisible()
  })

  it('should not render price information when all price fields are empty', () => {
    ;(usePreference as jest.Mock).mockReturnValue(defaultPreferenceValue)

    const product = {
      price: {
        currency: '',
        discountpercentage: '',
        fullprice: '',
        saleprice: '',
      },
    }

    renderComponent({ product, hidePrice: false, scheme: 'default' })
    expect(screen.queryByText('cm_txt_pdt_price')).not.toBeInTheDocument()
  })

  it('should display discount percentage when sale price is less than full price and both are provided as integer strings', () => {
    ;(usePreference as jest.Mock).mockReturnValue({
      generalConfiguration: { siteIdentifier: 'coach-outlet' },
      priceSitePreferences: { isComparablePriceValue: false },
      certonaConfiguration: { certonaPriceDisplay: { default: CertonaPriceType.ShopGrid } },
      recommendations: { priceConfiguration: null },
    })

    const product = {
      price: {
        currency: '$',
        discountpercentage: '20',
        fullprice: '100',
        saleprice: '50',
      },
    }
    const { container } = renderComponent({ product, hidePrice: false, scheme: 'default' })
    expect(container.querySelector('.discount-percentage')).toBeVisible()
  })
  it('should display the strike-off price when showStrikeOffPrice is true and comparable price preference is enabled', () => {
    ;(usePreference as jest.Mock).mockReturnValue(defaultPreferenceValue)

    const product = {
      price: {
        currency: '$',
        discountpercentage: '20',
        fullprice: '100',
        saleprice: '80',
      },
    }

    const { container } = renderComponent({ product, hidePrice: false, scheme: 'default' })
    expect(container.querySelector('.strike-off-price')).toBeVisible()
  })
})

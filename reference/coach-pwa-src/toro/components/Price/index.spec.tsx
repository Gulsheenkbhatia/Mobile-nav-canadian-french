import { render, CustomRenderOptions } from 'test-utils/react'
import Price from 'toro/components/Price'
import useViewportType from 'toro/hooks/useViewportType'
import { mockLocation, getPreferencesMock } from 'test-utils/mock-utils'

jest.mock('toro/hooks/useViewportType')
jest.mocked(useViewportType).mockImplementation(() => ({ isDesktop: false, isMobile: true }))
jest.mock('toro/hooks/useCustomSalePriceColor', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}))

mockLocation()
const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        siteId: 'coh_us_out',
        brand: 'kate-spade',
        paypalDisabledOnMinicart: false,
        preferences: getPreferencesMock({
          paypalExpressCheckout: {
            PP_ShowExpressCheckoutButtonOnCart: true,
          },
        }),
      },
      injectScriptOnce: jest.fn(),
    },
    ViewportContext: {},
    AnalyticsContext: {},
    SessionContext: {},
  },
}

const makeSetup = async (props: object = {}, customRenderOptions?) => {
  const component = <Price {...props} />
  return render(component, customRenderOptions || renderOptions)
}
interface MockPropsOptions {
  productPrices?: {
    currentPrice?: number
    discount?: number | null
    isOnSale?: boolean
    priceRange?: any
    regularPrice?: number
  } | null
  promotionPrice?: Array<any> | null
  variantsOnSale?: Array<any> | null
  enableSwatches?: boolean
  pickedProps?: any | null
  activeColorId?: string
  pageType: string
  variant?: any
  isSearchSuggestionFormat?: boolean
  isComparablePriceValue?: number | boolean
  hideComparablePrice?: boolean
  hideDiscountedRate?: boolean
  pricePreferences?: {
    isHideStrikeOffPriceEnabled?: boolean
    isKsSur?: boolean
    isPriceRangeToggleEnabled?: boolean
    markdownPriceEnabled?: boolean
    showBundleListPrice?: boolean
    showPromotionalPrice?: boolean
  }
  isSWOutlet?: boolean
  isComparablePriceEnabledCategory?: boolean
}
const mockProps = ({
  productPrices,
  promotionPrice,
  variantsOnSale,
  enableSwatches,
  pickedProps,
  activeColorId,
  variant,
  isSearchSuggestionFormat,
  isComparablePriceValue,
  hideComparablePrice,
  hideDiscountedRate,
  pricePreferences,
  isSWOutlet,
  isComparablePriceEnabledCategory,
}: MockPropsOptions) => ({
  product: {
    prices: productPrices || {
      currentPrice: 135,
      discount: null,
      isOnSale: true,
      priceRange: null,
      regularPrice: 135,
    },
    promotionPrice: promotionPrice || [],
    variantsOnSale: variantsOnSale || [],
    enableSwatches: enableSwatches || false,
    pickedProps: pickedProps || null,
  },
  activeColorId: activeColorId,
  variant: variant,
  isSearchSuggestionFormat: isSearchSuggestionFormat || false,
  isComparablePriceValue: isComparablePriceValue || false,
  hideComparablePrice: hideComparablePrice || false,
  hideDiscountedRate: hideDiscountedRate || false,
  pricePreferences: {
    isHideStrikeOffPriceEnabled: false,
    isKsSur: false,
    isPriceRangeToggleEnabled: false,
    markdownPriceEnabled: true,
    showBundleListPrice: true,
    showPromotionalPrice: true,
    ...pricePreferences,
  },
  isSWOutlet: isSWOutlet || false,
  isComparablePriceEnabledCategory: isComparablePriceEnabledCategory || false,
})

describe('Price', () => {
  const pageType = 'plp'

  it('should renders Price component without crashing', async () => {
    await makeSetup(mockProps({ pageType }), renderOptions)
    const salePriceWrapper = document.querySelector('.salePriceWrapper')
    expect(salePriceWrapper).toBeVisible()
  })

  it('should renders the product price', async () => {
    const productPrices = { currentPrice: 70, priceRange: null, isOnSale: false, discount: null }
    const promotionPrice = [
      {
        sales: { value: 70, currency: 'GBP', formatted: '£70', decimalPrice: '70.00' },
        list: null,
        promotionalPrice: null,
        markdownDiscPercent: null,
        promotionDiscPercent: null,
        discountPercentage: null,
      },
    ]
    const result = await makeSetup(
      mockProps({ productPrices, promotionPrice, pageType }),
      renderOptions
    )
    const productPrice = result.getByTestId('cm_txt_pdt_price')
    expect(productPrice).toHaveTextContent('£70')
  })

  it('should render the product price with a discount in percentage format', async () => {
    const productPrices = {
      currentPrice: 135,
      discount: 70,
      isOnSale: true,
      priceRange: null,
      regularPrice: 450,
    }

    const promotionPrice = [
      {
        discountPercentage: 70,
        list: { value: 450, currency: 'USD', formatted: '$450', decimalPrice: '450.00' },
        markdownDiscPercent: 70,
        promotionDiscPercent: null,
        promotionalPrice: null,
        sales: { value: 135, currency: 'USD', formatted: '$135', decimalPrice: '135.00' },
      },
    ]

    const result = await makeSetup(
      mockProps({ productPrices, promotionPrice, pageType, isComparablePriceValue: 10 }),
      renderOptions
    )
    const discountedPrice = result.getByTestId('m_plp_txt_pt_price_upper_rl')
    const discountPercent = result.getByTestId('cm_txt_pdt_price_dpercent')
    expect(discountedPrice.textContent.trim()).toBe('$135')
    expect(discountPercent.textContent).toBe('(70% off)')
  })

  it('Should render the product price range with strikethrough text for the old price', async () => {
    const productPrices = {
      currentPrice: 450,
      priceRange: null,
      isOnSale: false,
      discount: null,
    }
    const promotionPrice = [
      {
        type: 'range',
        min: {
          sales: { value: 250, currency: 'USD', formatted: '$250', decimalPrice: '250.00' },
          list: { value: 450, currency: 'USD', formatted: '$450', decimalPrice: '450.00' },
          promotionalPrice: null,
          discountPercentage: 44,
        },
        max: {
          sales: { value: 450, currency: 'USD', formatted: '$450', decimalPrice: '450.00' },
          list: { value: 450, currency: 'USD', formatted: '$450', decimalPrice: '450.00' },
          promotionalPrice: null,
          discountPercentage: 0,
        },
        maxDiscount: { maxDiscount: 0, isDiscountSame: false },
        viewType: 'Case2',
      },
    ]
    const variantsOnSale = [
      {
        id: 'G4408-BLK',
        onSale: false,
        price: {
          sales: { value: 450, currency: 'USD', formatted: '$450', decimalPrice: '450.00' },
          list: null,
          promotionalPrice: null,
          markdownDiscPercent: null,
          promotionDiscPercent: null,
          discountPercentage: null,
        },
      },
    ]

    const pickedProps = { promotionData: { isOnSale: true } }
    const pricePreferences = {
      isHideStrikeOffPriceEnabled: true,
    }

    const result = await makeSetup(
      mockProps({
        productPrices,
        promotionPrice,
        variantsOnSale,
        pickedProps,
        pricePreferences,
        pageType,
      }),
      renderOptions
    )
    const lowerPrice = result.getByTestId('cm_txt_pdt_price_lower_rl')
    const higherPrice = result.getByTestId('cm_txt_pdt_price_upper_rl')
    const strikethroughPrice = result.queryByTestId('cm_txt_pdt_price_strthr')
    expect(lowerPrice.textContent.trim()).toBe('$250')
    expect(higherPrice.textContent.trim()).toBe('$450')
    expect(strikethroughPrice.textContent.trim()).toBe('$450')
  })
  it('Should render the product price with strikethrough text for the old price and a discount in percentage format', async () => {
    const productPrices = {
      currentPrice: 350,
      regularPrice: 450,
      priceRange: null,
      isOnSale: false,
      discount: 40,
    }
    const promotionPrice = [
      {
        discountPercentage: 30,
        list: { value: 450, currency: 'USD', formatted: '$450', decimalPrice: '450.00' },
        markdownDiscPercent: 30,
        promotionDiscPercent: null,
        promotionalPrice: null,
        sales: { value: 247.5, currency: 'USD', formatted: '$247.50', decimalPrice: '247.50' },
      },
    ]

    const pickedProps = { promotionData: { isOnSale: true } }
    const pricePreferences = {
      isHideStrikeOffPriceEnabled: true,
    }
    const result = await makeSetup(
      mockProps({
        productPrices,
        promotionPrice,
        pickedProps,
        pricePreferences,
        pageType,
      }),
      renderOptions
    )
    const discountedPrice = result.getByTestId('m_plp_txt_pt_price_upper_rl')
    const strikethroughPrice = result.getByTestId('cm_txt_pdt_price_strthr')
    const discountPercent = result.getByTestId('cm_txt_pdt_price_dpercent')
    expect(discountedPrice.textContent.trim()).toBe('$247.50')
    expect(strikethroughPrice.textContent.trim()).toBe('$450')
    expect(discountPercent.textContent.trim()).toBe('(30%)')
  })
})

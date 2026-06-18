import { render, screen } from 'test-utils/react'
import PriceInfo from 'toro/components/product/PriceInfo'
import OneSitePriceInfo from 'toro/components/product/PriceInfo/OneSitePriceInfo'
import { productPriceAtom, currentProductVerticalAtom } from 'store/pdp.atom'
import { Provider, Atom } from 'jotai'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useExperiment from 'toro/hooks/useExperiment'
import useViewportType from 'toro/hooks/useViewportType'

jest.mock('toro/hooks/useMultiStyleConfig')
jest.mock('toro/hooks/useExperiment')
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/hooks/usePreference', () => () => false)
jest.mock('toro/hooks/usePreference_new', () => () => ({
  priceSitePreferences: { isComparablePriceValue: false, hideListPrice: false },
  generalConfiguration: { siteIdentifier: 'coach' },
}))
jest.mock('toro/hooks/useGetCurrencyOptions', () => () => () => ({}))
jest.mock('toro/hooks/useTheme', () => () => ({
  colors: { main: { gray: '#999' }, neutral: { medium: '#888' }, success: { primary: '#0a0' } },
  fontSizes: { xl: '20px', double: '28px' },
}))
jest.mock('toro/components/product/ComparablePrice', () => () => null)
jest.mock('toro/components/badges/Badges', () => () => null)

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({ locale: 'en' })
  return { ...reactIntl, useIntl: () => intl }
})

/**
 * CH857 - Coach customizable bag.
 * Base price $350, on sale for $295 (15% off).
 * After customization (pattern added), price becomes $395, standardPrice stays $350.
 */
const baseProduct = {
  masterId: 'CH857',
  prices: { regularPrice: 350, currentPrice: 295, discount: 15 },
  pickedProps: { currency: 'USD' },
  hitType: 'master',
  isBundleProduct: false,
}

const customizedSelectedColor = {
  id: 'CH857_B4CBD',
  name: 'Brass/Candy Pink',
  vgId: 'CH857_B4CBD',
  isCustomized: true,
  price: '$395',
  standardPrice: '$350',
}

const customizedProductPrice = {
  regularPrice: '$350',
  salePrice: '$395',
  discountPercentageValue: 0,
  isCustomizedProduct: true,
  hideDiscountPercentageOneSite: false,
  hideComparableValueOneSite: true,
}

const styleFn = () => ({})
const mockStyles = {
  PriceInfoWrapper: styleFn,
  PriceInfoBox: styleFn,
  SalePriceBlackText: styleFn,
  SalePriceRedText: styleFn,
  ListPriceWrapper: styleFn,
  ListPriceText: styleFn,
  DisPercentage: styleFn,
  DisPercentageText: styleFn,
  DealPriceWrapper: styleFn,
  DealPriceBox: styleFn,
  DealPriceText: styleFn,
  StandardPriceWrapper: styleFn,
  PriceTaxIncluded: styleFn,
}

describe('Customizable product pricing parity', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useMultiStyleConfig).mockReturnValue(mockStyles)
    jest.mocked(useExperiment).mockReturnValue(false)
    jest.mocked(useViewportType).mockReturnValue({ isMobile: false, isDesktop: true })
  })

  it('non-OneSite: PriceInfo shows customized price and hides discount', () => {
    render(<PriceInfo productData={baseProduct} selectedColor={customizedSelectedColor} />, {
      contexts: {
        PWAContext: { appData: { siteId: 'coh_us', brand: 'coach' } },
      },
    } as any)

    expect(screen.getByText('$395')).toBeVisible()
    expect(screen.queryByText('(15% off)')).not.toBeInTheDocument()
  })

  it('OneSite: OneSitePriceInfo shows customized price and hides discount', () => {
    const initialValues: [Atom<unknown>, unknown][] = [
      [productPriceAtom, customizedProductPrice],
      [currentProductVerticalAtom, 'collection'],
    ]

    render(
      <Provider initialValues={initialValues}>
        <OneSitePriceInfo />
      </Provider>
    )

    expect(screen.getByText('$395')).toBeVisible()
    expect(screen.queryByText('(15% off)')).not.toBeInTheDocument()
  })
})

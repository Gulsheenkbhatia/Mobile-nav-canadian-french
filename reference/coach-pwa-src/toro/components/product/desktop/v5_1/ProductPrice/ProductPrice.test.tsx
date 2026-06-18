import { render, screen } from 'test-utils/react'
import ProductPrice from './index'
import { productPriceAtom, productDataAtom } from 'store/pdp.atom'
import { isSubBrandActiveAtom } from 'store/global.atom'
import { Provider, Atom } from 'jotai'
import useProductData from 'toro/hooks/useProductData'
import usePreference from 'toro/hooks/usePreference_new'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'

// Mock the hooks
jest.mock('toro/hooks/useProductData')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useMultiStyleConfig')
jest.mock('toro/hooks/useSelectedVariantData')

interface AtomValues {
  productPrice?: {
    regularPrice: string | null
    salePrice: string | null
    discountPercentageValue: number
  }
  isSubBrandActive?: boolean
  productData?: any
}

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({
    locale: 'en',
  })

  return {
    ...reactIntl,
    useIntl: () => intl,
  }
})

describe('ProductPrice', () => {
  const mockStyles = {
    productPriceWrapper: {},
    comparablePrice: {},
    productPriceRow: {},
    productPrice: {},
    oldPrice: {},
    discount: {},
  }

  const defaultPreference = {
    priceSitePreferences: { isComparablePriceValue: true },
    generalConfiguration: { siteIdentifier: 'ksna' },
  }

  const defaultProductData = {
    variant: [],
    defaultVariant: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mock implementations
    jest.mocked(useMultiStyleConfig).mockReturnValue(mockStyles)
    jest.mocked(usePreference).mockReturnValue(defaultPreference)
    jest.mocked(useProductData).mockReturnValue([false, false]) // [hideDiscountRate, hideComparablePrice]
    jest.mocked(useSelectedVariantData).mockReturnValue([false, false]) // [hideComparablePriceSV, hideDiscountRateSV]
  })

  const renderWithAtoms = (ui: React.ReactElement, atomValues: AtomValues = {}) => {
    const initialValues: [Atom<unknown>, unknown][] = [
      [
        productPriceAtom,
        atomValues?.productPrice || {
          regularPrice: '$100',
          salePrice: '$80',
          discountPercentageValue: 20,
        },
      ],
      [isSubBrandActiveAtom, atomValues?.isSubBrandActive || false],
      [productDataAtom, atomValues?.productData || defaultProductData],
    ]

    return render(<Provider initialValues={initialValues}>{ui}</Provider>, {
      contexts: {
        PWAContext: {
          appData: {
            isDiscountOffDisabled: false,
          },
        },
      },
    })
  }

  it('should render regular price', () => {
    renderWithAtoms(<ProductPrice />, {
      productPrice: {
        regularPrice: '$100',
        salePrice: null,
        discountPercentageValue: 0,
      },
    })

    expect(screen.getByText('$100')).toBeVisible()
    expect(screen.getByTestId('cm_txt_pdt_price')).toBeVisible()
  })

  it('should render sale price with discount for non-outlet brand', () => {
    renderWithAtoms(<ProductPrice />)

    expect(screen.getByText('$80')).toBeVisible()
    expect(screen.getByText('$100')).toBeVisible()
    expect(screen.getByText('(20% off)')).toBeVisible()
    // For non-outlet brands, old price should be shown
    expect(screen.getByTestId('cm_txt_pdt_price_strthr')).toBeVisible()
  })

  it('should render comparable value for outlet brand', () => {
    jest.mocked(usePreference).mockReturnValue({
      priceSitePreferences: { isComparablePriceValue: true },
      generalConfiguration: { siteIdentifier: 'ksna-surprise' },
    })

    renderWithAtoms(<ProductPrice />)

    expect(screen.getByText('Comparable Value $100')).toBeVisible()
    expect(screen.getByText('$80')).toBeVisible()
    expect(screen.getByText('(20% off)')).toBeVisible()
    // For outlet brands, old price should NOT be shown
    expect(screen.queryByTestId('cm_txt_pdt_price_strthr')).not.toBeInTheDocument()
  })

  it('should hide discount rate when both hideDiscountRate and hideDiscountRateSV are true', () => {
    jest.mocked(useProductData).mockReturnValue([true, false]) // [hideDiscountRate, hideComparablePrice]
    jest.mocked(useSelectedVariantData).mockReturnValue([false, true]) // [hideComparablePriceSV, hideDiscountRateSV]

    renderWithAtoms(<ProductPrice />)

    expect(screen.getByText('$80')).toBeVisible()
    expect(screen.queryByText('(20% off)')).not.toBeInTheDocument()
  })

  it('should hide comparable price when both hideComparablePrice and hideComparablePriceSV are true', () => {
    jest.mocked(useProductData).mockReturnValue([false, true]) // [hideDiscountRate, hideComparablePrice]
    jest.mocked(useSelectedVariantData).mockReturnValue([true, false]) // [hideComparablePriceSV, hideDiscountRateSV]
    jest.mocked(usePreference).mockReturnValue({
      priceSitePreferences: { isComparablePriceValue: true },
      generalConfiguration: { siteIdentifier: 'ksna-surprise' },
    })

    renderWithAtoms(<ProductPrice />)

    expect(screen.queryByText('Comparable Value $100')).not.toBeInTheDocument()
    expect(screen.getByText('$80')).toBeVisible()
  })

  it('should show discount rate when only hideDiscountRateSV is true', () => {
    jest.mocked(useSelectedVariantData).mockReturnValue([false, true]) // [hideComparablePriceSV, hideDiscountRateSV]

    renderWithAtoms(<ProductPrice />)

    expect(screen.getByText('$80')).toBeVisible()
    expect(screen.getByText('(20% off)')).toBeVisible() // Should still show because hideDiscountRate is false
  })

  it('should show comparable price when only hideComparablePriceSV is true', () => {
    jest.mocked(useSelectedVariantData).mockReturnValue([true, false]) // [hideComparablePriceSV, hideDiscountRateSV]
    jest.mocked(usePreference).mockReturnValue({
      priceSitePreferences: { isComparablePriceValue: true },
      generalConfiguration: { siteIdentifier: 'ksna-surprise' },
    })

    renderWithAtoms(<ProductPrice />)

    expect(screen.getByText('Comparable Value $100')).toBeVisible() // Should still show because hideComparablePrice is false
    expect(screen.getByText('$80')).toBeVisible()
  })
})

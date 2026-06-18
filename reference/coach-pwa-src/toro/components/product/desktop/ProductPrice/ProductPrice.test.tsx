import { render, screen } from 'test-utils/react'
import ProductPrice from './index'
import { productPriceAtom } from 'store/pdp.atom'
import { isSubBrandActiveAtom } from 'store/global.atom'
import { Provider, Atom } from 'jotai'
import useProductData from 'toro/hooks/useProductData'
import usePreference from 'toro/hooks/usePreference_new'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useTemplate from 'toro/hooks/useTemplate'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import { TemplateNames } from 'toro/constants/templates'
// Mock the hooks
jest.mock('toro/hooks/useProductData')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useMultiStyleConfig')
jest.mock('toro/hooks/useTemplate')
jest.mock('toro/hooks/useSelectedVariantData')

// Mock the PriceCallout component
jest.mock('toro/components/product/desktop/PriceCallout', () => {
  return function MockPriceCallout() {
    return <div data-testid="price-callout">Price Callout</div>
  }
})

// Mock the Template component
jest.mock('toro/components/Template', () => {
  return function MockTemplate({
    children,
    notForIDs,
  }: {
    children: React.ReactNode
    notForIDs?: TemplateNames
  }) {
    return <div data-testid="template">{children}</div>
  }
})

interface AtomValues {
  productPrice?: {
    regularPrice: string | null
    salePrice: string | null
    discountPercentageValue: number
  }
  isSubBrandActive?: boolean
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
    generalConfiguration: { siteIdentifier: 'coach' },
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mock implementations
    jest.mocked(useMultiStyleConfig).mockReturnValue(mockStyles)
    jest.mocked(usePreference).mockReturnValue(defaultPreference)
    jest.mocked(useProductData).mockReturnValue([false, false, false])
    jest.mocked(useTemplate).mockReturnValue(false) // isPDPv6 = false by default
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

  it('should render sale price with discount', () => {
    renderWithAtoms(<ProductPrice />)

    expect(screen.getByText('$80')).toBeVisible()
    expect(screen.getByText('$100')).toBeVisible()
    expect(screen.getByText('(20% off)')).toBeVisible()
  })

  it('hides strikethrough regular price for discounted outlet products when isOutletBrand is false', () => {
    jest.mocked(useProductData).mockReturnValue([false, false, true])

    const { container } = renderWithAtoms(<ProductPrice />)

    expect(screen.getByText('$80')).toBeVisible()
    expect(container.querySelector('.regular-price')).toBeNull()
  })

  it('should render comparable value', () => {
    jest.mocked(usePreference).mockReturnValue({
      priceSitePreferences: { isComparablePriceValue: true },
      generalConfiguration: { siteIdentifier: 'coach-outlet' },
    })

    renderWithAtoms(<ProductPrice />)

    expect(screen.getByText('Comparable Value $100')).toBeVisible()
    expect(screen.getByText('$80')).toBeVisible()
    expect(screen.getByText('(20% off)')).toBeVisible()
  })

  it('should hide discount rate when both hideDiscountRate and hideDiscountRateSV are true', () => {
    jest.mocked(useProductData).mockReturnValue([true, false, false]) // [hideDiscountRate, hideComparablePrice, isOutletProduct]
    jest.mocked(useSelectedVariantData).mockReturnValue([false, true]) // [hideComparablePriceSV, hideDiscountRateSV]

    renderWithAtoms(<ProductPrice />)

    expect(screen.getByText('$80')).toBeVisible()
    expect(screen.queryByText('(20% off)')).not.toBeInTheDocument()
  })

  it('should hide comparable price when both hideComparablePrice and hideComparablePriceSV are true', () => {
    jest.mocked(useProductData).mockReturnValue([false, true, false]) // [hideDiscountRate, hideComparablePrice, isOutletProduct]
    jest.mocked(useSelectedVariantData).mockReturnValue([true, false]) // [hideComparablePriceSV, hideDiscountRateSV]
    jest.mocked(usePreference).mockReturnValue({
      priceSitePreferences: { isComparablePriceValue: true },
      generalConfiguration: { siteIdentifier: 'coach-outlet' },
    })

    renderWithAtoms(<ProductPrice />)

    expect(screen.queryByText('Comparable Value $100')).not.toBeInTheDocument()
    expect(screen.getByText('$80')).toBeVisible()
  })

  it('applies sub-brand styles when isSubBrandActive is true', () => {
    renderWithAtoms(<ProductPrice />, {
      isSubBrandActive: true,
    })

    const priceContainer = screen.getByText('$100').closest('.sub-brand-price-container')
    expect(priceContainer).toBeInTheDocument()
  })

  it('should render comparable price in PDPv6 template', () => {
    jest.mocked(useTemplate).mockReturnValue(true) // isPDPv6 = true
    jest.mocked(usePreference).mockReturnValue({
      priceSitePreferences: { isComparablePriceValue: true },
      generalConfiguration: { siteIdentifier: 'coach-outlet' },
    })

    renderWithAtoms(<ProductPrice />)

    // In PDPv6, comparable price should appear after the price row, not before
    expect(screen.getByText('Comparable Value $100')).toBeVisible()
    expect(screen.getByText('$80')).toBeVisible()
  })

  it('should not render PriceCallout for PDPv6 template', () => {
    jest.mocked(useTemplate).mockReturnValue(true) // isPDPv6 = true

    renderWithAtoms(<ProductPrice />)

    // PriceCallout should not be rendered when template is PDPv6
    expect(screen.queryByTestId('price-callout')).not.toBeInTheDocument()
  })
})

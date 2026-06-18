import { render, screen } from 'test-utils/react'
import OneSitePriceInfo from './OneSitePriceInfo'
import { productPriceAtom, currentProductVerticalAtom } from 'store/pdp.atom'
import { Provider, Atom } from 'jotai'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useExperiment from 'toro/hooks/useExperiment'
import useViewportType from 'toro/hooks/useViewportType'

jest.mock('toro/hooks/useMultiStyleConfig')
jest.mock('toro/hooks/useExperiment')
jest.mock('toro/hooks/useViewportType')
jest.mock('./useSyncTangibleePriceGroup', () => ({
  useSyncTangibleePriceGroup: jest.fn(),
}))
jest.mock('toro/components/product/ComparablePrice', () => (props: any) => (
  <div data-qa="comparable-price">{props.listPrice}</div>
))

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({ locale: 'en' })
  return { ...reactIntl, useIntl: () => intl }
})

const defaultProductPrice = {
  regularPrice: '$350',
  salePrice: '$295',
  discountPercentageValue: 15,
  isCustomizedProduct: false,
  hideDiscountPercentageOneSite: false,
  hideComparableValueOneSite: false,
}

const customizedProductPrice = {
  regularPrice: '$350',
  salePrice: '$395',
  discountPercentageValue: 0,
  hideDiscountPercentageOneSite: false,
  hideComparableValueOneSite: true,
}

const mockStyles = {
  PriceInfoWrapper: () => ({}),
  PriceInfoBox: () => ({}),
  SalePriceBlackText: () => ({}),
  ListPriceWrapper: () => ({}),
  ListPriceText: () => ({}),
  DisPercentage: () => ({}),
  DisPercentageText: () => ({}),
}

interface RenderOptions {
  productPrice?: typeof defaultProductPrice
  productVertical?: string
}

const renderWithAtoms = (options: RenderOptions = {}) => {
  const { productPrice = defaultProductPrice, productVertical = 'collection' } = options

  const initialValues: [Atom<unknown>, unknown][] = [
    [productPriceAtom, productPrice],
    [currentProductVerticalAtom, productVertical],
  ]

  return render(
    <Provider initialValues={initialValues}>
      <OneSitePriceInfo />
    </Provider>
  )
}

describe('OneSitePriceInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useMultiStyleConfig).mockReturnValue(mockStyles)
    jest.mocked(useExperiment).mockReturnValue(false)
    jest.mocked(useViewportType).mockReturnValue({ isMobile: false, isDesktop: true })
  })

  it('should render regular sale price for non-customized product', () => {
    renderWithAtoms()

    expect(screen.getByText('$295')).toBeVisible()
  })

  it('should show discount for non-customized product', () => {
    renderWithAtoms()

    expect(screen.getByText('(15% off)')).toBeVisible()
  })

  it('should render customized price when product is customized', () => {
    renderWithAtoms({
      productPrice: {
        ...defaultProductPrice,
        regularPrice: '$350',
        salePrice: '$395',
        discountPercentageValue: 0,
        isCustomizedProduct: true,
      },
    })

    expect(screen.getByText('$395')).toBeVisible()
  })

  it('should not show discount rate for customized product', () => {
    renderWithAtoms({
      productPrice: {
        ...defaultProductPrice,
        regularPrice: '$350',
        salePrice: '$395',
        discountPercentageValue: 0,
        isCustomizedProduct: true,
      },
    })

    expect(screen.queryByTestId('cm_txt_pdt_price_dpercent')).not.toBeInTheDocument()
  })

  it('should show standard price as strikethrough when customized price differs', () => {
    renderWithAtoms({
      productPrice: {
        ...defaultProductPrice,
        regularPrice: '$350',
        salePrice: '$395',
        discountPercentageValue: 0,
        isCustomizedProduct: true,
      },
      productVertical: 'collection',
    })

    const strikeThroughElement = screen.getByTestId('cm_txt_pdt_price_strthr')
    expect(strikeThroughElement).toBeVisible()
    expect(strikeThroughElement).toHaveTextContent('$350')
  })

  it('should render N/A when customized price is invalid', () => {
    renderWithAtoms({
      productPrice: {
        ...defaultProductPrice,
        regularPrice: '$350',
        salePrice: 'N/A',
        discountPercentageValue: 0,
        isCustomizedProduct: true,
      },
    })

    expect(screen.getByText('N/A')).toBeVisible()
  })

  it('should not show strikethrough when sale price is N/A', () => {
    renderWithAtoms({
      productPrice: {
        ...customizedProductPrice,
        isCustomizedProduct: false,
        salePrice: 'N/A',
      },
      productVertical: 'collection',
    })

    expect(screen.queryByTestId('cm_txt_pdt_price_strthr')).not.toBeInTheDocument()
  })

  it('should handle monogrammed product the same as customized', () => {
    renderWithAtoms({
      productPrice: {
        ...defaultProductPrice,
        regularPrice: '$350',
        salePrice: '$350',
        discountPercentageValue: 0,
        isCustomizedProduct: true,
      },
    })

    expect(screen.getByText('$350')).toBeVisible()
    expect(screen.queryByTestId('cm_txt_pdt_price_dpercent')).not.toBeInTheDocument()
  })

  it('should show comparable price for non-customized outlet product on sale', () => {
    renderWithAtoms({
      productPrice: defaultProductPrice,
      productVertical: 'outlet',
    })

    expect(screen.getByTestId('comparable-price')).toBeVisible()
  })

  it('should not show comparable price for customized outlet product', () => {
    renderWithAtoms({
      productPrice: {
        ...defaultProductPrice,
        isCustomizedProduct: true,
        hideComparableValueOneSite: false,
      },
      productVertical: 'outlet',
    })

    expect(screen.queryByTestId('comparable-price')).not.toBeInTheDocument()
  })

  it('should fall back to atom price when not customized', () => {
    renderWithAtoms({
      productPrice: {
        ...defaultProductPrice,
        salePrice: '$199',
        regularPrice: '$250',
      },
    })

    expect(screen.getByText('$199')).toBeVisible()
  })
})

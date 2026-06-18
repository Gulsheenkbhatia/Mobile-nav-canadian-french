import React from 'react'
import { render, screen, fireEvent, waitFor } from 'test-utils/react'
import { IntlProvider } from 'react-intl'
import SessionContext from 'toro/components/SessionContext'
import { useAtomValue } from 'jotai/utils'
import ProductActions from 'toro/components/product/mobile/v7/ProductActions'
import usePreference from 'toro/hooks/usePreference_new'
import useAddItemToCart from 'toro/hooks/useAddToCartDesktopMobile'
import useAnalytics from 'toro/analytics/useAnalytics'
import getAverageColor from 'toro/helpers/getAverageColor'
import { getContrastColor } from 'toro/helpers/getContrastColor'
import useProductData from 'toro/hooks/useProductData'
import {
  addToBagButtonTextDataAtom,
  alterCtaToShowAtom,
  AlterCtaToShow,
  isCustomizedProductAtom,
  isInStockTextAtom,
  isNotifyMeAvailableProductAtom,
  isSizedProductAtom,
  maxQuantityErrorAtom,
  orderingStatusAtom,
  persistSoldOutSettingAtom,
  productPriceAtom,
  selectedColorAtom,
  selectedSizeAtom,
} from 'store/pdp.atom'
import { ORDERING_STATUS } from 'toro/helpers/productVariations'

jest.mock('toro/hooks/useProductData', () => ({
  __esModule: true,
  default: jest.fn((key) => (key === 'id' ? 'test-product-id' : false)),
}))

jest.mock('toro/components/product/desktop/AddToBagArea/TooltipVariationMessages', () => ({
  __esModule: true,
  default: () => null,
}))

jest.mock('toro/components/product/desktop/AddToBagArea/AlternateCta', () => ({
  __esModule: true,
  default: () => null,
}))

jest.mock('toro/components/product/mobile/v7/SizeSelectorModern', () => ({
  __esModule: true,
  default: () => null,
}))

jest.mock('jotai', () => {
  const actual = jest.requireActual('jotai')
  return {
    ...actual,
    useAtom: jest.fn(),
  }
})

jest.mock('jotai/utils', () => {
  const actual = jest.requireActual('jotai/utils')
  return {
    ...actual,
    useAtomValue: jest.fn(),
  }
})

jest.mock('toro/hooks/useStyles', () => ({
  __esModule: true,
  default: () => ({
    productActionsArea: {},
    productActionsContainer: {},
    selectSizeBtn: {},
    selectSizeHyphen: {},
    selectSizeLabel: {},
    addToBagBtn: {},
  }),
}))

jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useAddToCartDesktopMobile')
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/helpers/getAverageColor')
jest.mock('toro/helpers/getContrastColor')

const mockedUsePreference = jest.mocked(usePreference)
const mockedUseAddToCart = jest.mocked(useAddItemToCart)
const mockedUseAnalytics = jest.mocked(useAnalytics)
const mockedGetAverageColor = jest.mocked(getAverageColor)
const mockedGetContrastColor = jest.mocked(getContrastColor)
const mockedUseProductData = jest.mocked(useProductData)

const messages = {
  'pdp.product.selectSizeCta': 'Select Size',
  'pdp.product.sizeCta': 'Size',
  'pdp.product.us': 'US',
  'pdp.product.addToBagCta': 'Add to Bag',
}

const sessionContextValue = { session: {} }

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <SessionContext.Provider value={sessionContextValue}>
      <IntlProvider locale="en" messages={messages}>
        {ui}
      </IntlProvider>
    </SessionContext.Provider>
  )

let mockSelectedColor: any
let mockSelectedSize: any
let mockIsSizedProduct: any

const defaultAtomValue = (atom: unknown) => {
  if (atom === selectedColorAtom) return mockSelectedColor
  if (atom === selectedSizeAtom) return mockSelectedSize
  if (atom === isSizedProductAtom) return mockIsSizedProduct
  if (atom === productPriceAtom) return { regularPrice: '$100', salePrice: undefined }
  if (atom === addToBagButtonTextDataAtom) {
    return {
      id: 'pdp.product.addToBagAdaptivePDPTextMobile',
      defaultMessage: 'Add to Bag',
    }
  }
  if (atom === orderingStatusAtom) return ORDERING_STATUS.addToBag
  if (atom === maxQuantityErrorAtom) return false
  if (atom === isInStockTextAtom) return false
  if (atom === persistSoldOutSettingAtom) return false
  if (atom === alterCtaToShowAtom) return AlterCtaToShow.EMPTY
  if (atom === isNotifyMeAvailableProductAtom) return false
  if (atom === isCustomizedProductAtom) return false
  return null
}

describe('ProductActions', () => {
  const mockAddToCart = jest.fn()
  const mockAnalyticsSend = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockSelectedColor = { image: { src: '/test-image.jpg' } }
    mockSelectedSize = 'M'
    mockIsSizedProduct = true
    mockedUseProductData.mockImplementation((key) => (key === 'id' ? 'test-product-id' : false))

    mockedUsePreference.mockReturnValue({
      pdpPreferences: {
        templateConfigs: {
          pdpv7: {
            atbCtaBackgroundColorAdaptive: true,
          },
        },
      },
    } as any)

    mockedUseAddToCart.mockReturnValue({
      addToCart: mockAddToCart,
    } as any)
    mockedUseAnalytics.mockReturnValue({
      send: mockAnalyticsSend,
    } as any)

    mockedGetAverageColor.mockResolvedValue('#000000')
    mockedGetContrastColor.mockReturnValue('#ffffff')
    ;(useAtomValue as jest.Mock).mockImplementation((atom) => defaultAtomValue(atom))
  })

  it('renders Add to Bag with price prefix when variant price present', async () => {
    renderWithProviders(<ProductActions />)
    expect(
      await screen.findByText((text) => text.includes('$100') && text.includes('Add to Bag'))
    ).toBeInTheDocument()
  })

  it('calls addToCart when Add to Bag clicked', async () => {
    renderWithProviders(<ProductActions />)
    const btn = await screen.findByTestId('pdp_addtocart_btn')
    fireEvent.click(btn)
    expect(mockAddToCart).toHaveBeenCalledTimes(1)
  })

  it('samples image color and asks for contrast (happy path)', async () => {
    renderWithProviders(<ProductActions />)
    await waitFor(() => {
      expect(mockedGetAverageColor).toHaveBeenCalled()
    })
    expect(mockedGetContrastColor).toHaveBeenCalledWith('#000000')
  })

  it('renders Add to Bag with price even when size not selected', async () => {
    mockSelectedSize = null

    renderWithProviders(<ProductActions />)
    expect(
      await screen.findByText((text) => text.includes('$100') && text.includes('Add to Bag'))
    ).toBeInTheDocument()
  })

  it('renders Select Size on the size button when no size is selected', async () => {
    mockSelectedSize = null

    renderWithProviders(<ProductActions />)
    const sizeBtn = await screen.findByTestId('pdp_select_btn')
    expect(sizeBtn).toHaveTextContent('Select Size')
  })

  it('renders Size — (US) {size} on the size button when a size is selected', async () => {
    mockSelectedSize = 'M'

    renderWithProviders(<ProductActions />)
    const sizeBtn = await screen.findByTestId('pdp_select_btn')
    expect(sizeBtn).toHaveTextContent('Size')
    expect(sizeBtn).toHaveTextContent('—')
    expect(sizeBtn).toHaveTextContent('(US)')
    expect(sizeBtn).toHaveTextContent('M')
  })

  it('fires productInteraction when Select Size button is clicked', async () => {
    mockSelectedSize = null

    renderWithProviders(<ProductActions />)
    const sizeBtn = await screen.findByTestId('pdp_select_btn')
    fireEvent.click(sizeBtn)

    expect(mockAnalyticsSend).toHaveBeenCalledWith('productInteraction', {
      eventAction: 'size drawer open',
      eventLocation: 'size select drawer',
      eventLabel: 'test-product-id',
      eventPageLocation: 'product',
    })
  })

  it('does not render Select Size when product is not sized (matches PDP v6 MainStage)', async () => {
    mockIsSizedProduct = false

    renderWithProviders(<ProductActions />)
    await screen.findByTestId('pdp_addtocart_btn')
    expect(screen.queryByTestId('pdp_select_btn')).not.toBeInTheDocument()
  })

  it('does not render Select Size when sized but colorway is sold out (v7 bar; v6 MainStage would still show SizeSelector)', async () => {
    ;(useAtomValue as jest.Mock).mockImplementation((atom) => {
      if (atom === orderingStatusAtom) return ORDERING_STATUS.soldOut
      return defaultAtomValue(atom)
    })

    renderWithProviders(<ProductActions />)
    await screen.findByTestId('pdp_addtocart_btn')
    expect(screen.queryByTestId('pdp_select_btn')).not.toBeInTheDocument()
  })

  it('does not call getAverageColor if selected color image src is absent', async () => {
    mockSelectedColor = { image: {} }
    renderWithProviders(<ProductActions />)
    await waitFor(() => {
      expect(mockedGetAverageColor).not.toHaveBeenCalled()
    })
  })

  it('ignores stale sampling results when selected color changes quickly', async () => {
    const firstColor = { image: { src: '/first.jpg' } }
    const secondColor = { image: { src: '/second.jpg' } }

    let firstResolve: (val: string) => void
    const firstPromise = new Promise<string>((resolve) => {
      firstResolve = resolve
    })

    mockedGetAverageColor
      .mockImplementationOnce(() => firstPromise)
      .mockResolvedValueOnce('#222222')

    mockedGetContrastColor.mockClear()
    mockSelectedColor = firstColor

    const { rerender } = renderWithProviders(<ProductActions />)
    mockSelectedColor = secondColor

    rerender(
      <SessionContext.Provider value={sessionContextValue}>
        <IntlProvider locale="en" messages={messages}>
          <ProductActions />
        </IntlProvider>
      </SessionContext.Provider>
    )
    firstResolve?.('#111111')

    await waitFor(() => {
      expect(mockedGetAverageColor).toHaveBeenCalledTimes(2)
    })
    await waitFor(() => {
      expect(mockedGetContrastColor).toHaveBeenCalledWith('#222222')
    })
  })

  it('renders Add to Bag with salePrice when present (not regularPrice)', async () => {
    ;(useAtomValue as jest.Mock).mockImplementation((atom) => {
      if (atom === productPriceAtom) return { regularPrice: '$100', salePrice: '$80' }
      return defaultAtomValue(atom)
    })

    renderWithProviders(<ProductActions />)
    expect(
      await screen.findByText((text) => text.includes('$80') && !text.includes('$100$80'))
    ).toBeInTheDocument()
    expect(screen.queryByText((text) => text.startsWith('$100 —'))).not.toBeInTheDocument()
  })

  it('renders the separator with correct spacing between price and CTA', async () => {
    ;(useAtomValue as jest.Mock).mockImplementation((atom) => {
      if (atom === productPriceAtom) return { regularPrice: '$100', salePrice: '$80' }
      return defaultAtomValue(atom)
    })

    renderWithProviders(<ProductActions />)
    expect(await screen.findByText('$80 — Add to Bag')).toBeInTheDocument()
  })

  it('does not apply sampled swatch to ATB background when atbCtaBackgroundColorAdaptive is false', async () => {
    mockedGetAverageColor.mockResolvedValue('#ff00ff')
    mockedUsePreference.mockReturnValue({
      pdpPreferences: {
        templateConfigs: { pdpv7: { atbCtaBackgroundColorAdaptive: false } },
      },
    } as any)

    renderWithProviders(<ProductActions />)
    const btn = await screen.findByTestId('pdp_addtocart_btn')

    expect(mockedGetAverageColor).not.toHaveBeenCalled()
    // Chakra often surfaces CTA fill via classes, not inline style; still ensure we never land on the swatch sample.
    expect(window.getComputedStyle(btn).backgroundColor).not.toBe('rgb(255, 0, 255)')
  })

  it('applies sampled swatch to ATB background when atbCtaBackgroundColorAdaptive is true', async () => {
    mockedGetAverageColor.mockResolvedValue('#ff00ff')
    mockedUsePreference.mockReturnValue({
      pdpPreferences: {
        templateConfigs: { pdpv7: { atbCtaBackgroundColorAdaptive: true } },
      },
    } as any)

    renderWithProviders(<ProductActions />)
    const btn = await screen.findByTestId('pdp_addtocart_btn')

    await waitFor(() => {
      expect(window.getComputedStyle(btn).backgroundColor).toBe('rgb(255, 0, 255)')
    })
  })
})

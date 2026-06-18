import MiniCartPopoverItem from 'toro/components/header/MiniCart/MiniCartPopoverItem'
import miniCartProduct from 'test-utils/MiniCartPopoverItem2.mock'
import miniCartProductPromotion2 from 'test-utils/miniCartItemPromotion2.mock'
import { render, getNodeText } from 'test-utils/react'
import { mockIntersectionObserver } from 'test-utils/mock-utils'
import { price as formatPrice } from 'toro/helpers/price-format'
import { getRegularPriceToRender } from 'toro/components/header/MiniCart/helpers'
import usePreference from 'toro/hooks/usePreference_new'
import { useAtomValue as mockedUseAtomValue } from 'jotai/utils'
import { isOneCoachNAEnabledAtom, oneSiteActiveBrandAtom } from 'store/menu-data.atom'
import { wishlistIdsAtom } from 'store/wishlist.atom'

const defaultProps = {
  item: miniCartProduct,
  orderLevelPromos: [],
  promoRenderInfo: [],
  shouldPickPriceFromMaster: false,
  brand: 'coach',
  hasPromotion: false,
  sx: {
    my: 'm',
  },
  siteId: 'cc_us_rt',
  getFormattedPrice: (price) => formatPrice(price),
}

const renderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        getNewProductAPIData: true,
      },
    },
    ViewportContext: {},
    SessionContext: {},
    AnalyticsContext: {},
  },
}

const makeSut = (props = {}) => {
  return <MiniCartPopoverItem {...defaultProps} {...props} />
}

mockIntersectionObserver()

jest.mock('toro/components/badges/Badges', () => () => null)
jest.mock('next/router', () => {
  const push = jest.fn()
  return {
    useRouter: () => ({
      push,
    }),
  }
})

jest.mock('jotai/utils', () => {
  const original = jest.requireActual('jotai/utils')
  return { ...original, useAtomValue: jest.fn(original.useAtomValue) }
})

const mockOneCoachAtoms = (enabled = false) => {
  if (!enabled) {
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case isOneCoachNAEnabledAtom:
          return enabled
        case oneSiteActiveBrandAtom:
          return undefined
        case wishlistIdsAtom:
          return [miniCartProduct.master.ID] // make analytics payload match test expectation
        default:
          // Fallback to original behavior for atoms we don't override here
          return jest.requireActual('jotai/utils').useAtomValue(atom)
      }
    })
  }
}

jest.mock('toro/hooks/useNeutralSizingData', () => {
  return jest.fn().mockImplementation(() => ({
    isNeutralSizingEnabled: false,
    neutralSizingCountryTypes: ['EU', 'US'],
    selectedNeutralSizingCountry: 'EU',
  }))
})

jest.mock('toro/hooks/usePreference_new')
const mockUsePreference = jest.mocked(usePreference)

mockUsePreference.mockReturnValue({
  toggleSiteFeatures: { isNewMegaPDP: false },
  priceSitePreferences: { hideListPrice: false },
  generalConfiguration: { siteIdentifier: 'coach' },
  oneSite: { enableOneSite: false },
})

jest.mock('toro/components/HtmlContent', () => {
  return function MockHtmlContent({ children }) {
    return <div data-testid="mock-html-content">{children}</div>
  }
})

describe('MiniCartPopoverItem tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockOneCoachAtoms(false)
  })

  it('Should render image, title and price', () => {
    const { getByTestId } = render(makeSut(), renderOptions)
    const title = getByTestId('mb_txt_pdtname')
    expect(getNodeText(title)).toEqual('Raina Boot In Signature Jacquard')
    const image = getByTestId('mb_img_pdt')
    expect(image.src).toEqual(
      'https://images.coach.com/is/image/Coach/cc764_wal_a0?$desktopProductTile$'
    )
    const price = getByTestId('mb_txt_pdtprice')
    expect(getNodeText(price)).toEqual('$149')
  })
  it('Should send analytics and navigate to product on click', async () => {
    const { user, getByTestId, getContextValue } = render(makeSut(), renderOptions)
    const title = getByTestId('mb_txt_pdtname')
    await user.click(title)

    const { useRouter } = require('next/router')
    const { push } = useRouter()
    const analyticsSend = getContextValue('AnalyticsContext.send')

    expect(push).toBeCalledWith(
      '/products/raina-boot-in-signature-jacquard/CC764%20WAL%20%206%20%20%20B.html'
    )
    expect(analyticsSend).nthCalledWith(1, 'selectItem', {
      product: miniCartProduct,
      eventLocation: 'minicart',
      wishlist: [miniCartProduct.master.ID],
    })
    expect(analyticsSend).nthCalledWith(2, 'cartInteraction', {
      product: miniCartProduct,
      eventLocation: 'minicart',
      eventAction: 'view product',
    })
  })
  it('Should render product level promotions', () => {
    const { getByText } = render(
      makeSut({
        item: miniCartProductPromotion2,
      }),
      renderOptions
    )
    getByText('WK23-EXTRA20 CODE APPLIED')
  })
})

describe('MiniCartPopoverItem getRegularPriceToRender tests', () => {
  it('Should return regular price for non-outlet site when it differs from discounted', () => {
    const result = getRegularPriceToRender({
      regularPrice: 200,
      discountedPrice: 100,
      isOutlet: false,
    })
    expect(result).toBe(200)
  })
  it('Should not return regular price for non-outlet site when it"s the same as discounted', () => {
    const result = getRegularPriceToRender({
      regularPrice: 100,
      discountedPrice: 100,
      isOutlet: false,
    })
    expect(result).toBe(undefined)
  })
  it('Should not return regular price for outlet site when prices from basket are equal', () => {
    const result = getRegularPriceToRender({
      regularPriceFromBasket: 100,
      discountedPriceFromBasket: 100,
      isOutlet: true,
    })
    expect(result).toBe(undefined)
  })
  it('Should return regular price for outlet site from basket if it dieffers from discounted', () => {
    const result = getRegularPriceToRender({
      regularPriceFromBasket: 200,
      discountedPriceFromBasket: 100,
      isOutlet: true,
    })
    expect(result).toBe(200)
  })
})

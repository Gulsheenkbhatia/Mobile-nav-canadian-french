import { render } from 'test-utils/react'
import AlternateCta from './AlternateCta'
import {
  isNotifyMeAvailableProductAtom,
  alterCtaToShowAtom,
  AlterCtaToShow,
  orderingStatusAtom,
  persistSoldOutSettingAtom,
  isInStockTextAtom,
  isCustomizedProductAtom,
} from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import * as UseStyles from 'toro/hooks/useStyles'
import * as UseProductData from 'toro/hooks/useProductData'
import { ORDERING_STATUS } from 'toro/helpers/productVariations'

// Mock hooks and utils
jest.mock('jotai/utils', () => ({
  useAtomValue: jest.fn(),
  atomWithReset: jest.fn(),
  atomWithStorage: jest.fn(),
  atomFamily: jest.fn(),
  loadable: jest.fn(),
  selectAtom: jest.fn(),
  atomWithDefault: jest.fn(),
  createJSONStorage: jest.fn(),
}))

// Mock hooks
jest.mock('toro/hooks/useStyleConfig')
jest.mock('toro/hooks/usePreference_new', () => ({
  __esModule: true,
  default: () => ({
    pdpPreferences: {
      showBuyNowButton: false,
    },
  }),
}))

// Mock the child components
jest.mock('toro/components/product/desktop/AddToBagArea/NotifyMeButtonWrapper', () => ({
  __esModule: true,
  default: () => <div data-testid="notify-me-button">Notify Me Button</div>,
}))

jest.mock('toro/components/product/desktop/AddToBagArea/BuyNowButtonWrapper', () => ({
  __esModule: true,
  default: () => <div data-testid="buy-now-button">Buy Now Button</div>,
}))

jest.mock('toro/components/product/desktop/AddToBagArea/PaymentWidgetController', () => ({
  __esModule: true,
  default: () => <div data-testid="payment-widget">Payment Widget</div>,
}))

const mockUseAtomValue = useAtomValue as jest.Mock

describe('AlternateCta', () => {
  const defaultContexts = {
    PWAContext: {
      appData: {},
    },
  }
  const mockUseStyles = jest.fn()
  const mockUseProductData = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    // Setup spy on useStyles
    jest.spyOn(UseStyles, 'default').mockImplementation(mockUseStyles)
    // Setup spy on useProductData
    jest.spyOn(UseProductData, 'default').mockImplementation(mockUseProductData)
    mockUseStyles.mockReturnValue({
      alternateCtaWrapper: {},
    })
    mockUseProductData.mockReturnValue('true')
  })

  it('should not render anything when all conditions are false', () => {
    mockUseAtomValue.mockImplementation((atom) => {
      if (atom === isNotifyMeAvailableProductAtom) return false
      if (atom === alterCtaToShowAtom) return AlterCtaToShow.BUYNOW
      if (atom === orderingStatusAtom) return ORDERING_STATUS.addToBag
      if (atom === persistSoldOutSettingAtom) return false
      if (atom === isInStockTextAtom) return false
      if (atom === isCustomizedProductAtom) return false
    })

    const { container } = render(<AlternateCta />, {
      contexts: defaultContexts,
    })

    expect(container.querySelector('.alter-cta-wrapper')).toBeNull()
  })

  it('should render only NotifyMeButton when notify me is available and orderingStatus is soldOut', () => {
    mockUseAtomValue.mockImplementation((atom) => {
      if (atom === isNotifyMeAvailableProductAtom) return true
      if (atom === alterCtaToShowAtom) return AlterCtaToShow.BUYNOW
      if (atom === orderingStatusAtom) return ORDERING_STATUS.soldOut
      if (atom === persistSoldOutSettingAtom) return false
      if (atom === isInStockTextAtom) return false
      if (atom === isCustomizedProductAtom) return false
    })

    const { container } = render(<AlternateCta />, {
      contexts: defaultContexts,
    })

    expect(container.querySelector('.alter-cta-wrapper')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="notify-me-button"]')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="buy-now-button"]')).not.toBeInTheDocument()
    expect(container.querySelector('[data-testid="payment-widget"]')).not.toBeInTheDocument()
  })

  it('should render BuyNowButton when alterCtaToShow is not BUYNOW and all conditions are met', () => {
    mockUseProductData.mockReturnValue(false)
    mockUseAtomValue.mockImplementation((atom) => {
      if (atom === isNotifyMeAvailableProductAtom) return false
      if (atom === alterCtaToShowAtom) return AlterCtaToShow.EMPTY
      if (atom === orderingStatusAtom) return ORDERING_STATUS.addToBag
      if (atom === persistSoldOutSettingAtom) return false
      if (atom === isInStockTextAtom) return false
      if (atom === isCustomizedProductAtom) return false
    })

    const { container } = render(<AlternateCta />, {
      contexts: defaultContexts,
    })

    expect(container.querySelector('.alter-cta-wrapper')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="buy-now-button"]')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="notify-me-button"]')).not.toBeInTheDocument()
  })

  it('should render ApplePay button when conditions are met', () => {
    mockUseProductData.mockReturnValue(false)
    mockUseAtomValue.mockImplementation((atom) => {
      if (atom === isNotifyMeAvailableProductAtom) return false
      if (atom === alterCtaToShowAtom) return AlterCtaToShow.APPLEPAY
      if (atom === orderingStatusAtom) return ORDERING_STATUS.addToBag
      if (atom === persistSoldOutSettingAtom) return false
      if (atom === isInStockTextAtom) return false
      if (atom === isCustomizedProductAtom) return false
    })

    const { container } = render(<AlternateCta />, {
      contexts: defaultContexts,
    })

    expect(container.querySelector('.alter-cta-wrapper')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="payment-widget"]')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="notify-me-button"]')).not.toBeInTheDocument()
  })

  it('hides Buy Now and Payment when hideBuyNowAndApplePay is true', () => {
    mockUseProductData.mockReturnValue(false)
    mockUseAtomValue.mockImplementation((atom) => {
      if (atom === isNotifyMeAvailableProductAtom) return false
      if (atom === alterCtaToShowAtom) return AlterCtaToShow.EMPTY
      if (atom === orderingStatusAtom) return ORDERING_STATUS.addToBag
      if (atom === persistSoldOutSettingAtom) return false
      if (atom === isInStockTextAtom) return false
      if (atom === isCustomizedProductAtom) return false
    })

    const { container } = render(<AlternateCta hideBuyNowAndApplePay />, {
      contexts: defaultContexts,
    })

    expect(container.querySelector('.alter-cta-wrapper')).toBeNull()
    expect(container.querySelector('[data-testid="buy-now-button"]')).not.toBeInTheDocument()
    expect(container.querySelector('[data-testid="payment-widget"]')).not.toBeInTheDocument()
  })
})

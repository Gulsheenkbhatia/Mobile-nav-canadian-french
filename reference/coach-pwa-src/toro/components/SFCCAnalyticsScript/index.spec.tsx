import { render, CustomRenderOptions, waitFor } from 'test-utils/react'
import SFCCAnalyticsScript from 'toro/components/SFCCAnalyticsScript'
import { useAtomValue } from 'jotai/utils'
import {
  sendViewProduct,
  sendViewCategory,
  sendViewSearch,
  trackPage,
} from 'toro/analytics/sfccAnalyticsHelpers'
import usePageType from 'toro/hooks/usePageType'
import usePreference from 'toro/hooks/usePreference_new'
import { productsAtom, searchResultsUrlAtom } from 'store/search-results.atom'
import { ListingProduct } from 'toro/types/productTypes'

jest.mock('jotai/utils')
jest.mock('toro/analytics/sfccAnalyticsHelpers')
jest.mock('toro/hooks/usePageType')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/helpers/getCurrentLocale', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    locale: 'en-US',
    currency: 'USD',
  })),
}))
jest.mock('next/script', () => ({
  __esModule: true,
  default: ({ onLoad, ...props }) => {
    if (onLoad) onLoad()
    return <script {...props} />
  },
}))

const mockedUsePageType = jest.mocked(usePageType) as jest.MockedFn<typeof usePageType>
const getPageType = (overrides = {}) => ({
  isPDP: false,
  isPLP: false,
  isSRP: false,
  isHP: false,
  isRetailHP: false,
  isOutletHP: false,
  isSubHP: false,
  isContentPage: false,
  isProductPassport: false,
  ...overrides,
})
const mockedUseAtomValue = jest.mocked(useAtomValue)
const mockedSendViewProduct = jest.mocked(sendViewProduct)
const mockedSendViewCategory = jest.mocked(sendViewCategory)
const mockedSendViewSearch = jest.mocked(sendViewSearch)
const mockedTrackPage = jest.mocked(trackPage)
const mockedUsePreference = jest.mocked(usePreference)

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        siteId: 'coh_us_rt',
        locale: 'en-US',
        ocapiDomain: 'test.demandware.net',
      },
    },
  },
}

const makeSetup = (props: object = {}) =>
  render(<SFCCAnalyticsScript lazyProps={props} />, renderOptions)

describe('SFCCAnalyticsScript', () => {
  beforeEach(() => {
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === productsAtom) {
        return [
          { id: 'p1', productId: 'p1' },
          { id: 'p2', productId: 'p2' },
        ] as unknown as ListingProduct[]
      }
      if (atom === searchResultsUrlAtom) {
        return { url: '/search?q=shoes&colorVal=red' }
      }
      return null
    })
    mockedUsePreference.mockReturnValue({
      sfccAnalytics: { sfccAnalyticsScripts: ['analytics-script'] },
    })
    mockedUsePageType.mockReturnValue(getPageType({ isPDP: true }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders script tags and trigger track page analytics', async () => {
    const { container } = makeSetup({ pageData: { id: 'product1', category_id: 'cat1' } })

    await waitFor(() => {
      expect(container.querySelector('script')).toBeInTheDocument()
      expect(mockedTrackPage).toHaveBeenCalled()
    })
  })

  it('does call pdp analytics', async () => {
    mockedUseAtomValue.mockReturnValueOnce([])
    makeSetup({ pageData: { id: 'product1', category_id: 'cat1' } })

    await waitFor(() => {
      expect(mockedSendViewProduct).toHaveBeenCalled()
    })
  })

  it('does not call plp or srp analytics if product list data is missing', async () => {
    mockedUseAtomValue.mockReturnValueOnce([])
    makeSetup({ pageData: { id: 'product1', category_id: 'cat1' } })

    await waitFor(() => {
      expect(mockedSendViewCategory).not.toHaveBeenCalled()
      expect(mockedSendViewSearch).not.toHaveBeenCalled()
    })
  })

  it('handles PLP analytics properly', async () => {
    mockedUsePageType.mockReturnValue(getPageType({ isPLP: true }))
    makeSetup({ pageData: { id: 'cat1', category_id: 'cat1' } })

    await waitFor(() => {
      expect(mockedSendViewCategory).toHaveBeenCalled()
    })
  })

  it('handles SRP analytics properly', async () => {
    mockedUsePageType.mockReturnValue(getPageType({ isSRP: true }))
    makeSetup({ pageData: { id: 'search', category_id: '' } })

    await waitFor(() => {
      expect(mockedSendViewSearch).toHaveBeenCalled()
    })
  })

  it('does not break if pageData is lazy loaded', async () => {
    const lazy = Promise.resolve({ pageData: { id: 'lazy-id', category_id: 'catLazy' } })
    makeSetup({ lazy })

    await waitFor(() => {
      expect(mockedTrackPage).toHaveBeenCalled()
    })
  })

  it('renders nothing when sfccAnalyticsScripts is empty', async () => {
    mockedUsePreference.mockReturnValue({
      sfccAnalytics: { sfccAnalyticsScripts: [] },
    })

    const { container } = makeSetup()

    await waitFor(() => {
      expect(container.querySelector('script')).not.toBeInTheDocument()
    })
  })
})

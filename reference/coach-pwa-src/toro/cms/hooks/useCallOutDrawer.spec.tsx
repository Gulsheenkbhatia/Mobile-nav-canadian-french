import { renderHook } from 'test-utils/react'
import { Provider as JotaiProvider } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { productDataAtom, isQuickViewAtom } from 'store/pdp.atom'
import useAEDrawer from 'toro/hooks/useAEDrawer'
import isBrowser from 'toro/helpers/isBrowser'
import useCallOutDrawer from './useCallOutDrawer'
import mockData from './useCallOutDrawer.mock'

jest.mock('jotai/utils', () => {
  const originalModule = jest.requireActual('jotai/utils')
  return {
    ...originalModule,
    useAtomValue: jest.fn(),
  }
})
jest.mock('toro/hooks/useAEDrawer')
jest.mock('toro/helpers/isBrowser')

const mockedUseAtomValue = jest.mocked(useAtomValue)
const mockedUseAEDrawer = jest.mocked(useAEDrawer)
const mockedIsBrowser = jest.mocked(isBrowser)

const wrapper = ({ children }) => {
  return <JotaiProvider>{children}</JotaiProvider>
}

describe(__filename, () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return undefined when server-side', () => {
    mockedIsBrowser.mockImplementation(() => false)
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isQuickViewAtom) return false
      if (atom === productDataAtom) return 'mockData'
      return false
    })
    mockedUseAEDrawer.mockImplementation(() => () => true)
    let aeDrawerOnClicks
    renderHook(
      () => {
        aeDrawerOnClicks = useCallOutDrawer([mockData.promoCallOutWithDrawerScheme])
      },
      { wrapper }
    )
    expect(aeDrawerOnClicks[0]).toEqual(undefined)
  })

  it('should return a function that does not override onClick when client-side and the useAEDrawer function is null', () => {
    const mockSpy = jest.fn()
    mockedIsBrowser.mockImplementation(() => true)
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isQuickViewAtom) return false
      if (atom === productDataAtom) return 'mockData'
      return false
    })
    mockedUseAEDrawer.mockImplementation(() => undefined)
    let aeDrawerOnClicks
    renderHook(
      () => {
        aeDrawerOnClicks = useCallOutDrawer([mockData.promoCallOutWithDrawerScheme])
      },
      { wrapper }
    )
    aeDrawerOnClicks[0]({ preventDefault: mockSpy })
    expect(mockSpy).not.toHaveBeenCalled()
  })

  it('should return the useAEDrawer function that gets called with a recommenders array when client-side and the HTML has a valid drawer scheme attribute', () => {
    const mockSpy = jest.fn()
    mockedIsBrowser.mockImplementation(() => true)
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isQuickViewAtom) return false
      if (atom === productDataAtom) return 'mockData'
      return false
    })
    mockedUseAEDrawer.mockImplementation(() => mockSpy)
    let aeDrawerOnClicks
    renderHook(
      () => {
        aeDrawerOnClicks = useCallOutDrawer([mockData.promoCallOutWithDrawerScheme])
      },
      { wrapper }
    )
    aeDrawerOnClicks[0]()
    expect(mockSpy).toHaveBeenCalledWith({
      showDrawer: true,
      activeProduct: 'mockData',
      recommenders: ['product1_rr'],
      eventLocation: 'promotions',
    })
  })

  it('should return a function that does not override onClick when client-side and the HTML does not have a drawer scheme attribute', () => {
    const mockSpy = jest.fn()
    mockedIsBrowser.mockImplementation(() => true)
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isQuickViewAtom) return false
      if (atom === productDataAtom) return 'mockData'
      return false
    })
    mockedUseAEDrawer.mockImplementation(() => mockSpy)
    let aeDrawerOnClicks
    renderHook(
      () => {
        aeDrawerOnClicks = useCallOutDrawer([mockData.promoCallOutWithoutDrawerScheme])
      },
      { wrapper }
    )
    aeDrawerOnClicks[0]()
    expect(mockSpy).not.toHaveBeenCalled()
  })

  it('should return the useAEDrawer function that gets called with an empty recommenders array when client-side and the HTML has a drawer scheme attribute with an empty recommender', () => {
    const mockSpy = jest.fn()
    mockedIsBrowser.mockImplementation(() => true)
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isQuickViewAtom) return false
      if (atom === productDataAtom) return 'mockData'
      return false
    })
    mockedUseAEDrawer.mockImplementation(() => mockSpy)
    let aeDrawerOnClicks
    renderHook(
      () => {
        aeDrawerOnClicks = useCallOutDrawer([mockData.promoCallOutWithEmptyDrawerScheme])
      },
      { wrapper }
    )
    aeDrawerOnClicks[0]({ preventDefault: () => undefined })
    expect(mockSpy).toHaveBeenCalledWith({
      showDrawer: true,
      activeProduct: 'mockData',
      recommenders: [],
      eventLocation: 'promotions',
    })
  })

  it('should return the useAEDrawer function that gets called with an empty recommenders array when client-side, the HTML has a drawer scheme attribute, but is in quick view', () => {
    const mockSpy = jest.fn()
    mockedIsBrowser.mockImplementation(() => true)
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isQuickViewAtom) return true
      if (atom === productDataAtom) return 'mockData'
      return false
    })
    mockedUseAEDrawer.mockImplementation(() => mockSpy)
    let aeDrawerOnClicks
    renderHook(
      () => {
        aeDrawerOnClicks = useCallOutDrawer([mockData.promoCallOutWithDrawerScheme])
      },
      { wrapper }
    )
    aeDrawerOnClicks[0]({ preventDefault: () => undefined })
    expect(mockSpy).toHaveBeenCalledWith({
      showDrawer: true,
      activeProduct: 'mockData',
      recommenders: [],
      eventLocation: 'promotions',
    })
  })
})

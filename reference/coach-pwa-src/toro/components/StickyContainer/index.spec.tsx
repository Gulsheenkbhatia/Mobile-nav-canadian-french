import React from 'react'
import { render, CustomRenderOptions, act } from 'test-utils/react'
import StickyContainer from 'toro/components/StickyContainer/index'
import { useAtomValue } from 'jotai/utils'
import useViewportType from 'toro/hooks/useViewportType'
import useOutsideClick from 'toro/hooks/useOutsideClick'
import { isSizeGuidePopUpOpenAtom } from 'store/pdp.atom'
import { mockIntersectionObserver } from 'test-utils/mock-utils'

mockIntersectionObserver()

let footerCallback, bundleCallback
jest.mock('react-intersection-observer', () => ({
  observe: jest.fn((element, callback) => {
    if (element.classList.contains('footerContainer')) {
      footerCallback = callback
    } else if (element.classList.contains('bundleProductBtn')) {
      bundleCallback = callback
    }
    return jest.fn()
  }),
  useInView: jest.fn(() => ({ ref: jest.fn() })),
}))

const addEventListenerMock = jest.fn()
const removeEventListenerMock = jest.fn()
window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: query === '(orientation: portrait)',
  media: query,
  onchange: null,
  addEventListener: (handler) => {
    addEventListenerMock(handler)
  },
  removeEventListener: (handler) => {
    removeEventListenerMock(handler)
  },
}))

jest.mock('jotai/utils')
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/hooks/useOutsideClick', () => jest.fn())
const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        locale: 'en-US',
      },
    },
  },
}

const setFlyOutOpenMock = jest.fn()

const defaultProps = {
  children: <div>Add To Bag</div>,
  isFlyoutOpen: false,
  setFlyoutOpen: setFlyOutOpenMock,
  isBundleProduct: true,
  isStickyAddToCartBelowTheFoldEnabled: true,
  isStickyAddToBagUponLandEnabled: true,
  stickyAddToCartPriceEnabled: false,
  variant: 'default',
  isPlp: false,
}

const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>
const mockedUseOutsideClick = useOutsideClick as jest.MockedFn<typeof useOutsideClick>

const makeSetup = (props: any = {}) => {
  const combinedProps = { ...defaultProps, ...props }
  return render(<StickyContainer {...combinedProps} />, renderOptions)
}

describe('StickyContainer', () => {
  beforeEach(() => {
    const footerEl = document.createElement('div')
    footerEl.className = 'footerContainer'
    document.body.appendChild(footerEl)

    const bundleEl = document.createElement('button')
    bundleEl.className = 'bundleProductBtn'
    document.body.appendChild(bundleEl)

    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case isSizeGuidePopUpOpenAtom:
          return false
        default:
          return null
      }
    })
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: false, isMobile: true }))
  })

  afterEach(() => {
    jest.clearAllMocks()
    document.body.innerHTML = ''
  })

  it('renders the StickyContainer component', () => {
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: false, Mobile: true }))
    const { getByTestId } = makeSetup()
    expect(getByTestId('pdp_sticky-container')).toBeVisible()
  })

  it('should call setFlyOutOpen as false when clicked outside the component', () => {
    const mockEvent = new Event('click')
    Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn(), writable: true })
    makeSetup({ isFlyoutOpen: true })
    mockedUseOutsideClick.mock.calls[0][0].handler(mockEvent)
    expect(setFlyOutOpenMock).toHaveBeenCalledWith(false)
  })

  it('Should toggle body classes for chat and back-to-top buttons based on sticky CTA visibility', () => {
    const helpButtonEl = document.createElement('div')
    helpButtonEl.className = 'helpButtonEnabled'
    const helpInnerEl = document.createElement('div')
    helpInnerEl.className = 'helpButton'
    helpInnerEl.appendChild(helpButtonEl)
    const embeddedServiceEl = document.createElement('div')
    embeddedServiceEl.className = 'embeddedServiceHelpButton'
    embeddedServiceEl.appendChild(helpInnerEl)
    document.body.appendChild(embeddedServiceEl)

    const backToTopEl = document.createElement('div')
    backToTopEl.id = 'backToTopBtn'
    document.body.appendChild(backToTopEl)

    makeSetup()

    act(() => {
      if (bundleCallback) {
        bundleCallback(false, { boundingClientRect: { top: 100 } })
      }
    })
    expect(document.body.classList.contains('chat-stickyVisible')).toBe(true)
    expect(document.body.classList.contains('backtotop-stickyVisible')).toBe(true)

    act(() => {
      if (bundleCallback) {
        bundleCallback(true, { boundingClientRect: { top: 150 } })
      }
    })
    expect(document.body.classList.contains('chat-stickyVisible')).toBe(false)
    expect(document.body.classList.contains('backtotop-stickyVisible')).toBe(false)
  })

  it('should hide sticky CTA when footer is visible', () => {
    const { getByTestId } = makeSetup({ isBundleProduct: false })
    Object.defineProperty(window, 'scrollY', { value: 150 })
    act(() => {
      if (footerCallback) {
        footerCallback(true, { boundingClientRect: { top: 100 } })
      }
    })
    expect(getByTestId('m_pdp_section_variant_drawer')).toHaveStyle('display: none')
  })

  it('sticky cta should be hidden when pdp has almost no content between product information and footer', () => {
    const { getByTestId } = makeSetup()
    Object.defineProperty(window, 'scrollY', { value: 50 })
    act(() => {
      if (footerCallback) {
        footerCallback(true, { boundingClientRect: { top: 100 } })
      }
    })
    act(() => {
      if (bundleCallback) {
        bundleCallback(true, { boundingClientRect: { top: 100 } })
      }
    })
    expect(getByTestId('m_pdp_section_variant_drawer')).toHaveStyle('display: none')
  })

  it('sticky container should be hidden when bundle product button is in view', () => {
    const { getByTestId } = makeSetup()
    Object.defineProperty(window, 'scrollY', { value: 50 })
    act(() => {
      if (bundleCallback) {
        bundleCallback(true, { boundingClientRect: { top: 100 } })
      }
    })
    expect(getByTestId('m_pdp_section_variant_drawer')).toHaveStyle('display: none')
  })

  it('sticky container should be hidden when StickyAddToCartBelowTheFold is enabled and Sticky Add to Bag upon land is disabled', () => {
    const { getByTestId } = makeSetup({
      isStickyAddToCartBelowTheFoldEnabled: true,
      isStickyAddToBagUponLandEnabled: false,
    })
    Object.defineProperty(window, 'scrollY', { value: 50 })
    act(() => {
      if (bundleCallback) {
        bundleCallback(true, { boundingClientRect: { top: 100 } })
      }
    })
    expect(getByTestId('m_pdp_section_variant_drawer')).toHaveStyle('display: none')
  })

  it('should hide sticky container when ATC Container is visible and footer is not visible', () => {
    const { getByTestId } = makeSetup()
    Object.defineProperty(window, 'scrollY', { value: 150 })
    act(() => {
      if (bundleCallback) {
        bundleCallback(true, { boundingClientRect: { top: 100 } })
      }
    })
    act(() => {
      if (footerCallback) {
        footerCallback(false, { boundingClientRect: { top: 100 } })
      }
    })
    expect(getByTestId('m_pdp_section_variant_drawer')).toHaveStyle('display: none')
  })
})

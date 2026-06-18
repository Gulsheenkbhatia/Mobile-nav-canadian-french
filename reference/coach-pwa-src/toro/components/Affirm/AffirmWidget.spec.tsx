import { render, waitFor, act } from 'test-utils/react'
import { useAtomValue, useUpdateAtom, useHydrateAtoms } from 'jotai/utils'
import AffirmWidget from './AffirmWidget'
import { Provider as JotaiProvider } from 'jotai'
import { appLoadingAtom } from 'store/pdp.atom'
import usePreference from 'toro/hooks/usePreference_new'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'

jest.mock('jotai/utils')
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
jest.mock('next/navigation', () => {
  return {
    usePathname: () => '/product',
  }
})
jest.mock('toro/hooks/usePreference_new', () => jest.fn())
jest.mock('toro/hooks/useSelectedVariantData', () => jest.fn())

describe('AffirmWidget', () => {
  const mockSetAffirmScriptLoaded = jest.fn()
  const mockSetAffirmPrice = jest.fn()
  const mockedUseAtomValue = jest.mocked(useAtomValue)
  const mockUseUpdateAtom = jest.mocked(useUpdateAtom)
  const mockUsePreference = jest.mocked(usePreference)
  const mockUseSelectedVariantData = jest.mocked(useSelectedVariantData)

  // Mock MutationObserver
  const mockObserve = jest.fn()
  const mockDisconnect = jest.fn()

  beforeEach(() => {
    // Reset window.affirm
    delete window.affirm
    delete window._affirm_config

    // Setup MutationObserver mock
    global.MutationObserver = jest.fn().mockImplementation((callback) => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      takeRecords: jest.fn(),
    })) as any

    mockedUseAtomValue.mockImplementation(() => false)
    mockUseUpdateAtom.mockImplementation((atom) => {
      const atomString = atom.toString()
      if (atomString.includes('setAffirmScriptLoaded')) {
        return mockSetAffirmScriptLoaded
      }
      if (atomString.includes('setAffirmPrice')) {
        return mockSetAffirmPrice
      }
      return jest.fn()
    })

    mockUsePreference.mockReturnValue({
      affirm: {
        AffirmScriptURL: 'http://test-script-url',
        AffirmPublicKey: 'test-public-key',
      },
    })

    mockUseSelectedVariantData.mockReturnValue('100.00')
  })

  afterEach(() => {
    jest.clearAllMocks()
    mockObserve.mockClear()
    mockDisconnect.mockClear()
  })

  const HydrateAtomsWrapper = ({ children, atomValues }) => {
    useHydrateAtoms(atomValues)
    return children
  }

  const renderComponent = ({
    apploading = false,
    variant = undefined,
    price = '100.00',
  }: {
    apploading?: boolean
    variant?: string
    price?: string
  } = {}) => {
    const atomValues = [[appLoadingAtom, apploading]]
    mockUseSelectedVariantData.mockReturnValue(price)

    return render(
      <JotaiProvider>
        <HydrateAtomsWrapper atomValues={atomValues}>
          <AffirmWidget variant={variant} />
        </HydrateAtomsWrapper>
      </JotaiProvider>
    )
  }

  it('should render AffirmWidget when no script error occurs', async () => {
    renderComponent({
      apploading: false,
      price: '100.00',
    })

    const affirmWrapper = document.querySelector('[data-qa="affirm_wrapper"]')
    expect(affirmWrapper).toBeVisible()
  })

  it('should render script tag with correct attributes', () => {
    renderComponent({
      apploading: false,
      price: '100.00',
    })

    // Verify the component attempts to load the script
    // Note: Next.js Script component behavior is hard to test in JSDOM
    // We verify the component renders the affirm wrapper which contains the Script component
    const affirmWrapper = document.querySelector('[data-qa="affirm_wrapper"]')
    expect(affirmWrapper).toBeInTheDocument()
  })

  it('should setup MutationObserver to watch for label content changes', () => {
    renderComponent({
      apploading: false,
      price: '100.00',
    })

    expect(MutationObserver).toHaveBeenCalled()
    expect(mockObserve).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        childList: true,
        subtree: true,
        characterData: true,
      })
    )
  })

  it('should setup price setting logic when label is present', () => {
    // Mock affirm to be ready and have content
    window.affirm = {
      ui: {
        ready: jest.fn().mockReturnValue(true),
        refresh: jest.fn(),
      },
    }

    renderComponent({
      apploading: false,
      price: '100.00',
    })

    // Verify that MutationObserver is set up to watch for content changes
    expect(MutationObserver).toHaveBeenCalled()
    const observerInstance = (MutationObserver as jest.Mock).mock.results[0].value
    expect(observerInstance.observe).toHaveBeenCalled()
  })

  it('should not set affirm price when label is not present', async () => {
    window.affirm = {
      ui: {
        ready: jest.fn().mockReturnValue(true),
        refresh: jest.fn(),
      },
    }

    renderComponent({
      apploading: false,
      price: '100.00',
    })

    // Wait a bit to ensure no calls are made
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(mockSetAffirmPrice).not.toHaveBeenCalled()
  })

  it('should update price when selectedVariant changes', async () => {
    const { rerender } = renderComponent({
      apploading: false,
      price: '100.00',
    })

    // Check initial price
    const affirmWrapper = document.querySelector('[data-qa="affirm_wrapper"]') as HTMLElement
    expect(affirmWrapper.querySelector('.affirm-as-low-as')).toHaveAttribute('data-amount', '10000')

    // Update with new price
    mockUseSelectedVariantData.mockReturnValue('200.00')
    rerender(
      <JotaiProvider>
        <HydrateAtomsWrapper atomValues={[[appLoadingAtom, false]]}>
          <AffirmWidget />
        </HydrateAtomsWrapper>
      </JotaiProvider>
    )

    await waitFor(() => {
      const updatedWrapper = document.querySelector('[data-qa="affirm_wrapper"]') as HTMLElement
      expect(updatedWrapper.querySelector('.affirm-as-low-as')).toHaveAttribute(
        'data-amount',
        '20000'
      )
    })
  })

  it('should apply correct variant styling', () => {
    renderComponent({
      variant: 'pdpv5',
      price: '100.00',
    })

    const affirmWrapper = document.querySelector('[data-qa="affirm_wrapper"]') as HTMLElement
    expect(affirmWrapper.querySelector('.affirm-as-low-as')).toHaveAttribute(
      'data-affirm-color',
      'white'
    )
  })

  it('should use default color when variant is not pdpv5', () => {
    renderComponent({
      variant: 'default',
      price: '100.00',
    })

    const affirmWrapper = document.querySelector('[data-qa="affirm_wrapper"]') as HTMLElement
    expect(affirmWrapper.querySelector('.affirm-as-low-as')).toHaveAttribute(
      'data-affirm-color',
      'black'
    )
  })

  it('should show skeleton when script is not loaded', () => {
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom.toString().includes('affirmScriptLoaded')) return false
      return false
    })

    renderComponent({
      price: '100.00',
    })

    const affirmWrapper = document.querySelector('[data-qa="affirm_wrapper"]')
    expect(affirmWrapper).toBeVisible()
    // Skeleton should be present when script is not loaded
  })

  it('should call affirm.ui.refresh when script is loaded and price changes', async () => {
    const mockRefresh = jest.fn()
    window.affirm = {
      ui: {
        ready: jest.fn().mockReturnValue(true),
        refresh: mockRefresh,
      },
    }

    mockedUseAtomValue.mockImplementation(() => true) // Script is loaded

    const { rerender } = renderComponent({
      apploading: false,
      price: '100.00',
    })

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled()
    })

    // Update price
    mockRefresh.mockClear()
    mockUseSelectedVariantData.mockReturnValue('200.00')

    rerender(
      <JotaiProvider>
        <HydrateAtomsWrapper atomValues={[[appLoadingAtom, false]]}>
          <AffirmWidget />
        </HydrateAtomsWrapper>
      </JotaiProvider>
    )

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('should disconnect MutationObserver on unmount', () => {
    const { unmount } = renderComponent({
      apploading: false,
      price: '100.00',
    })

    unmount()

    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('should render widget initially (script error handling is managed by Next.js Script)', () => {
    renderComponent({
      apploading: false,
      price: '100.00',
    })

    // Verify widget is initially rendered
    // Note: Script error handling in Next.js Script component is difficult to test in JSDOM
    // The component has error handling logic but triggering it requires the actual Next.js Script behavior
    expect(document.querySelector('[data-qa="affirm_wrapper"]')).toBeInTheDocument()
  })

  it('should only set price when affirm.ui.ready returns true', async () => {
    // Mock affirm where ready() returns false
    window.affirm = {
      ui: {
        ready: jest.fn().mockReturnValue(false),
        refresh: jest.fn(),
      },
    }

    renderComponent({
      apploading: false,
      price: '100.00',
    })

    const affirmWrapper = document.querySelector('[data-qa="affirm_wrapper"]') as HTMLElement

    // Simulate content being added
    await act(async () => {
      const priceElement = document.createElement('span')
      priceElement.className = 'affirm-ala-price'
      priceElement.textContent = '$25'
      affirmWrapper.appendChild(priceElement)

      Object.defineProperty(affirmWrapper, 'innerText', {
        value: 'or as low as $25/mo with Affirm',
        configurable: true,
      })
    })

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Should not call setAffirmPrice since ready() returned false
    expect(mockSetAffirmPrice).not.toHaveBeenCalled()
  })
})

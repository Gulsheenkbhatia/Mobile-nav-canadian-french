import SimilarOptionJumplink from '.'
import { Provider as JotaiProvider } from 'jotai'
import { useHydrateAtoms, useAtomValue, useUpdateAtom } from 'jotai/utils'
import { productDataAtom } from 'store/pdp.atom'
import useAnalytics from 'toro/analytics/useAnalytics'
import { render, screen } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import useAEDrawer from 'toro/hooks/useAEDrawer'
import { useScrollToWithDomModifications } from 'toro/hooks/useScrollToWithDomModifications'
import useExperiment from 'toro/hooks/useExperiment'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils'

jest.mock('toro/hooks/useExperiment')
jest.mocked(useExperiment).mockImplementation(() => false)

jest.mock('toro/hooks/usePreference_new')
jest.mocked(usePreferenceNew).mockImplementation(() => ({
  generalConfiguration: {
    enableNewGlobalHeader: false,
  },
}))

jest.mock('toro/hooks/useTemplate', () => jest.fn(() => false))
jest.mock('toro/hooks/useHeaderHeight', () => jest.fn(() => 0))
jest.mock('toro/helpers/isKS', () => jest.fn(() => false))
jest.mock('jotai', () => ({
  useAtomValue: jest.fn(),
  Provider: jest.fn(({ children }) => children),
  atom: jest.fn(() => ({})),
}))

jest.mock('jotai/utils', () => ({
  useAtomValue: jest.fn(),
  useUpdateAtom: jest.fn(),
  useHydrateAtoms: jest.fn(),
  atomWithReset: jest.fn(),
  atomWithDefault: jest.fn(),
  atomWithStorage: jest.fn(),
  loadable: jest.fn(),
  selectAtom: jest.fn(),
  atomFamily: jest.fn(),
  createJSONStorage: jest.fn(),
}))

jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: false }))
jest.mock('toro/analytics/useAnalytics', () => jest.fn())
jest.mock('toro/hooks/useAEDrawer', () => jest.fn())
jest.mock('toro/hooks/useScrollToWithDomModifications', () => ({
  useScrollToWithDomModifications: jest.fn(),
}))

const mockSendAnalytics = jest.fn()
const mockSetAEDrawerConfig = jest.fn()
const mockProductData = {}

const HydrateAtomsWrapper = ({ children, atomValues }) => {
  useHydrateAtoms(atomValues)
  return children
}

useAnalytics.mockReturnValue({ send: mockSendAnalytics })
useUpdateAtom.mockImplementation(() => jest.fn())
useScrollToWithDomModifications.mockReturnValue({
  scrollTo: jest.fn(),
  clearTimer: jest.fn(),
})

describe('SimilarOptionJumplink', () => {
  const setup = (props = {}) => {
    const user = userEvent.setup()
    return {
      user,
      ...render(
        <JotaiProvider>
          <HydrateAtomsWrapper atomValues={[[productDataAtom, mockProductData]]}>
            <SimilarOptionJumplink {...props} />
          </HydrateAtomsWrapper>
        </JotaiProvider>,
        {
          contexts: {
            PWAContext: { appData: {} },
          },
        }
      ),
    }
  }

  beforeEach(() => {
    useAEDrawer.mockReturnValue(mockSetAEDrawerConfig)
    useAtomValue.mockImplementation((atom) => {
      if (atom === productDataAtom) return mockProductData
      return false
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders correctly', () => {
    setup()
    expect(screen.getByText('Looking for something similar?')).toBeVisible()
    expect(screen.getByText('SEE SIMILAR PRODUCTS')).toBeVisible()
  })

  test('sends analytics event on render', () => {
    setup()
    mockAllIsIntersecting(true)
    expect(mockSendAnalytics).toHaveBeenCalledWith('productInteraction', {
      eventAction: 'view similar products CTA impression',
      eventLocation: 'product image',
      eventLabel: undefined,
    })
  })

  test('handles button click', async () => {
    const { user } = setup()
    const button = screen.getByText('SEE SIMILAR PRODUCTS')
    await user.click(button)
    expect(mockSendAnalytics).toHaveBeenCalledWith('productInteraction', {
      eventAction: 'view similar products CTA click',
      eventLocation: 'product image',
      eventLabel: undefined,
    })
  })

  test('click is handled when isTabbedAdaptivePDP is true', async () => {
    useAtomValue.mockImplementation(() => true)

    const { user } = setup()
    const button = screen.getByText('View more like this')
    await user.click(button)
    expect(mockSendAnalytics).toHaveBeenCalledWith('productInteraction', {
      eventAction: 'view similar products CTA click',
      eventLocation: 'product image',
      eventLabel: undefined,
    })
  })

  test('scrolls to recommendations section if setAEDrawerConfig is not set', async () => {
    useAEDrawer.mockReturnValue(undefined)
    const { scrollTo } = useScrollToWithDomModifications()

    const { user } = setup()
    const button = screen.getByText('SEE SIMILAR PRODUCTS')
    await user.click(button)
    expect(scrollTo).toHaveBeenCalled()
  })

  test('sets AEDrawer config if setAEDrawerConfig is set', async () => {
    const { user } = setup()
    const button = screen.getByText('SEE SIMILAR PRODUCTS')
    await user.click(button)
    expect(mockSetAEDrawerConfig).toHaveBeenCalledWith({
      showDrawer: true,
      activeProduct: mockProductData,
      eventLocation: 'alt image carousel',
    })
  })

  test('clears timer on unmount', () => {
    const { clearTimer } = useScrollToWithDomModifications()
    const { unmount } = setup()
    unmount()
    expect(clearTimer).toHaveBeenCalled()
  })
})

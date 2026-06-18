import { render, waitFor, act } from 'test-utils/react'
import CallOutMessageWrapper from 'toro/components/product/CallOutMessage/CallOutMessagePDP'
import useCallOutDrawer from 'toro/cms/hooks/useCallOutDrawer'
import { useAtomValue } from 'jotai/utils'
import * as useAEDrawerModule from 'toro/hooks/useAEDrawer'

jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: false }))
jest.mock('toro/hooks/useMultiStyleConfig', () => () => ({
  calloutMessageWrapper: {},
  pdpCalloutmessage: () => ({}),
}))
jest.mock('toro/components/ProductPromoSlot', () => ({ content, ...props }) => (
  <div
    data-qa="cm_txt_pdt_pomocallout_msg"
    dangerouslySetInnerHTML={{ __html: content }}
    {...props}
  />
))
jest.mock('toro/hooks/useAEDrawer', () => () => jest.fn())
jest.mock('toro/cms/hooks/useCallOutDrawer')

jest.mock('next/navigation', () => ({
  usePathname: () => '/product',
}))

const mockPathURL = 'mock-url'

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: `/${mockPathURL}`,
  }),
}))

jest.mock('next/script', () => jest.fn(() => null))

jest.mock('jotai/utils', () => ({
  useAtomValue: jest.fn(),
  atomWithReset: jest.fn(),
  atomWithDefault: jest.fn(),
  atomWithStorage: jest.fn(),
  loadable: jest.fn(),
  selectAtom: jest.fn(),
  atomFamily: jest.fn(),
  createJSONStorage: jest.fn(() => jest.fn()),
}))

jest.mock('store/pdp.atom', () => ({
  productDataAtom: {},
  isQuickViewAtom: {},
}))

const mockUseCallOutDrawer = useCallOutDrawer as jest.Mock
const mockUseAtomValue = useAtomValue as jest.Mock

// Setup function to initialize the rendering
const makeSetup = async (props = {}, contextOverrides = {}) => {
  const defaultProps = {
    promoText: [],
    masterId: 'test-id',
    ...props,
  }

  const defaultContexts = {
    PWAContext: { appData: {}, injectJquery: jest.fn() },
    AnalyticsContext: {},

    ...contextOverrides,
  }

  return await act(() =>
    render(<CallOutMessageWrapper {...defaultProps} />, { contexts: defaultContexts })
  )
}
describe('CallOutMessage', () => {
  beforeEach(() => {
    mockUseCallOutDrawer.mockReturnValue([jest.fn()])
    mockUseAtomValue.mockReturnValue(false)
  })

  it('should render nothing if promoText is not provided', async () => {
    const { queryByTestId } = await makeSetup()

    const wrapper = queryByTestId('cm_body_pdt_pomocallout')
    await waitFor(() => {
      expect(wrapper).toBeNull()
    }) // Check that the wrapper element is not rendered
  })

  it('should render the correct promo content when promoText is provided', async () => {
    // Mock the useAEDrawer hook
    jest.spyOn(useAEDrawerModule, 'default').mockReturnValue(() => false)

    const promoText = [
      {
        'call-out-message': {
          content: {
            scriptContent: 'script-content',
            mainHtml: 'main-html',
            spanText: 'span-text',
            isPromoModal: true,
            shouldInjectJquery: true,
          },
        },
      },
    ]

    const { getByText } = await makeSetup({ promoText })

    // Test for the rendered promo content
    await waitFor(() => {
      expect(getByText('main-html')).toBeVisible()
    })
  })
})

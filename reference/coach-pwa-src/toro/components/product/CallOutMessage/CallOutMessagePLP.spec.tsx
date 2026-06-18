import { render } from 'test-utils/react'
import CallOutMessageWrapper from 'toro/components/product/CallOutMessage/CallOutMessagePLP'
import useViewportType from 'toro/hooks/useViewportType'
import { useAtomValue } from 'jotai/utils'
import { PromoCallout } from './types'

jest.mock('toro/hooks/useViewportType')
jest.mock('jotai/utils')

jest.mock('next/router', () => {
  return {
    useRouter: () => ({
      asPath: ``,
    }),
  }
})

const renderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
    SessionContext: {
      session: {},
    },
  },
}

const promoTextMock: PromoCallout[] = [
  {
    'call-out-message': {
      content: {
        text: 'Promo 1',
        spanText: 'Promo 1',
        promoStyle: '',
        scriptContent: '',
        mainHtml: '',
        isPromoModal: false,
        shouldInjectJquery: false,
        styles: '',
      },
      config: { device: 'Mobile' },
      id: 'promo-1',
    },
  },
  {
    'call-out-message': {
      content: {
        text: 'Promo 2',
        spanText: 'Promo 2',
        promoStyle: '',
        scriptContent: '',
        mainHtml: '',
        isPromoModal: false,
        shouldInjectJquery: false,
        styles: '',
      },
      config: { device: 'Mobile' },
      id: 'promo-2',
    },
  },
]

const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>

describe('CallOutMessageWrapper Component', () => {
  it('should render null if promoText is not provided or empty', () => {
    const { queryByTestId } = render(<CallOutMessageWrapper promoText={[]} />, renderOptions)
    expect(queryByTestId('cm_body_pdt_pomocallout')).toBeNull()
  })

  it('should render the CallOutMessage if promoText is provided', () => {
    mockedUseViewportType.mockReturnValue({ isMobile: false })
    mockedUseAtomValue.mockReturnValue(false)

    const { getByText } = render(<CallOutMessageWrapper promoText={promoTextMock} />, renderOptions)

    const Promo1 = getByText('Promo 1')
    expect(Promo1).toBeVisible()

    const Promo2 = getByText('Promo 2')
    expect(Promo2).toBeVisible()
  })

  it('should render full width and height when isMobile is true', () => {
    mockedUseViewportType.mockReturnValue({ isMobile: true })
    mockedUseAtomValue.mockReturnValue(true)

    const { container } = render(<CallOutMessageWrapper promoText={promoTextMock} />, renderOptions)

    expect(container.firstChild).toHaveStyle({
      width: '100%',
      height: '100%',
    })
  })
})

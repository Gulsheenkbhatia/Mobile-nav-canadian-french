import { render, waitFor, CustomRenderOptions } from 'test-utils/react'
import PromoProgressBar from 'toro/components/header/MiniCart/PromoProgressBar'
import useViewportType from 'toro/hooks/useViewportType'
import miniCartProduct from 'test-utils/MiniCartPopoverItem2.mock'

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ html: '<div>Progress Bar</div>', progress: '50%' }),
  })
) as jest.Mock

jest.mock('toro/hooks/useViewportType')
const mockedUseViewportType = jest.mocked(useViewportType)
mockedUseViewportType.mockImplementation(() => ({ isDesktop: true, isMobile: false }))

jest.mock('toro/helpers/getUsidHeader', () => ({
  __esModule: true,
  default: jest.fn(() => ({ 'X-sid': 'test-usid' })),
}))

const mockFN = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockFN,
  }),
}))

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        siteId: 'coh_us_out',
        brand: 'coach-outlet',
        paypalDisabledOnMinicart: false,
      },
      injectScriptOnce: jest.fn(),
    },
  },
}

const makeSetup = async (options: CustomRenderOptions) => {
  const utils = render(<PromoProgressBar productsInCart={[miniCartProduct]} />, options)
  return utils
}

describe('PromoProgressBar', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('fetches and displays the promo progress bar content', async () => {
    const { queryByText } = await makeSetup(renderOptions)
    expect(global.fetch).toHaveBeenCalledWith('/api/get-promo-progress-bar', {
      headers: { 'X-sid': 'test-usid' },
    })

    await waitFor(() => {
      expect(queryByText('Progress Bar')).toBeVisible()
    })
  })

  it('does not render content if no progress is returned', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve<any>({
        json: () => Promise.resolve({ html: null, progress: null }),
      })
    )
    const { queryByText } = await makeSetup(renderOptions)
    await waitFor(() => {
      expect(queryByText('Progress Bar')).not.toBeInTheDocument()
    })
  })

  it('handles fetch errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    global.fetch = jest.fn(() => Promise.reject<any>(new Error('Fetch error')))
    await makeSetup(renderOptions)

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error))
    })

    consoleErrorSpy.mockRestore()
  })
})

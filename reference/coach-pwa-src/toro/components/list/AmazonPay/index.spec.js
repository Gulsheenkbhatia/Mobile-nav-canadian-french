import { render, waitFor, fireEvent, act } from 'test-utils/react'
import AmazonPayButton from 'toro/components/list/AmazonPay/index'
import usePreference from 'toro/hooks/usePreference_new'

jest.mock('toro/hooks/usePreference_new', () => ({
  __esModule: true,
  default: jest.fn(),
}))
const mockedInjectScriptOnce = jest.fn()

const renderOptions = {
  contexts: {
    PWAContext: { injectScriptOnce: mockedInjectScriptOnce },
    ViewportContext: {},
    AnalyticsContext: {},
  },
}

describe('AmazonPayButton Component', () => {
  const amazonCredentials = { id: 'mockedCredentials' }
  const amazonPayScript = 'https://static-fe.payments-amazon.com/checkout.js'

  beforeEach(() => {
    usePreference.mockReturnValue({
      amazonPayV2: { amazonPayScript },
    })
  })

  it('should correctly inject the Amazon Pay script and render the button upon successful load', async () => {
    window.amazon = { Pay: { renderButton: jest.fn() } }

    mockedInjectScriptOnce.mockImplementation((scriptUrl, { onLoad }) => {
      const scriptElement = document.createElement('script')
      scriptElement.src = scriptUrl
      document.body.appendChild(scriptElement)

      scriptElement.onload = onLoad
    })

    await act(async () => {
      render(<AmazonPayButton amazonCredentials={amazonCredentials} />, renderOptions)
    })

    expect(mockedInjectScriptOnce).toHaveBeenCalledWith(amazonPayScript, {
      onLoad: expect.any(Function),
      onError: expect.any(Function),
    })

    await act(async () => {
      const scriptElement = document.querySelector(`script[src="${amazonPayScript}"]`)
      fireEvent.load(scriptElement)
    })

    expect(window.amazon.Pay.renderButton).toHaveBeenCalledWith(
      '#amazon-button-container',
      amazonCredentials
    )
  })

  it('should handle script load error when the Amazon Pay script fails to load', async () => {
    console.log = jest.fn()
    mockedInjectScriptOnce.mockImplementation((_, { onError }) => {
      onError()
    })
    render(<AmazonPayButton amazonCredentials={amazonCredentials} />, renderOptions)
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('error loading amazon sdk')
    })
  })

  it('should render the Amazon Pay button container', () => {
    const { container } = render(
      <AmazonPayButton amazonCredentials={amazonCredentials} />,
      renderOptions
    )
    expect(container.querySelector('#amazon-button-container')).toBeInTheDocument()
  })
})

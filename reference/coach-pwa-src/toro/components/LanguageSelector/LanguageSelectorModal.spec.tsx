import userEvent from '@testing-library/user-event'
import { render, CustomRenderOptions, waitFor } from 'test-utils/react'
import LanguageSelectorModal from 'toro/components/LanguageSelector/LanguageSelectorModal'

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

describe('LanguageSelectorModal', () => {
  const mockSetRedirectLink = jest.fn()
  let assignMock: jest.Mock
  const originalLocation = window.location

  const makeSetup = (redirectLink = '') => {
    return render(
      <LanguageSelectorModal redirectLink={redirectLink} setRedirectLink={mockSetRedirectLink} />,
      renderOptions
    )
  }

  beforeEach(() => {
    assignMock = jest.fn()
    Object.defineProperty(window, 'location', {
      value: { assign: assignMock },
      writable: true,
    })
    jest.clearAllMocks()
  })

  afterAll(() => {
    window.location = originalLocation
  })

  it('should display the modal when redirectLink is provided', async () => {
    const { getByText } = makeSetup('https://www.coach.com/')
    await waitFor(() => expect(getByText('Shop By Your Shipping Destination')).toBeVisible())
  })

  it('should not display the modal when redirectLink is empty', async () => {
    const { queryByText } = makeSetup('')
    expect(queryByText('Shop By Your Shipping Destination')).toBeNull()
  })

  it('should render the continue button and handle click', async () => {
    const testUrl = 'https://www.coach.com/'
    const { getByText } = makeSetup(testUrl)
    const continueButton = getByText('CONTINUE TO OTHER SITE')
    await waitFor(() => expect(continueButton).toBeVisible())
    await userEvent.click(continueButton)
    expect(window.location).toBe(testUrl)
  })

  it('should clear redirectLink when stay button is clicked', async () => {
    const { getByText } = makeSetup('https://www.coach.com/')
    await userEvent.click(getByText('STAY ON THIS SITE'))
    expect(mockSetRedirectLink).toHaveBeenCalledWith('')
  })

  it('should render correct default messages from intl', async () => {
    const { getByText } = makeSetup('https://www.coach.com/')
    await waitFor(() =>
      expect(
        getByText(
          'For quicker service we’ll redirect you to shop the website closest to your shipping destination. Items in your bag will not carry over since our assortments vary by region.'
        )
      ).toBeVisible()
    )
  })
})

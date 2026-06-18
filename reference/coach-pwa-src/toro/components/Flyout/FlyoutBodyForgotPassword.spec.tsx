import { render, act, waitFor } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import FlyoutBodyForgotPassword from './FlyoutBodyForgotPassword'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import withCorrId from 'helpers/traceability'
import { useAtom } from 'jotai'

const setFullscreenLoadingMock = jest.fn()

jest.mock('helpers/traceability', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const mockedWithCorrId = jest.mocked(withCorrId)

jest.mock('jotai', () => {
  const actual = jest.requireActual('jotai')

  return {
    ...actual,
    useAtom: jest.fn(),
  }
})
const mockedUseAtom = jest.mocked(useAtom) as jest.Mock
mockedUseAtom.mockImplementation((atom) => {
  if (atom === setFullscreenLoadingAtom) {
    return [null, setFullscreenLoadingMock]
  }
  return [null, jest.fn()] as const
})

const makeSetup = (props = {}) => {
  const defaultProps = {
    data: {
      messageContainer: { p: { attribs: {}, text: 'Forgot Password?' } },
      form: { attribs: { action: '/forgot-password' } },
      inputEmail: { input: { attribs: { name: 'loginEmail' } }, error: { attribs: {} } },
      buttonSubmit: { button: { attribs: { type: 'submit' }, text: 'Submit' } },
      divider: { div: { text: 'Or' } },
      buttonContinue: { button: { attribs: {}, text: 'Continue' } },
    },
    onClose: jest.fn(),
    setDrawerHeader: jest.fn(),
    ...props,
  }

  return render(<FlyoutBodyForgotPassword {...defaultProps} />)
}

const mockFetch = (response) => {
  const mockFetchWithCorrId = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue(response),
  })
  mockedWithCorrId.mockReturnValue(mockFetchWithCorrId)
}

describe('FlyoutBodyForgotPassword Component', () => {
  it('should render form correctly', () => {
    const { getByText } = makeSetup()

    expect(getByText('Forgot Password?')).toBeVisible()
    expect(getByText('Submit')).toBeVisible()
    expect(getByText('Or')).toBeVisible()
    expect(getByText('Continue')).toBeVisible()
  })

  it('should allow entering email and submit the form', async () => {
    const user = userEvent.setup({ delay: null })
    const mockResponse = {
      success: true,
      receivedMsgBody: 'Success!',
      receivedMsgHeading: 'Password Reset',
    }
    mockFetch(mockResponse)

    const { getByRole, container, getByText } = makeSetup()

    await act(async () => {
      const emailInput = container.querySelector('input.chakra-input')
      await user.type(emailInput, 'test@coach.com')
      await user.click(getByRole('button', { name: 'Submit' }))
    })

    await waitFor(() => expect(setFullscreenLoadingMock).toHaveBeenCalledWith(true))
    await waitFor(() => expect(getByText('Success!')).toBeInTheDocument())
  })

  it('should display error when form submission fails', async () => {
    const user = userEvent.setup({ delay: null })
    const mockResponse = { success: false }
    mockFetch(mockResponse)

    const { getByRole, container } = makeSetup()

    await act(async () => {
      const emailInput = container.querySelector('input.chakra-input')
      await user.type(emailInput, 'test@test.com')
      await user.click(getByRole('button', { name: 'Submit' }))
    })

    await waitFor(() => expect(setFullscreenLoadingMock).toHaveBeenCalledWith(false))
    expect(withCorrId).toHaveBeenCalled()
  })

  it('should call onClose when continue button is clicked', async () => {
    const user = userEvent.setup({ delay: null })
    const onCloseMock = jest.fn()
    const { getByRole } = makeSetup({ onClose: onCloseMock })

    await act(async () => {
      await user.click(getByRole('button', { name: 'Continue' }))
    })

    expect(onCloseMock).toHaveBeenCalled()
  })
})

import { render, RenderResult } from 'test-utils/react'
import FlyoutHeaderRegister from 'toro/components/Flyout/FlyoutHeaderRegister'
import { useUpdateAtom } from 'jotai/utils'
import userEvent from '@testing-library/user-event'

jest.mock('jotai/utils')
const mockedUseUpdateAtomValue = useUpdateAtom as jest.MockedFn<typeof useUpdateAtom>
const mockSetFlyoutConfig = jest.fn()
mockedUseUpdateAtomValue.mockImplementation(() => mockSetFlyoutConfig)

const makeSetup = (props: object = {}): RenderResult => {
  const defaultProps = {
    drawerHeader: { text: 'Welcome to the Flyout' },
    drawerBody: {
      buttonLogin: {
        parent: {
          attribs: { 'data-qa': 'login-parent' },
          text: 'Already have an account?',
        },
        button: {
          attribs: {
            'data-qa': 'login-button',
            'data-action-url': 'https://coach.com/login?token=123',
          },
          text: 'Login',
        },
      },
    },
  }
  return render(<FlyoutHeaderRegister {...defaultProps} {...props} />)
}

describe('FlyoutHeaderRegister', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the component with provided props', () => {
    const { getByText } = makeSetup()

    expect(getByText('Already have an account?')).toBeVisible()
    expect(getByText('Login')).toBeVisible()
    expect(getByText('Welcome to the Flyout')).toBeVisible()
  })

  it('calls setFlyoutConfig with correct options on button click', async () => {
    const { getByTestId } = makeSetup()
    const user = userEvent.setup({ delay: null })
    const loginButton = getByTestId('login-button')
    await user.click(loginButton)

    expect(mockSetFlyoutConfig).toHaveBeenCalledWith({
      type: 'login',
      options: { token: '123' },
    })
  })

  it('handles missing data-action-url gracefully', async () => {
    const modifiedDrawerBody = {
      buttonLogin: {
        parent: {
          attribs: { 'data-testid': 'login-parent' },
          text: 'Already have an account?',
        },
        button: {
          attribs: {
            'data-qa': 'login-button',
            'data-url': 'https://coach.com/login?token=456',
          },
          text: 'Login',
        },
      },
    }
    const user = userEvent.setup({ delay: null })
    const { getByTestId } = makeSetup({ drawerBody: modifiedDrawerBody })

    const loginButton = getByTestId('login-button')
    await user.click(loginButton)

    expect(mockSetFlyoutConfig).toHaveBeenCalledWith({
      type: 'login',
      options: { token: '456' },
    })
  })

  it('handles missing URL gracefully', async () => {
    const modifiedDrawerBody = {
      buttonLogin: {
        parent: {
          attribs: { 'data-testid': 'login-parent' },
          text: 'Already have an account?',
        },
        button: {
          attribs: {
            'data-qa': 'login-button',
            'data-url': 'https://coach.com/login',
          },
          text: 'Login',
        },
      },
    }
    const user = userEvent.setup({ delay: null })

    const { getByTestId } = makeSetup({ drawerBody: modifiedDrawerBody })

    const loginButton = getByTestId('login-button')
    await user.click(loginButton)

    expect(mockSetFlyoutConfig).toHaveBeenCalledWith({
      type: 'login',
      options: {},
    })
  })

  it('handles missing drawerBody gracefully', () => {
    const { queryByText, getByText } = makeSetup({ drawerBody: null })

    expect(queryByText('Already have an account?')).not.toBeInTheDocument()
    expect(queryByText('Login')).not.toBeInTheDocument()
    expect(getByText('Welcome to the Flyout')).toBeInTheDocument()
  })

  it('handles missing drawerHeader gracefully', () => {
    const { queryByText, getByText } = makeSetup({ drawerHeader: null })

    expect(getByText('Already have an account?')).toBeInTheDocument()
    expect(getByText('Login')).toBeInTheDocument()
    expect(queryByText('Welcome to the Flyout')).not.toBeInTheDocument()
  })
})

import { render, act } from 'test-utils/react'
import Flyout from 'toro/components/Flyout/index'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import userEvent from '@testing-library/user-event'
import fetch from 'helpers/fetch'
import usePreference from 'toro/hooks/usePreference_new'

jest.mock('jotai/utils')
jest.mock('helpers/fetch')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/components/HtmlContent', () => {
  return function MockHtmlContent({ content }) {
    return <div data-testid="mock-html-content">{content}</div>
  }
})
jest.mock('next/router', () => {
  const push = jest.fn()
  return {
    useRouter: () => ({
      push,
    }),
  }
})

const flyoutConfig = {
  login: {
    header: { text: 'Welcome to the Flyout' },
    body: {
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
  },
  register: {
    header: { text: 'Create an Account' },
    body: {
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
          text: 'Sign In',
        },
      },
    },
  },
  'forgot-password': {
    header: { text: 'Forgot Password' },
    body: {
      messageContainer: {
        p: { attribs: {}, text: 'Forgot Password?' },
      },
      form: { attribs: { action: '/forgot-password' } },
      inputEmail: {
        input: { attribs: { name: 'loginEmail' } },
        error: { attribs: {} },
      },
      buttonSubmit: { button: { attribs: { type: 'submit' }, text: 'Submit' } },
      divider: { div: { text: 'Or' } },
      buttonContinue: { button: { attribs: {}, text: 'Continue' } },
    },
  },
}

const mockedUseAtomValue = jest.mocked(useAtomValue)
const mockedUseUpdateAtom = jest.mocked(useUpdateAtom)
const mockedFetch = jest.mocked(fetch)
const mockedUsePreference = jest.mocked(usePreference)

const renderComponent = async ({
  flyoutType,
  flyoutOptions,
  mockRecaptcha,
}: { flyoutType?: string; flyoutOptions?: object; mockRecaptcha?: boolean } = {}) => {
  mockedUseUpdateAtom.mockImplementation(() => jest.fn())

  if (flyoutType) {
    mockedUseAtomValue.mockImplementation(() => ({ type: flyoutType, options: flyoutOptions }))
    mockedFetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(flyoutConfig[flyoutType]),
        ok: true,
      } as Response)
    )
  }

  if (mockRecaptcha) {
    mockedUsePreference.mockImplementation(() => ({
      recaptcha: {
        enableCaptchaValidation: false,
        googleCaptchaSiteKey: '',
        enableEnterpriseCaptchaValidation: '',
        captchaEnterpriseSiteKey: '',
      },
    }))
  }
  return await act(() =>
    render(<Flyout />, {
      contexts: {
        PWAContext: {
          appData: {},
        },
        SessionContext: {
          actions: {
            fetchSession: jest.fn(),
          },
        },
        ViewportContext: { isDesktop: false, isMobile: true },
      },
    })
  )
}

describe('Flyout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the Flyout component closed initially', async () => {
    const { queryByRole } = await renderComponent()

    const dialog = queryByRole('dialog')
    expect(dialog).not.toBeInTheDocument()
  })

  it('should close the Flyout when the close button is clicked', async () => {
    const user = userEvent.setup({ delay: null })
    const { findByRole, getByRole } = await renderComponent({
      flyoutType: 'login',
      mockRecaptcha: true,
    })

    const dialog = await findByRole('dialog')
    const closeButton = getByRole('button', { name: /close/i })

    await user.click(closeButton)
    expect(dialog).toBeVisible()
  })

  it('should update drawer header and body when type is register', async () => {
    const { getByRole, getByText } = await renderComponent({
      flyoutType: 'register',
      mockRecaptcha: true,
    })

    expect(getByText('Create an Account')).toBeVisible()
    expect(getByText('Already have an account?')).toBeVisible()
    expect(getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  it('should update drawer header and body when type is forgot-password', async () => {
    const { getByRole, getByText } = await renderComponent({
      flyoutType: 'forgot-password',
      flyoutOptions: { referrer: 'https://www.coach.com/index.html' },
    })

    expect(getByText('Forgot Password')).toBeVisible()
    expect(getByRole('button', { name: /submit/i })).toBeVisible()
    expect(getByRole('button', { name: /continue/i })).toBeVisible()
  })
})

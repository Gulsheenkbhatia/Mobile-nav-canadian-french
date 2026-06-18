import React from 'react'
import { render, screen, waitFor } from 'test-utils/react'
import { useAtomValue } from 'jotai/utils'

import { hashEmail } from 'toro/helpers/hashEmail'
import { STORAGE_XGEN_CUSTOMER_ID } from 'toro/constants/storageIds'
import { xgenAlternateUserIdAtom } from 'store/xgen-recommendations.atom'

let mockFetchImpl = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({}) })

jest.mock('helpers/traceability', () => ({
  __esModule: true,
  default:
    () =>
    (...args) =>
      mockFetchImpl(...args),
}))

jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn(), pathname: '/', query: {}, asPath: '/' }),
}))

jest.mock('toro/cms/components/CustomSlot', () => ({
  __esModule: true,
  default: () => null,
}))

jest.mock('toro/hocs/withErrorBoundaryWrapper', () => ({
  __esModule: true,
  default: (Component) => Component,
}))

import EmailSignupForm from 'toro/components/footer/EmailSignupForm/EmailSignupForm'

const VALID_EMAIL = 'customer@example.com'

function TestWrapper(formProps) {
  const atomValue = useAtomValue(xgenAlternateUserIdAtom)
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(EmailSignupForm, {
      locale: 'en-US',
      isToroCaEmailSignupTextEnabled: false,
      isTermsAndConditionTextEnabled: false,
      isSignupTextWithCheckbox: false,
      isDesktop: true,
      footerData: {},
      ...formProps,
    }),
    React.createElement(
      'span',
      { 'data-qa': 'atom-spy' },
      atomValue !== null ? atomValue : '__null__'
    )
  )
}

function renderForm(formProps) {
  return render(React.createElement(TestWrapper, formProps), {
    contexts: {
      PWAContext: {},
      AnalyticsContext: {},
      JotaiProviderContext: new Map(),
    },
  })
}

describe('EmailSignupForm - xgenAlternateUserId', () => {
  beforeEach(() => {
    mockFetchImpl = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({}) })
    window.localStorage.removeItem(STORAGE_XGEN_CUSTOMER_ID)
  })

  it('sets the atom with hashed email on valid submit', async () => {
    const { user } = renderForm()
    await user.type(screen.getByPlaceholderText(/enter email/i), VALID_EMAIL)
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByTestId('atom-spy').textContent).toBe(hashEmail(VALID_EMAIL))
    })
  })

  it('sets the atom even when the API returns a duplicate-email error', async () => {
    mockFetchImpl = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ error: true, serverErrors: ['is already signed up'] }),
    })
    const { user } = renderForm()
    await user.type(screen.getByPlaceholderText(/enter email/i), VALID_EMAIL)
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByTestId('atom-spy').textContent).toBe(hashEmail(VALID_EMAIL))
    })
  })

  it('sets the atom even when the API call throws a network error', async () => {
    mockFetchImpl = jest.fn().mockRejectedValue(new Error('Network error'))
    const { user } = renderForm()
    await user.type(screen.getByPlaceholderText(/enter email/i), VALID_EMAIL)
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByTestId('atom-spy').textContent).toBe(hashEmail(VALID_EMAIL))
    })
  })

  it('does NOT set the atom when the email field is empty', async () => {
    const { user } = renderForm()
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(screen.getByTestId('atom-spy').textContent).toBe('__null__')
  })

  it('does NOT set the atom when the email format is invalid', async () => {
    const { user } = renderForm()
    await user.type(screen.getByPlaceholderText(/enter email/i), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(screen.getByTestId('atom-spy').textContent).toBe('__null__')
  })
})

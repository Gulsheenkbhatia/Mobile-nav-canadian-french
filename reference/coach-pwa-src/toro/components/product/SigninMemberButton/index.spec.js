import React from 'react'
import { render } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import SigninMemberButton from './index'

jest.mock('next/router', () => {
  const push = jest.fn()
  return {
    useRouter: () => ({
      push,
    }),
  }
})

jest.mock('toro/analytics/useAnalytics', () => () => ({
  send: jest.fn(),
}))

describe('SigninMemberButton', () => {
  const renderComponent = (props = {}) => {
    return render(<SigninMemberButton {...props} />)
  }

  it('renders correctly', () => {
    const { getByTestId } = renderComponent({
      isQuickView: false,
      productData: { id: '123' },
      setModalOpen: jest.fn(),
    })
    expect(getByTestId('membership_exclusive_cta')).toBeVisible()
  })

  it('renders quick view text when isQuickView is true', () => {
    const { getByTestId } = renderComponent({
      isQuickView: true,
      productData: { id: '123' },
      setModalOpen: jest.fn(),
    })
    expect(getByTestId('wrapper_mbr_exclsv_btn')).toBeVisible()
  })

  it('handles button click', async () => {
    const user = userEvent.setup()
    const mockSetModalOpen = jest.fn()
    const { getByTestId } = renderComponent({
      colors: { main: { primary: 'blue', secondary: 'white' } },
      isQuickView: false,
      productData: { id: '123' },
      setModalOpen: mockSetModalOpen,
    })
    const button = getByTestId('membership_exclusive_cta')
    await user.click(button)
    expect(mockSetModalOpen).toHaveBeenCalledWith(true)
  })
})

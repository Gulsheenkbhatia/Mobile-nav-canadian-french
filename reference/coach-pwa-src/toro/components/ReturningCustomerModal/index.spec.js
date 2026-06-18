import React from 'react'
import { render, waitFor } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import ReturningCustomerModal from './index'
import Cookies from 'js-cookie'
import * as getFullData from 'helpers/getFullData'
import miniCartProduct from 'test-utils/MiniCartPopoverItem2.mock'
import { RETURN_MODAL_SEEN } from 'toro/constants/cookies'

jest.mock('next/router', () => ({
  useRouter: () => ({ locale: 'en', defaultLocale: 'en' }),
}))
const mockSetIsOutletTab = jest.fn()
jest.mock('jotai/utils', () => ({
  useUpdateAtom: jest.fn(() => mockSetIsOutletTab),
  useAtomValue: jest.fn(() => [{ product_id: 1 }]),
  atomWithReset: jest.fn(),
  atomWithStorage: jest.fn(),
  atomWithDefault: jest.fn(),
  selectAtom: jest.fn(),
  atomFamily: jest.fn(),
  createJSONStorage: jest.fn(() => jest.fn()),
  loadable: jest.fn(),
}))

jest.mock('toro/hooks/usePageType', () => () => ({ isPDP: false }))
const mockAnalytyticsSend = jest.fn()

jest.mock('toro/analytics/useAnalytics', () =>
  jest.fn(() => ({
    send: mockAnalytyticsSend,
  }))
)
jest.mock('toro/hooks/useIcon')
jest.mock('toro/hooks/useMultiStyleConfig', () => () => ({}))
jest.mock('toro/hooks/useViewportType', () => () => ({ viewport: 'desktop' }))
jest.mock('toro/hooks/useOutsideClick', () => jest.fn())
jest.mock('toro/components/Modal', () => ({ children }) => <div role="dialog">{children}</div>)
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
}))
jest.spyOn(getFullData, 'fetchFullData').mockResolvedValue([miniCartProduct])

const defaultSession = {
  initialized: true,
  cart: {
    product_items: [miniCartProduct],
    product_total: 149,
    basket_id: 'bfe074e5e5bfbb115c9b5095a8',
  },
}

const renderComponent = (session = defaultSession) => {
  return render(<ReturningCustomerModal />, {
    contexts: {
      PWAContext: {
        appData: {},
      },
      SessionContext: {
        session,
      },
    },
  })
}

describe('ReturningCustomerModal', () => {
  it('should not render the modal by default', () => {
    const session = { initialized: false, cart: { product_items: [] } }
    const { queryByRole } = renderComponent(session)

    expect(queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should render the modal when conditions are met', async () => {
    const { getByRole } = renderComponent()

    await waitFor(() => {
      expect(getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('should close the modal when CloseButton is clicked', async () => {
    const user = userEvent.setup()
    const { getByRole, queryByRole, container } = renderComponent()

    await waitFor(() => {
      expect(getByRole('dialog')).toBeInTheDocument()
    })

    await user.click(container.querySelector('button use[href="#icon-close"]'))

    await waitFor(() => {
      expect(queryByRole('dialog')).not.toBeInTheDocument()
      expect(Cookies.set).toHaveBeenCalledWith(RETURN_MODAL_SEEN, 'true', { expires: 1 })
    })
  })

  it('should send analytics on click', async () => {
    const user = userEvent.setup()
    const { getByRole } = renderComponent()

    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument())

    await user.click(getByRole('button', { name: /VIEW YOUR SHOPPING BAG/i }))

    expect(mockAnalytyticsSend).toHaveBeenCalledWith(
      'returningCustomerModalInteraction',
      expect.any(Object)
    )
  })

  it('should render the modal with the last seen product', async () => {
    const session = {
      ...defaultSession,
      cart: {
        product_items: [],
      },
    }

    const { getByRole } = renderComponent(session)

    await waitFor(() => {
      expect(getByRole('dialog')).toBeInTheDocument()
      expect(getByRole('img', { name: miniCartProduct.name })).toBeInTheDocument()
      expect(getByRole('link', { name: /VIEW PRODUCT DETAILS/i })).toHaveAttribute(
        'href',
        miniCartProduct.url
      )
    })
  })

  it('should use defaultLocale in fetchFullProduct when locale is undefined', async () => {
    const { fetchFullData } = require('helpers/getFullData')
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({ defaultLocale: 'en' }))

    const session = {
      ...defaultSession,
      cart: {
        product_items: [],
      },
    }
    const { getByRole } = renderComponent(session)

    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument())

    expect(fetchFullData).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({ locale: 'en' })
    )
  })
})

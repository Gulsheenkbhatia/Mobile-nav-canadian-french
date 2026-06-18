import React from 'react'
import { render, CustomRenderOptions } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import FindInStoreComponentV3Redesign from './FindInStoreComponentV3Redesign'

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
    ViewportContext: {
      viewport: 'desktop',
      isDesktop: true,
      isMobile: false,
      isTablet: false,
    },
  },
}

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({
    locale: 'en',
  })

  return {
    ...reactIntl,
    useIntl: () => intl,
  }
})

jest.mock('toro/hooks/useViewportType', () => ({
  __esModule: true,
  default: () => ({
    isDesktop: true,
    isMobile: false,
    isTablet: false,
  }),
}))

describe('FindInStoreComponentV3Redesign', () => {
  const defaultProps = {
    handleOnPickUpInStoreClick: jest.fn(),
    handleOpenModal: jest.fn(),
    isNeedFindStore: false,
    location: '',
    zipCode: '12345',
  }

  test('renders pick up search store button', () => {
    const { getByRole } = render(
      <FindInStoreComponentV3Redesign {...defaultProps} />,
      renderOptions
    )
    expect(getByRole('button')).toBeVisible()
  })

  test('renders pick up not available message when isNeedFindStore is true and location is empty', () => {
    const props = { ...defaultProps, isNeedFindStore: true, location: '' }
    const { getByTestId } = render(<FindInStoreComponentV3Redesign {...props} />, renderOptions)
    expect(getByTestId('pdp_link_s_findoredit')).toBeVisible()
  })

  test('renders pick up with chosen store message when isNeedFindStore is true and location is provided', () => {
    const props = { ...defaultProps, isNeedFindStore: true, location: 'New York' }
    const { getByTestId } = render(<FindInStoreComponentV3Redesign {...props} />, renderOptions)
    expect(getByTestId('pdp_txt_s_avlbl_at_sname')).toBeVisible()
  })

  test('calls handleOpenModal when pick up search store button is clicked', async () => {
    const user = userEvent.setup()
    const { getByTestId } = render(
      <FindInStoreComponentV3Redesign {...defaultProps} />,
      renderOptions
    )

    await user.click(getByTestId('pdp_btn_pkupin_s'))
    expect(defaultProps.handleOpenModal).toHaveBeenCalled()
  })

  test('calls handleOpenModal when change zip code link is clicked', async () => {
    const user = userEvent.setup()
    const props = { ...defaultProps, isNeedFindStore: true, location: '' }
    const { getByTestId } = render(<FindInStoreComponentV3Redesign {...props} />, renderOptions)

    await user.click(getByTestId('pdp_link_s_findoredit'))
    expect(props.handleOpenModal).toHaveBeenCalled()
  })

  test('calls handleOnPickUpInStoreClick when pick up button is clicked', async () => {
    const user = userEvent.setup()
    const props = { ...defaultProps, isNeedFindStore: true, location: 'New York' }
    const { container } = render(<FindInStoreComponentV3Redesign {...props} />, renderOptions)
    await user.click(container.querySelector('.find-a-store-pick-up-ready'))
    expect(props.handleOnPickUpInStoreClick).toHaveBeenCalled()
  })
  test('calls default handleOnPickUpInStoreClick when pick up in store button is clicked', async () => {
    const user = userEvent.setup()
    const { getByTestId } = render(
      <FindInStoreComponentV3Redesign isNeedFindStore={true} location="New York" zipCode="12345" />,
      renderOptions
    )

    const PickUpInStoreClick = getByTestId('pdp_btn_pkupin_s')
    await user.click(PickUpInStoreClick)
  })

  test('calls default handleOpenModal when find/edit store button is clicked', async () => {
    const user = userEvent.setup()
    const { getByTestId } = render(
      <FindInStoreComponentV3Redesign isNeedFindStore={true} location="New York" zipCode="12345" />,
      renderOptions
    )
    await user.click(getByTestId('pdp_link_s_findoredit'))
  })
  test('renders Find In Store message when feature toggle is off', () => {
    const props = { ...defaultProps }
    const { getByText } = render(<FindInStoreComponentV3Redesign {...props} />, renderOptions)
    expect(getByText('Pick up in-store')).toBeInTheDocument()
  })
})

import React from 'react'
import { render } from 'test-utils/react'
import FindInStoreWidget from './index'

jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: false }))

describe('FindInStoreWidget', () => {
  const defaultProps = {
    handleOnPickUpInStoreClick: jest.fn(),
    handleOpenModal: jest.fn(),
    isNeedFindStore: false,
    location: '',
    zipCode: '',
  }

  test('renders without crashing', () => {
    render(<FindInStoreWidget {...defaultProps} />)
  })

  test('renders find a store button when isNeedFindStore is false', () => {
    const { getByRole } = render(<FindInStoreWidget {...defaultProps} />)

    expect(getByRole('button')).toBeVisible()
  })

  test('renders pick up in store button when location is available', () => {
    const { getByTestId } = render(
      <FindInStoreWidget {...defaultProps} isNeedFindStore={true} location="New York" />
    )

    expect(getByTestId('pdp_txt_s_avlbl_at_sname')).toBeVisible()
  })

  test('renders AvailableAtWrapperMobile when isMobile and zipCode are provided', () => {
    jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: true }))
    const { getByTestId } = render(
      <FindInStoreWidget {...defaultProps} isNeedFindStore={true} zipCode="10001" />
    )

    expect(getByTestId('pdp_txt_s_avlbl_at_sname')).toBeVisible()
  })

  test('calls handleOnPickUpInStoreClick when pick up in store button is clicked', async () => {
    const { user, getByTestId } = render(
      <FindInStoreWidget {...defaultProps} isNeedFindStore={true} location="New York" />
    )
    const PickUpInStoreClick = getByTestId('pdp_btn_pkupin_s')
    await user.click(PickUpInStoreClick)
    expect(defaultProps.handleOnPickUpInStoreClick).toHaveBeenCalled()
  })

  test('calls handleOpenModal when find/edit store button is clicked', async () => {
    const { user, getByTestId } = render(
      <FindInStoreWidget {...defaultProps} isNeedFindStore={true} location="New York" />
    )

    await user.click(getByTestId('pdp_link_s_findoredit'))
    expect(defaultProps.handleOpenModal).toHaveBeenCalled()
  })

  test('calls default handleOnPickUpInStoreClick when pick up in store button is clicked', async () => {
    const { user, getByTestId } = render(
      <FindInStoreWidget isNeedFindStore={true} location="New York" />
    )

    const PickUpInStoreClick = getByTestId('pdp_btn_pkupin_s')
    await user.click(PickUpInStoreClick)
  })

  test('calls default handleOpenModal when find/edit store button is clicked', async () => {
    const { user, getByTestId } = render(
      <FindInStoreWidget isNeedFindStore={true} location="New York" />
    )
    await user.click(getByTestId('pdp_link_s_findoredit'))
  })
})

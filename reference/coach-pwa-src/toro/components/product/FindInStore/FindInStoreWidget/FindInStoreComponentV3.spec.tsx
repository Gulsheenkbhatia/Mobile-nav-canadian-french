import React from 'react'
import { render, CustomRenderOptions } from 'test-utils/react'
import FindInStoreComponentV3 from './FindInStoreComponentV3'
import userEvent from '@testing-library/user-event'
import { IntlProvider } from 'react-intl'

jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: false }))
jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({
    locale: 'en',
    messages: {
      'pdp.product.pickUpInStoreButton': 'Pick Up In Store',
      'pdp.product.findAStoreForPickUpButton': 'Find a Store for Pickup',
      'pdp.product.availableAt': 'Available at {location}',
      'pdp.product.notAvailableNear': 'Not available for pickup near {location}',
      'pdp.product.findOrEditStore': 'Find or Edit Store',
    },
  })

  return {
    ...reactIntl,
    useIntl: () => intl,
  }
})

const defaultProps = {
  handleOnPickUpInStoreClick: jest.fn(),
  location: '',
  handleOpenModal: jest.fn(),
  isNeedFindStore: false,
  zipCode: '',
}
const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}
describe('FindInStoreComponentV3', () => {
  it('should render without crashing', () => {
    const { getByRole } = render(<FindInStoreComponentV3 {...defaultProps} />, renderOptions)
    const button = getByRole('button')
    expect(button).toBeVisible()
  })

  it('should call handleOpenModal when find a store button is clicked', async () => {
    const user = userEvent.setup()
    const { getByRole } = render(<FindInStoreComponentV3 {...defaultProps} />, renderOptions)
    const button = getByRole('button')
    await user.click(button)
    expect(defaultProps.handleOpenModal).toHaveBeenCalled()
  })

  it('should render location if isNeedFindStore is true and location is provided', () => {
    const props = {
      ...defaultProps,
      isNeedFindStore: true,
      location: 'New York',
    }
    const { getByTestId } = render(<FindInStoreComponentV3 {...props} />, renderOptions)
    expect(getByTestId('pdp_txt_s_avlbl_at_sname')).toBeVisible()
  })

  it('should call handleOnPickUpInStoreClick when pick up in store button is clicked', async () => {
    const user = userEvent.setup()
    const props = {
      ...defaultProps,
      isNeedFindStore: true,
      location: 'New York',
    }
    const { container } = render(<FindInStoreComponentV3 {...props} />, renderOptions)
    await user.click(container.querySelector('.find-a-store-pick-up-ready'))

    expect(props.handleOnPickUpInStoreClick).toHaveBeenCalled()
  })

  it('should call handleOpenModal when find or edit store button is clicked', async () => {
    const user = userEvent.setup()
    const props = {
      ...defaultProps,
      isNeedFindStore: true,
      location: 'New York',
    }
    const { getByTestId } = render(<FindInStoreComponentV3 {...props} />, renderOptions)
    await user.click(getByTestId('pdp_link_s_findoredit'))
    expect(props.handleOpenModal).toHaveBeenCalled()
  })

  test('calls default handleOnPickUpInStoreClick when pick up in store button is clicked', async () => {
    const user = userEvent.setup()
    const { getByTestId } = render(
      <FindInStoreComponentV3
        isNeedFindStore={true}
        location="New York"
        handleOnPickUpInStoreClick={jest.fn()}
        handleOpenModal={jest.fn()}
        zipCode=""
      />,
      renderOptions
    )

    const PickUpInStoreClick = getByTestId('pdp_btn_pkupin_s')
    await user.click(PickUpInStoreClick)
  })

  test('calls default handleOpenModal when find/edit store button is clicked', async () => {
    const user = userEvent.setup()
    const { getByTestId } = render(
      <FindInStoreComponentV3
        isNeedFindStore={true}
        location="New York"
        handleOnPickUpInStoreClick={jest.fn()}
        handleOpenModal={jest.fn()}
        zipCode=""
      />,
      renderOptions
    )
    await user.click(getByTestId('pdp_link_s_findoredit'))
  })
  it('should render the correct message with zipCode when location is not provided', () => {
    const props = {
      ...defaultProps,
      isNeedFindStore: true,
      zipCode: '10001',
    }

    const messages = {
      'pdp.product.notAvailableNear': 'Not available for pickup near {location}',
    }

    const { getByTestId } = render(
      <IntlProvider locale="en" messages={messages}>
        <FindInStoreComponentV3 {...props} />
      </IntlProvider>,
      renderOptions
    )
    expect(getByTestId('pdp_txt_s_avlbl_at_sname')).toBeVisible()
  })
})

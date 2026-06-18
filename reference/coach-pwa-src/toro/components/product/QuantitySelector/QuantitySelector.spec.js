import { render, screen } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import QuantitySelector from './index'
import { useAtomValue } from 'jotai/utils'
import { getSiteValueFromPref } from 'toro/helpers/preferences'

jest.mock('toro/analytics/useAnalytics')
jest.mock('jotai/utils')
jest.mock('toro/helpers/preferences')
jest.mock('toro/icons', () => ({
  CaretDownIcon: () => <div>Caret Down Icon</div>,
}))

const mockedUseAtomValue = jest.mocked(useAtomValue)
const mockedGetSiteValueFromPref = jest.mocked(getSiteValueFromPref)
const mockAnalytyticsSend = jest.fn()

jest.mock('toro/analytics/useAnalytics', () =>
  jest.fn(() => ({
    send: mockAnalytyticsSend,
  }))
)

describe('QuantitySelector Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockedUseAtomValue.mockReturnValue(false)
    mockedGetSiteValueFromPref.mockImplementation(
      (_, _1, defaultValue) => (!defaultValue && true) || (defaultValue === 5 && 5)
    )
  })
  const renderOptions = {
    contexts: {
      PWAContext: { appData: { siteId: 'coh_us_out' } },
    },
  }

  const renderComponent = (props = {}) => {
    const defaultProps = {
      selectedQuantity: 1,
      disabled: false,
      onChange: jest.fn(),
      isQuickView: false,
      productId: '123',
      maxQty: 5,
      isBundleVariant: false,
      sxStyles: {},
      quickViewEventLocation: 'test-location',
      selectedVgId: 'vg123',
      variant: '',
      isSticky: false,
      selectedProductId: 'prod123',
      'data-qa': 'quantity_dropdown',
    }
    return render(<QuantitySelector {...defaultProps} {...props} />, renderOptions)
  }

  it('renders without crashing', () => {
    const { container } = renderComponent()
    expect(container.querySelector('[data-qa="quantity_dropdown"]')).toBeVisible()
  })

  it('displays the correct number of quantity options', () => {
    mockedUseAtomValue.mockReturnValue(true)
    renderComponent({ maxQty: 3, isSticky: true })
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(3)
    expect(options[0]).toHaveTextContent('1')
    expect(options[1]).toHaveTextContent('2')
    expect(options[2]).toHaveTextContent('3')
  })

  it('renders nothing if isMaxQtyRestrictionEnabled is false', () => {
    mockedUseAtomValue.mockReturnValue(true)
    mockedGetSiteValueFromPref.mockImplementation(
      (_, _1, defaultValue) => (!defaultValue && false) || (defaultValue === 5 && 5)
    )
    const { container } = renderComponent()
    expect(container.querySelector('[data-qa="quantity_dropdown"]')).not.toBeInTheDocument()
  })

  it('calls onChange when a new quantity is selected', async () => {
    mockedUseAtomValue.mockReturnValue(true)
    const handleChange = jest.fn()
    const { container } = renderComponent({ onChange: handleChange, isSticky: true })
    const dropdown = container.querySelector('[data-qa="quantity_dropdown"]')
    await userEvent.selectOptions(dropdown, '2')
    expect(handleChange).toHaveBeenCalledWith(2)
  })

  it('does render options when max quantity is passed as props', () => {
    renderComponent({ maxQty: 2 })
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(2)
    expect(options[0]).toHaveTextContent('1')
    expect(options[1]).toHaveTextContent('2')
  })

  it('does render options when max quantity is not provided and defaultMaxQty is provided', () => {
    renderComponent({ maxQty: undefined })
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(5)
    expect(options[0]).toBeVisible()
    expect(options[1]).toBeVisible()
    expect(options[2]).toBeVisible()
    expect(options[3]).toBeVisible()
    expect(options[4]).toBeVisible()
  })

  it('does render one options when max quantity and defaultmaxqty is not provided', () => {
    mockedGetSiteValueFromPref.mockImplementation(
      (_, _1, defaultValue) => (!defaultValue && true) || (defaultValue === 5 && undefined)
    )
    renderComponent({ maxQty: undefined })
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent('1')
  })

  it('sets the internal selected quantity when selectedQuantity prop changes', () => {
    const { rerender } = renderComponent({ selectedQuantity: 2, disabled: true })
    rerender(<QuantitySelector selectedQuantity={3} disabled={true} />, renderOptions)
    expect(screen.getByRole('combobox')).toHaveValue('3')
  })

  it('trigger onChange event and sends analytics for productInteraction on quantity change', async () => {
    renderComponent()
    await userEvent.selectOptions(screen.getByRole('combobox'), '3')

    expect(mockAnalytyticsSend).toBeCalledWith('productInteraction', {
      eventLocationForced: 'product',
      eventAction: 'quantity dropdown select',
      eventLabel: 'prod123',
    })
  })

  it('trigger onChange event and sends analytics for quickViewInteraction on quantity change', async () => {
    renderComponent({ isQuickView: true })
    await userEvent.selectOptions(screen.getByRole('combobox'), '3')

    expect(mockAnalytyticsSend).toBeCalledWith('quickViewInteraction', {
      eventLocation: 'test-location',
      eventAction: 'quantity dropdown select',
      eventLabel: 'vg123',
    })
  })
})

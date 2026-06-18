import React from 'react'
import { render, screen, fireEvent } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import FilterPrice from 'toro/components/list/Filters/FilterPrice'
import { act } from 'react-dom/test-utils'
import { useAtomValue } from 'jotai/utils'
import { isCompletePlpV3DesktopAtom } from 'store/plp.atom'
import { filtersAtom } from 'store/search-results.atom'

jest.mock('toro/analytics/useAnalytics', () => {
  return jest.fn(() => ({
    send: jest.fn(),
  }))
})

jest.mock('jotai/utils')

const mockRefinement = {
  options: [0, 1000],
}

jest.mock('toro/hooks/useIcon')
jest.mock('toro/hooks/usePreference_new', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    responseDelay: 0,
    sliderStepSize: 50,
  })),
}))
jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: false }))
const mockHandleFilterChange = jest.fn()
const mockUseAtomValueDefault = (customFilters = []) => {
  useAtomValue.mockImplementation((atom) => {
    if (atom === filtersAtom) return customFilters
    if (atom === isCompletePlpV3DesktopAtom) return true
    return undefined
  })
}
const mockAppData = {
  locale: 'en-US',
}

const renderOptions = {
  contexts: {
    PWAContext: { appData: { mockAppData } },
    SessionContext: {},
  },
}
const renderComponent = (props = {}) => {
  return render(
    <FilterPrice
      refinement={mockRefinement}
      handleFilterChange={mockHandleFilterChange}
      styles={{}}
      variant="default"
      {...props}
    />,
    { ...renderOptions, userSetupOptions: { advanceTimers: jest.advanceTimersByTime } }
  )
}
beforeEach(() => {
  jest.clearAllMocks()
})
describe('FilterPrice Component', () => {
  it('should render correctly', () => {
    mockUseAtomValueDefault()
    const { getByTestId } = renderComponent()
    expect(getByTestId('plpfltr_min_price_txtlbl')).toBeVisible()
    expect(getByTestId('plpfltr_max_price_txtlbl')).toBeVisible()
  })

  it('should update min price on input change', async () => {
    mockUseAtomValueDefault()
    const user = userEvent.setup()
    const { getByTestId } = renderComponent()
    const minPriceInput = getByTestId('plpfltr_min_price_input')
    await user.clear(minPriceInput)
    await user.type(minPriceInput, '100')

    expect(minPriceInput).toHaveValue(100)
  })

  it('should update max price on input change', async () => {
    mockUseAtomValueDefault()
    const user = userEvent.setup()
    const { getByTestId } = renderComponent()
    const maxPriceInput = getByTestId('plpfltr_max_price_input')

    await user.clear(maxPriceInput)
    await user.type(maxPriceInput, '900')

    expect(maxPriceInput).toHaveValue(900)
  })

  it('should update slider values on input change', async () => {
    const user = userEvent.setup()
    const { getByTestId } = renderComponent()
    const minPriceInput = getByTestId('plpfltr_min_price_input')
    const maxPriceInput = getByTestId('plpfltr_max_price_input')

    await user.clear(minPriceInput)
    await user.type(minPriceInput, '100')

    await user.clear(maxPriceInput)
    await user.type(maxPriceInput, '900')

    expect(minPriceInput.value).toBe('100')
    expect(maxPriceInput.value).toBe('900')
  })

  it('should handle price limits clamping', async () => {
    jest.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    mockUseAtomValueDefault()
    const { getByTestId } = renderComponent()
    const minInput = getByTestId('plpfltr_min_price_input')
    const maxInput = getByTestId('plpfltr_max_price_input')
    await act(async () => {
      await user.clear(minInput)
      await user.type(minInput, '-100')
      await user.tab()
    })
    await act(async () => {
      await user.clear(maxInput)
      await user.type(maxInput, '1500')
      await user.tab()
    })

    expect(minInput).toHaveValue(0)
    expect(maxInput).toHaveValue(1000)
  })
  it('should handle step value rounding', async () => {
    mockUseAtomValueDefault()
    const { user, getByTestId, container } = renderComponent()
    const minInput = getByTestId('plpfltr_min_price_input')

    await act(async () => {
      await user.type(minInput, '225')
      await user.click(container) // blur the input
    })

    expect(minInput.value).toBe('250')
  })
  it('should initialize with existing price filters from store', async () => {
    const mockFilters = [
      { id: 'pmin', values: ['200'] },
      { id: 'pmax', values: ['800'] },
    ]
    mockUseAtomValueDefault(mockFilters)
    const { getByTestId } = renderComponent()
    expect(getByTestId('plpfltr_min_price_input')).toHaveValue(200)
    expect(getByTestId('plpfltr_max_price_input')).toHaveValue(800)
    const sliderHandles = screen.getAllByRole('slider')
    expect(sliderHandles[0]).toHaveAttribute('aria-valuenow', '200')
    expect(sliderHandles[1]).toHaveAttribute('aria-valuenow', '800')
  })
  it('should initialize with default zeros when no refinement options exist', () => {
    const { getByTestId } = renderComponent({
      refinement: { options: [null, null] },
    })
    expect(getByTestId('plpfltr_min_price_input')).toHaveValue(0)
    expect(getByTestId('plpfltr_max_price_input')).toHaveValue(0)
    const sliderHandles = screen.getAllByRole('slider')
    sliderHandles.forEach((handle) => {
      expect(handle).toHaveAttribute('aria-valuenow', '0')
    })
  })

  it('should update prices when slider handles move', async () => {
    mockUseAtomValueDefault()
    renderComponent()
    const sliderHandles = screen.getAllByRole('slider')
    const minHandle = sliderHandles[0]

    expect(minHandle).toHaveAttribute('aria-valuenow', '0')

    fireEvent.mouseDown(minHandle)
    fireEvent.mouseMove(document, {
      clientX: 300,
    })
    fireEvent.mouseUp(document)

    fireEvent.mouseUp(document)
    const minPriceInput = screen.getByTestId('plpfltr_min_price_input')
    const minPriceValue = Number(minPriceInput.value)
    expect(minPriceValue).toBeGreaterThan(0)
  })
})

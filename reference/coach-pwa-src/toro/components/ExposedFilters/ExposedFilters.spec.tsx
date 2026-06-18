import userEvent from '@testing-library/user-event'
import { render, screen } from 'test-utils/react'
import ExposedFilters from '.'
import useFilterToggle from 'toro/hooks/useFilterToggle'
import { filtersAtom } from 'store/search-results.atom'
import { PriceRefinement } from 'toro/components/ExposedFilters/helpers'

jest.mock('toro/hooks/useFilterToggle', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const mockedUseFilterToggle = jest.mocked(useFilterToggle)

const defaultFilters = [
  { id: 'pmin', values: ['100'] },
  { id: 'pmax', values: ['200'] },
]

const priceRefinementDefaultOptions = [
  {
    refvalue: '100-200',
    displayName: '$100-$200',
    selectable: true,
  },
  {
    refvalue: '200-300',
    displayName: '$200-$300',
    selectable: true,
  },
]

const buildRefinement = (
  options: PriceRefinement['options'] = priceRefinementDefaultOptions
): PriceRefinement => ({
  name: 'Price',
  type: '_price_',
  id: '_price_',
  options,
})

const renderComponent = (
  filters = defaultFilters,
  refinement: PriceRefinement | null = buildRefinement()
) =>
  render(<ExposedFilters refinement={refinement as PriceRefinement} />, {
    contexts: {
      JotaiProviderContext: new Map([[filtersAtom, filters]]),
    },
  })

describe('<ExposedFilters>', () => {
  const handleFilterChangeMock = jest.fn()
  const clearFiltersMock = jest.fn()

  beforeEach(() => {
    mockedUseFilterToggle.mockReturnValue({
      handleFilterChange: handleFilterChangeMock,
      clearFilters: clearFiltersMock,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Filter Options Rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent()

      expect(container.querySelector('#exposed-filters')).toBeInTheDocument()
    })

    it('renders an empty when no filter options are provided', () => {
      const { container } = renderComponent(defaultFilters, { ...buildRefinement([]) })

      expect(container.querySelectorAll('[data-qa^="plpfltr_link_fltr_price_"]').length).toBe(0)
    })

    it('renders price options and marks the current selection', () => {
      renderComponent()

      const selectedOption = screen.getByTestId('plpfltr_link_fltr_price_swatch_slctd')
      expect(selectedOption).toBeVisible()
      expect(selectedOption).toHaveTextContent('$100-$200')

      const availableOption = screen.getByTestId('plpfltr_link_fltr_price_swatch_enbld')
      expect(availableOption).toBeVisible()
      expect(availableOption).toHaveTextContent('$200-$300')
    })
  })

  describe('Selected State Logic', () => {
    it('marks an option as selected when current filters match the range', () => {
      renderComponent()

      const selectedOption = screen.getByTestId('plpfltr_link_fltr_price_swatch_slctd')
      expect(selectedOption).toHaveClass('selected')
    })

    it('updates selection when a different option is clicked', async () => {
      const user = userEvent.setup()
      const refinement = buildRefinement()

      const { unmount } = renderComponent(defaultFilters, refinement)

      const secondOption = screen.getByTestId('plpfltr_link_fltr_price_swatch_enbld')
      await user.click(secondOption)

      expect(handleFilterChangeMock).toHaveBeenCalledTimes(1)
      expect(handleFilterChangeMock).toHaveBeenCalledWith(
        expect.objectContaining({
          optionRefValue: '200-300',
          refinement,
        })
      )

      unmount()
      renderComponent(
        [
          { id: 'pmin', values: ['200'] },
          { id: 'pmax', values: ['300'] },
        ],
        refinement
      )

      const newlySelectedOption = screen.getByTestId('plpfltr_link_fltr_price_swatch_slctd')
      expect(newlySelectedOption).toHaveTextContent('$200-$300')
    })
  })

  describe('Filter Change Handler', () => {
    it('invokes the handler with the correct payload when an option is selected', async () => {
      const user = userEvent.setup()

      renderComponent()

      const option = screen.getByTestId('plpfltr_link_fltr_price_swatch_enbld')
      await user.click(option)

      const payload = handleFilterChangeMock.mock.calls[0][0]
      expect(payload.eventLocation).toBe('filter bar')
      expect(payload.targetContent).toBe('$200-$300')
    })
  })
})

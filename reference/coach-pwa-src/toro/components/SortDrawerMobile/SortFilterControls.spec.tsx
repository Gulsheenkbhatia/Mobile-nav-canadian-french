import React from 'react'
import { cleanup, render, screen, waitFor } from 'test-utils/react'
import SortFilterControls from 'toro/components/SortDrawerMobile/SortFilterControls'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useAnalytics from 'toro/analytics/useAnalytics'
import usePreference from 'toro/hooks/usePreference_new'

import {
  currentSortAtom,
  defaultSortAtom,
  filtersAtom,
  searchResultsReloadingAtom,
  setRefinementsIdAtom,
  setSortingRuleAtom,
  sortOptionsAtom,
  totalProductsAtom,
  visibleRefinementsAtom,
  exposedFiltersAtom,
  focusedFilteringAtom,
} from 'store/search-results.atom'
import { isPlpV3Atom, onModelAtom } from 'store/plp.atom'
import useViewportType from 'toro/hooks/useViewportType'
import userEvent from '@testing-library/user-event'
import { addIconsAtom } from 'store/icons.atom'
import { REFINEMENT_TYPE } from 'toro/helpers/refinements'
import { SORT_OPTIONS, VISIBLE_REFINEMENTS } from 'test-utils/filterMockData'
import { useRefinementsToRender } from 'toro/hooks/useRefinementsToRender'

// Mock necessary hooks and functions
jest.mock('jotai/utils')
const mockedUseAtomValue = jest.mocked(useAtomValue)
const mockedUseUpdateAtom = jest.mocked(useUpdateAtom)

jest.mock('toro/analytics/useAnalytics')
const mockedUseAnalytics = jest.mocked(useAnalytics)

jest.mock('toro/hooks/usePreference_new')
const mockedUsePreference = jest.mocked(usePreference)

jest.mock('toro/hooks/useRefinementsToRender')
const mockedUseRefinementsToRender = jest.mocked(useRefinementsToRender)

jest.mock('next/router', () => {
  const push = jest.fn()
  return {
    useRouter: () => ({
      push,
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    }),
  }
})

jest.mock('toro/hooks/useViewportType')
jest.mocked(useViewportType).mockImplementation(() => ({ isDesktop: true, isMobile: false }))

jest.mock('toro/hooks/useExperiment', () => jest.fn())
jest.mock('toro/hooks/usePageType', () => jest.fn(() => ({ isPDP: false, isPLP: true })))
const FilterSortIcon = () => <svg data-testid="Filter-icon" />

const mockStyles = {
  FilterIcon: FilterSortIcon,
}
describe('SortFilterControls', () => {
  const setSortMock = jest.fn()
  const setReloadingMock = jest.fn()
  const sendAnalyticsMock = jest.fn()
  const handleOpenMock = jest.fn()
  const addIconsAtomMock = jest.fn()
  const setRefinementIdMock = jest.fn()
  const focusedFilteringMock = jest.fn()

  const renderOptions = {
    contexts: {
      PWAContext: {
        appData: {},
      },
      AnalyticsContext: {},
    },
  }

  beforeEach(() => {
    // Mock the atom values and update functions
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case filtersAtom:
          return []
        case sortOptionsAtom:
          return SORT_OPTIONS
        case currentSortAtom:
          return 'Option A'
        case defaultSortAtom:
          return 'optionA'
        case isPlpV3Atom:
          return false
        case onModelAtom:
          return { isOnModelPLPToggleEnabled: true }
        case totalProductsAtom:
          return 100
        case focusedFilteringAtom:
          return null
        default:
          return null
      }
    })

    mockedUseUpdateAtom.mockImplementation((atom) => {
      switch (atom) {
        case setSortingRuleAtom:
          return setSortMock
        case searchResultsReloadingAtom:
          return setReloadingMock
        case addIconsAtom:
          return addIconsAtomMock
        case setRefinementsIdAtom:
          return setRefinementIdMock
        case focusedFilteringAtom:
          return focusedFilteringMock
        default:
          return null
      }
    })

    mockedUseAnalytics.mockReturnValue({ send: sendAnalyticsMock })
    mockedUsePreference.mockReturnValue({ plpTemplateConfigurations: { sortTypeId: 'optionA' } })
    mockedUseRefinementsToRender.mockReturnValue([VISIBLE_REFINEMENTS[0]])

    Object.defineProperty(window.HTMLElement.prototype, 'scrollTo', {
      value: jest.fn(),
      writable: true,
    })
  })

  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should render, open filter and set sort correctly when clicked', async () => {
    const user = userEvent.setup()
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case visibleRefinementsAtom:
          return []
        case exposedFiltersAtom:
          return []
        case sortOptionsAtom:
          return SORT_OPTIONS
        case onModelAtom:
          return { isOnModelPLPToggleEnabled: true }
        case focusedFilteringAtom:
          return null
        default:
          return null
      }
    })
    render(
      <SortFilterControls
        styles={mockStyles}
        loading={false}
        handleOpen={handleOpenMock}
        isSrp={false}
      />,
      renderOptions
    )

    // Verify the SortFilterButton is rendered
    const filterSortButton = screen.getByText('Filter/Sort')
    expect(filterSortButton).toBeVisible()

    // Simulate clicking the Filter/Sort button
    await user.click(filterSortButton)
    expect(handleOpenMock).toHaveBeenCalledWith({ caption: 'filter sort' })

    // Verify that the sort option is rendered and clickable
    const sortOption = screen.getByText('Option A')
    expect(sortOption).toBeVisible()

    await user.click(sortOption)
    await waitFor(() => {
      expect(setSortMock).toHaveBeenCalledWith('optionA')
    })
  })

  it('should render price filter controls and handle reloading', async () => {
    const user = userEvent.setup()
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case sortOptionsAtom:
          return [
            { id: 'pmin', code: '15', name: '15' },
            { id: 'pmax', code: '150', name: '150' },
          ]
        case filtersAtom:
          return [{ id: 'pmin', code: '15', name: '15' }]
        case visibleRefinementsAtom:
          return []
        case exposedFiltersAtom:
          return []
        case currentSortAtom:
          return 'Price'
        case defaultSortAtom:
          return 'Price'
        case isPlpV3Atom:
          return false
        case onModelAtom:
          return { isOnModelPLPToggleEnabled: false }
      }
    })
    mockedUseRefinementsToRender.mockReturnValueOnce([
      {
        id: '1',
        name: 'Price',
        type: REFINEMENT_TYPE.PRICE,
        options: [],
      },
    ])
    mockedUsePreference.mockReturnValueOnce({ plpTemplateConfigurations: { sortTypeId: '15' } })

    render(
      <SortFilterControls
        styles={mockStyles}
        loading={false}
        handleOpen={handleOpenMock}
        isSrp={false}
      />,
      renderOptions
    )

    const filterSortButton = screen.getByText('Filter/Sort')
    expect(filterSortButton).toBeVisible()

    await user.click(filterSortButton)
    expect(handleOpenMock).toHaveBeenCalledWith({ caption: 'filter sort' })

    const sortOption = screen.getByText('Price')
    expect(sortOption).toBeVisible()

    await user.click(sortOption.parentElement)
    await user.click(screen.getByText('15').parentElement)

    await waitFor(() => {
      expect(setReloadingMock).toHaveBeenCalledWith(true)
    })
  })

  it('should handle click on sortOptions and trigger analytics', async () => {
    const user = userEvent.setup()
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case sortOptionsAtom:
          return SORT_OPTIONS
        case visibleRefinementsAtom:
          return []
        case exposedFiltersAtom:
          return []
        case currentSortAtom:
          return 'Option A'
        case defaultSortAtom:
          return 'optionB'
        case onModelAtom:
          return { isOnModelPLPToggleEnabled: true }
        case focusedFilteringAtom:
          return null
        default:
          return null
      }
    })
    mockedUsePreference.mockReturnValueOnce({ plpTemplateConfigurations: {} })

    render(
      <SortFilterControls
        styles={mockStyles}
        loading={false}
        handleOpen={handleOpenMock}
        isSrp={false}
      />,
      renderOptions
    )

    const filterSortButton = screen.getByText('Filter/Sort')
    expect(filterSortButton).toBeInTheDocument()

    await user.click(filterSortButton)
    expect(handleOpenMock).toHaveBeenCalledWith({ caption: 'filter sort' })

    const sortOption = screen.getByText('Option B')
    expect(sortOption).toBeInTheDocument()

    await user.click(sortOption)
    await waitFor(() => {
      expect(setSortMock).toHaveBeenCalledWith('optionB')
      expect(sendAnalyticsMock).toHaveBeenCalledWith('sort', {
        eventLocation: 'filter bar',
        eventAction: 'apply',
        sortOption: 'Option B',
      })
    })
  })

  it('should not render filter options when data is empty / null', () => {
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case filtersAtom:
          return []
        case sortOptionsAtom:
          return []
        case visibleRefinementsAtom:
          return []
        case exposedFiltersAtom:
          return []
        case onModelAtom:
          return { isOnModelPLPToggleEnabled: true }
        case focusedFilteringAtom:
          return null
        default:
          return null
      }
    })

    mockedUseUpdateAtom.mockImplementationOnce(() => {
      return null
    })

    mockedUseRefinementsToRender.mockReturnValueOnce([])

    mockedUsePreference.mockReturnValueOnce({ plpTemplateConfigurations: {} })

    render(
      <SortFilterControls
        styles={mockStyles}
        loading={false}
        handleOpen={handleOpenMock}
        isSrp={false}
      />,
      renderOptions
    )

    const filterSortButton = screen.getByText('Filter/Sort')
    expect(filterSortButton).toBeVisible()

    expect(screen.queryByText('Option A')).not.toBeInTheDocument()
    expect(screen.queryByText('Price')).not.toBeInTheDocument()
  })
})

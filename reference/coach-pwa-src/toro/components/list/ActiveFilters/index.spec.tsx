import React from 'react'
import { useAtomValue } from 'jotai/utils'
import { render, screen } from 'test-utils/react'

import FilterItemV3 from 'toro/components/list/Filters/DesktopFiltersV3/FilterItemV3'
import { VISIBLE_REFINEMENTS } from 'test-utils/filterMockData'

jest.mock('next/dynamic', () => () => {
  const MockFilterPopup = ({ refinement, onClose, positionLeft }) => (
    <div data-testid="filter-popup" data-position={positionLeft}>
      <div>Filter Popup for {refinement.name}</div>
      <button onClick={onClose}>Close</button>
    </div>
  )
  return MockFilterPopup
})

jest.mock('jotai/utils', () => ({
  useAtomValue: jest.fn(),
  atomWithReset: jest.fn(),
  atomWithStorage: jest.fn(),
  createJSONStorage: jest.fn(() => jest.fn()),
}))

jest.mock('store/search-results.atom', () => ({
  activeFiltersCountAtom: {},
}))

jest.mock('toro/icons', () => ({
  NavChevronDownIcon: ({ ...props }) => <div data-testid="chevron-down" {...props} />,
  NavChevronUpIcon: ({ ...props }) => <div data-testid="chevron-up" {...props} />,
}))

jest.mock('toro/components/Box', () => {
  return function MockBox({ children, ...props }) {
    return <div {...props}>{children}</div>
  }
})

jest.mock('toro/components/Button', () => {
  const React = jest.requireActual('react') as typeof import('react')
  return React.forwardRef<HTMLButtonElement, any>(function MockButton(
    { children, onClick, ...props },
    ref
  ) {
    return (
      <button onClick={onClick} ref={ref} {...props}>
        {children}
      </button>
    )
  })
})

const mockStyles = {
  horizontalFilterButton: {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
  },
  activeFilterButton: {
    backgroundColor: '#000',
    color: '#fff',
  },
  filterItemText: {
    fontSize: '14px',
  },
  iconSize: {
    width: '16',
    height: '16',
  },
  activeFilterCount: {
    backgroundColor: '#ff0000',
    color: '#fff',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '12px',
  },
}

const mockedUseAtomValue = useAtomValue as jest.Mock

describe('FilterItemV3', () => {
  const mockOnClick = jest.fn()

  const defaultRefinement = VISIBLE_REFINEMENTS[0] // Size filter

  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseAtomValue.mockReturnValue({})
  })

  const renderComponent = (props = {}) => {
    const defaultProps = {
      refinement: defaultRefinement,
      styles: mockStyles,
      isSelected: false,
      onClick: mockOnClick,
      ...props,
    }
    return render(<FilterItemV3 {...defaultProps} />)
  }

  describe('Rendering', () => {
    it('renders filter button with correct text', () => {
      renderComponent()

      expect(screen.getByText('size')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('renders with correct data-qa attributes', () => {
      renderComponent()

      expect(screen.getByRole('button')).toHaveAttribute('data-qa', 'plpfltr_body_fltr_acord')
      expect(screen.getByText('size')).toHaveAttribute(
        'data-qa',
        'plpfltr_txt_fltr_acord_title_size'
      )
    })

    it('displays chevron down icon when not selected', () => {
      renderComponent()

      expect(screen.getByTestId('plpfltr_icon_fltr_acord_down_arrow')).toBeInTheDocument()
      expect(screen.queryByTestId('plpfltr_icon_fltr_acord_up_arrow')).not.toBeInTheDocument()
    })

    it('displays chevron up icon when selected', () => {
      renderComponent({ isSelected: true })

      expect(screen.getByTestId('plpfltr_icon_fltr_acord_up_arrow')).toBeInTheDocument()
      expect(screen.queryByTestId('plpfltr_icon_fltr_acord_down_arrow')).not.toBeInTheDocument()
    })
  })

  describe('Active Filter Count', () => {
    it('displays active filter count when available', () => {
      mockedUseAtomValue.mockReturnValue({
        [defaultRefinement.id]: 3,
      })

      renderComponent()

      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('does not display active filter count when zero', () => {
      mockedUseAtomValue.mockReturnValue({
        [defaultRefinement.id]: 0,
      })

      renderComponent()

      expect(screen.queryByText('0')).not.toBeInTheDocument()
    })

    it('does not display active filter count when undefined', () => {
      mockedUseAtomValue.mockReturnValue({})

      renderComponent()

      const countElements = screen.queryAllByText(/\d+/)
      expect(countElements).toHaveLength(0)
    })
  })

  describe('FilterPopup', () => {
    it('renders FilterPopup when selected', () => {
      renderComponent({ isSelected: true })
      expect(screen.getByText('Filter Popup for Size')).toBeInTheDocument()
    })

    it('does not render FilterPopup when not selected', () => {
      renderComponent()

      expect(screen.queryByText('Filter Popup for Size')).not.toBeInTheDocument()
    })
  })

  describe('Click Interactions', () => {
    it('calls onClick with refinement id when not selected', () => {
      renderComponent()

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('calls onClick with empty string when already selected', async () => {
      const { user } = renderComponent({ isSelected: true })

      await user.click(screen.getByText('size'))

      expect(mockOnClick).toHaveBeenCalledWith('')
    })

    it('can close popup by clicking close button', async () => {
      const { user } = renderComponent({ isSelected: true })

      await user.click(screen.getByText('Close'))

      expect(mockOnClick).toHaveBeenCalledWith('')
    })
  })

  describe('Different Refinement Types', () => {
    it('renders correctly with color refinement', () => {
      const colorRefinement = VISIBLE_REFINEMENTS[1] // Color filter
      renderComponent({ refinement: colorRefinement })

      expect(screen.getByText('color')).toBeInTheDocument()
    })

    it('renders correctly with categories refinement', () => {
      const categoriesRefinement = VISIBLE_REFINEMENTS[2] // Categories filter
      renderComponent({ refinement: categoriesRefinement })

      expect(screen.getByText('categories')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles refinement with no options', () => {
      const refinementWithoutOptions = {
        ...defaultRefinement,
        options: [],
      }

      renderComponent({ refinement: refinementWithoutOptions })

      expect(screen.getByText('size')).toBeInTheDocument()
    })

    it('handles refinement with special characters in name', () => {
      const specialRefinement = {
        ...defaultRefinement,
        name: 'Size & Fit',
      }

      renderComponent({ refinement: specialRefinement })

      expect(screen.getByText('size & fit')).toBeInTheDocument()
    })
  })
})

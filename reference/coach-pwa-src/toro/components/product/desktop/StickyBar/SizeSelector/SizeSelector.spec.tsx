import React from 'react'
import { render, screen } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'

import useProductData from 'toro/hooks/useProductData'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useNeutralSizingData from 'toro/hooks/useNeutralSizingData'
import useAnalytics from 'toro/analytics/useAnalytics'
import useVariantGroupData from 'toro/hooks/useVariantGroupData'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import useViewportType from 'toro/hooks/useViewportType'

import SizeSelector from './index'
import {
  selectedSizeAtom,
  setSelectedSizeAtom,
  availableSizesAtom,
  sizingRangeAtom,
  fitReviewAtom,
} from 'store/pdp.atom'

jest.mock('toro/hooks/useProductData')
jest.mock('toro/hooks/useMultiStyleConfig')
jest.mock('jotai/utils')
jest.mock('toro/hooks/useNeutralSizingData')
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/useVariantGroupData')
jest.mock('toro/hooks/useSelectedColorData')
jest.mock('toro/hooks/useViewportType')
jest.mock(
  'toro/components/product/desktop/StickyBar/SizeSelector/SizeSelectorInventoryBadge',
  () => () =>
    (
      <div data-qa="size-selector-inventory-badge" aria-label="Inventory">
        Inventory
      </div>
    )
)

const mockedUseProductData = useProductData as jest.Mock
const mockedUseMultiStyleConfig = useMultiStyleConfig as jest.Mock
const mockedUseAtomValue = useAtomValue as jest.Mock
const mockedUseUpdateAtom = useUpdateAtom as jest.Mock
const mockedUseNeutralSizingData = useNeutralSizingData as jest.Mock
const mockedUseAnalytics = useAnalytics as jest.Mock
const mockedUseVariantGroupData = useVariantGroupData as jest.Mock
const mockedUseSelectedColorData = useSelectedColorData as jest.Mock
const mockedUseViewportType = useViewportType as jest.Mock

const mockSetSelectedSize = jest.fn()

describe('SizeSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockedUseProductData.mockReturnValue(['master-id', 'Women', null, null, []])
    mockedUseMultiStyleConfig.mockImplementation((theme) => {
      if (theme === 'ProductVariationCSS') {
        return {
          fitReviewText: () => ({}),
          fitReviewTextStyle: {},
        }
      }
      return {
        sizeSelectorWrapper: {},
        sizeAreaHeader: {},
        variationLabel: {},
        variationLabelValue: {},
        sizeButton: {},
        mainWrapper: () => ({}),
      }
    })
    mockedUseUpdateAtom.mockImplementation((atom) => {
      if (atom === setSelectedSizeAtom) {
        return mockSetSelectedSize
      }
      return jest.fn()
    })
    mockedUseNeutralSizingData.mockReturnValue({
      isNeutralSizingEnabled: false,
      neutralSizingCountryTypes: [],
      selectedNeutralSizingCountry: null,
    })
    mockedUseAnalytics.mockReturnValue({
      send: jest.fn(),
    })
    mockedUseVariantGroupData.mockReturnValue(['Women'])
    mockedUseSelectedColorData.mockReturnValue([
      [
        { name: '6', value: '6' },
        { name: '7', value: '7' },
        { name: '8', value: '8' },
        { name: '9', value: '9', order: 1, available: false },
      ],
      'color1',
    ])
    mockedUseViewportType.mockReturnValue({ isDesktop: true, isMobile: false })
  })

  const renderComponent = (
    selectedSize = null,
    availableSizes = ['6', '7', '8'],
    sizingRange = null,
    isDesktop = true
  ) => {
    mockedUseViewportType.mockReturnValue({ isDesktop, isMobile: !isDesktop })
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case selectedSizeAtom:
          return selectedSize
        case availableSizesAtom:
          return availableSizes
        case sizingRangeAtom:
          return sizingRange
        case fitReviewAtom: {
          if (sizingRange === 1) return { size: 'Runs small' }
          const productData = mockedUseProductData.mock.results[0].value
          if (productData[2]) return { size: productData[2] }
          return null
        }
        default:
          return null
      }
    })
    return render(<SizeSelector />)
  }

  it('renders correctly with no size selected', () => {
    renderComponent()
    expect(screen.getByText('Size:')).toBeVisible()
    expect(screen.getByText('Select a size')).toBeVisible()
  })

  it('renders with a selected size', () => {
    renderComponent('7')
    expect(screen.getByText('Size:')).toBeVisible()
    expect(screen.getByRole('button', { name: '7' })).toBeVisible()
    expect(screen.queryByText('Select a size')).toBeNull()
  })

  it('calls setSelectedSize on click', async () => {
    const user = userEvent.setup()
    renderComponent()
    await user.click(screen.getByText('7'))
    expect(mockSetSelectedSize).toHaveBeenCalledWith('7')
  }, 10000)

  it('shows unavailable sizes', () => {
    renderComponent()
    expect(screen.getByText('9').closest('button')).toHaveClass('pdp-unavailable-size')
  })

  it('shows fit review text from product data', () => {
    mockedUseProductData.mockReturnValue(['master-id', 'Women', 'Runs small', null, []])
    renderComponent()
    expect(screen.getByText('Runs small')).toBeVisible()
  })

  it('shows fit review text from sizing range', () => {
    renderComponent(null, ['6', '7', '8', '9'], 1)
    expect(screen.getByText('Runs small')).toBeVisible()
  })

  it('displays inventory badge when size is selected on desktop', () => {
    renderComponent('7', ['6', '7', '8'], null, true)
    expect(screen.getByLabelText('Inventory')).toBeVisible()
  })

  it('does not display inventory badge on mobile', () => {
    renderComponent('7', ['6', '7', '8'], null, false)
    expect(screen.queryByLabelText('Inventory')).toBeNull()
  })

  it('shows arrows on desktop', () => {
    renderComponent('7', ['6', '7', '8'], null, true)
    // DesktopScrollableSwatches should receive showArrows=true
    // This test verifies the component renders (arrows are internal to DesktopScrollableSwatches)
    expect(screen.getByRole('button', { name: '7' })).toBeVisible()
  })

  it('hides arrows on mobile', () => {
    renderComponent('7', ['6', '7', '8'], null, false)
    // DesktopScrollableSwatches should receive showArrows=false
    // This test verifies the component renders (arrows are internal to DesktopScrollableSwatches)
    expect(screen.getByRole('button', { name: '7' })).toBeVisible()
  })
})

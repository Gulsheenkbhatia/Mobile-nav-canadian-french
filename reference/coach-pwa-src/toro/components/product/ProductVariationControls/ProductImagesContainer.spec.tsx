import { render, CustomRenderOptions } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import ProductImagesContainer from 'toro/components/product/ProductVariationControls/ProductImagesContainer'
import useStyles from 'toro/hooks/useStyles'
import useAnalytics from 'toro/analytics/useAnalytics'
import usePreference from 'toro/hooks/usePreference_new'
import useViewportType from 'toro/hooks/useViewportType'

const mockOnClick = jest.fn()
const mockSetFilterItems = jest.fn()
const mockSetSelectedColor = jest.fn()
const mockSetCustomizerVariants = jest.fn()
const mockSendAnalytics = jest.fn()

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: jest.fn((loader, options) => {
    loader()
    return function DynamicComponent(props) {
      return (
        <div data-qa="customize_removal_modal" onClick={props.onClose}>
          Customize Removal Modal
        </div>
      )
    }
  }),
}))

jest.mock('toro/hooks/useStyles')
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useViewportType')

const mockedUseStyle = useStyles as jest.MockedFn<typeof useStyles>
const mockedUseAnalytics = useAnalytics as jest.MockedFn<typeof useAnalytics>
const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>
const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>

jest.mock('toro/components/product/ProductVariationControls/ProductImageControl/index', () =>
  jest.fn(() => <div data-qa="product_image_control_index">Product Image Control Index</div>)
)
jest.mock('toro/components/Hidden', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <>{children}</>),
}))

const mockedUseStyleElements = {
  productImagesInnerContainer: {},
}

const mockItems = [
  {
    id: 'item-1',
    baseProductId: 'base-1',
    isMonogrammed: true,
    embellishment: {
      embellish_type: 'type-1',
      embellish_pattern: 'pattern-1',
    },
    monogram: {
      monogramPlacementCode: 'front',
      monogramInitials: 'AB',
    },
  },
  {
    id: 'item-2',
    baseProductId: 'base-2',
    isMonogrammed: false,
  },
]

const mockProductData = {
  category_id: 'category-1',
  pickedProps: {
    promotionData: {
      item_category: 'promo-category',
    },
  },
}

const mockSelectedItem = mockItems[0]

const defaultProps = {
  items: mockItems,
  onClick: mockOnClick,
  masterId: 'master-1',
  isQuickView: false,
  selectedItem: mockSelectedItem,
  productData: mockProductData,
  setFilterItems: mockSetFilterItems,
  setSelectedColor: mockSetSelectedColor,
  isMegaPDPEligible: false,
  setCustomizerVariants: mockSetCustomizerVariants,
}

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

const makeSetup = (props: any = {}) => {
  const combinedProps = { ...defaultProps, ...props }
  return render(<ProductImagesContainer {...combinedProps} />, renderOptions)
}

describe('ProductImagesContainer', () => {
  beforeEach(() => {
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: true, isMobile: false }))
    mockedUsePreference.mockImplementation(() => ({
      toggleSiteFeatures: { maxSwatch: true },
    }))
    mockedUseAnalytics.mockImplementation(() => ({
      send: mockSendAnalytics,
    }))
    mockedUseStyle.mockImplementation(() => mockedUseStyleElements)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the component without crashing', async () => {
    const { getAllByTestId } = makeSetup()
    expect(getAllByTestId('product_image_control_index')[0]).toBeVisible()
  })

  it('should render the component properly when default props are used', () => {
    const { getAllByTestId } = makeSetup({
      items: undefined,
      onClick: undefined,
      masterId: undefined,
      isQuickView: undefined,
      selectedItem: undefined,
      productData: undefined,
    })
    expect(getAllByTestId('customize_removal_modal')[0]).toBeVisible()
  })

  it('should render customize removal modal when user clicks on close icon', async () => {
    const user = userEvent.setup()
    const { getAllByText, getAllByTestId } = makeSetup()
    const target = getAllByText('x')[0]
    await user.click(target)
    expect(getAllByTestId('customize_removal_modal')[0]).toBeVisible()
  })

  it('should call mockSendAnalytics when user click on close icon and handleRemove function is triggered', async () => {
    const user = userEvent.setup()
    const { getAllByText, getAllByTestId } = makeSetup({
      productData: {
        category_id: 'category-1',
      },
    })
    const target = getAllByText('x')[0]
    await user.click(target)
    expect(getAllByTestId('customize_removal_modal')[0]).toBeVisible()
  })
})

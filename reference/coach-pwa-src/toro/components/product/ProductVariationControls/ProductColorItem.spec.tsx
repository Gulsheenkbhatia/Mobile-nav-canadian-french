import { render, CustomRenderOptions } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import ProductColorItem from 'toro/components/product/ProductVariationControls/ProductColorItem'
import ProductImagesControlContext from 'toro/components/product/ProductVariationControls/ProductImagesControlContext'
import useAnalytics from 'toro/analytics/useAnalytics'
import useStyles from 'toro/hooks/useStyles'
import useViewportType from 'toro/hooks/useViewportType'

jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/useStyles')
jest.mock('toro/hooks/useViewportType')
jest.mock('lodash/get')
jest.mock('./ProductImageControl', () => ({
  __esModule: true,
  default: jest.fn((props) => (
    <div data-qa="product_image_control" onClick={props.onClick}>
      Product Image Control
    </div>
  )),
}))

const mockedUseAnalytics = useAnalytics as jest.MockedFn<typeof useAnalytics>
const mockedUseStyles = useStyles as jest.MockedFn<typeof useStyles>
const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>

const baseItem = {
  vgId: 'vg123',
  text: 'Red',
  orderable: true,
  media: {
    thumbnail: {
      src: 'thumbnail.jpg',
      alt: 'Red thumbnail',
    },
  },
  image: {
    src: 'image.jpg',
  },
  id: 'prod123',
}

const monogrammedItem = {
  ...baseItem,
  isCustomized: false,
  isMonogrammed: true,
  monogram: {
    monogramFontName: 'Arial',
    monogramInitialsHtml: '<div>ABC</div>',
  },
}

const setCustomizerVariantsMock = jest.fn()
const onClickMock = jest.fn()
const handleRemoveMock = jest.fn()

const contextValues = {
  setCustomizerVariants: setCustomizerVariantsMock,
  isQuickView: false,
  isMegaPDPEligible: false,
  onClick: onClickMock,
  handleRemove: handleRemoveMock,
  maxSwatch: 5,
  isShowMore: false,
  masterId: 'master123',
}

const defaultProps = {
  item: baseItem,
  selected: false,
  isSameParent: false,
  idx: 0,
}

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}
const makeSetup = (contextValueOverride?: any, props?: any) => {
  const combinedProps = { ...defaultProps, ...props }
  const mergedContextValue = {
    ...contextValues,
    ...contextValueOverride,
  }
  return render(
    <ProductImagesControlContext.Provider value={mergedContextValue}>
      <ProductColorItem {...combinedProps} />
    </ProductImagesControlContext.Provider>,
    renderOptions
  )
}

const mockSendAnalytics = jest.fn()

describe('ProductColorItem', () => {
  beforeEach(() => {
    mockedUseAnalytics.mockImplementation(() => ({
      send: mockSendAnalytics,
    }))
    mockedUseStyles.mockReturnValue({
      closeIconContainer: {},
    })
    mockedUseViewportType.mockImplementation(() => ({ isMobile: false }))
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the component with correct props for base item', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('product_image_control')).toBeVisible()
  })

  it('should call onClick function when user clicks on product image control', async () => {
    const user = userEvent.setup()
    const { getByTestId } = makeSetup()
    const target = getByTestId('product_image_control')
    await user.click(target)
    expect(onClickMock).toHaveBeenCalled()
  })

  it('should call send analytics function when user clicks on product image control and mega pdp is eligible', async () => {
    const user = userEvent.setup()
    const { getByTestId } = makeSetup(
      { isMegaPDPEligible: true },
      { item: { text: undefined, vgId: undefined } }
    )
    const target = getByTestId('product_image_control')
    await user.click(target)
    expect(mockSendAnalytics).toHaveBeenCalled()
  })

  it('should render the component properly when isMobile is true', () => {
    mockedUseViewportType.mockImplementation(() => ({ isMobile: true }))
    const { getByTestId } = makeSetup()
    expect(getByTestId('product_image_control')).toBeVisible()
  })

  it('should render the component properly when item is monogrammed', () => {
    const { getByTestId } = makeSetup({}, { item: monogrammedItem })
    expect(getByTestId('product_image_control')).toBeVisible()
  })

  it('should call handleRemove when user clicks on close icon', async () => {
    const user = userEvent.setup()
    const { getByText } = makeSetup({}, { item: monogrammedItem })
    const target = getByText('x')
    await user.click(target)
    expect(handleRemoveMock).toHaveBeenCalled()
  })

  it('should render the component properly when isShowMore is true', () => {
    const { getByTestId } = makeSetup({ isShowMore: true }, {})
    expect(getByTestId('product_image_control')).toBeVisible()
  })
})

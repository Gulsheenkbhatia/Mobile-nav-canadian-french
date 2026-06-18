import { render, CustomRenderOptions } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import ProductMaterialControl from 'toro/components/product/ProductVariationControls/ProductMaterialControl'
import useAnalytics from 'toro/analytics/useAnalytics'

jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/components/product/ProductVariationControls/ProductSizeControl', () => ({
  __esModule: true,
  default: jest.fn(({ text, selected, onClick }) => (
    <button data-qa="product_size_control" onClick={onClick} aria-pressed={selected}>
      {text}
    </button>
  )),
}))

const mockedUseAnalytics = useAnalytics as jest.MockedFn<typeof useAnalytics>

const setFullscreenLoadingMock = jest.fn()
const setSelectedMaterialMock = jest.fn()
const mockSendAnalytics = jest.fn()

const defaultProps = {
  item: { materialName: 'Cotton', firstURL: '/cotton' },
  setFullscreenLoading: setFullscreenLoadingMock,
  selectedMaterial: { materialName: 'COTTON' },
  selectedColor: { materialName: 'cotton', vgId: 'vg1' },
  setSelectedMaterial: setSelectedMaterialMock,
  idx: 0,
  productId: '12345',
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
  return render(<ProductMaterialControl {...combinedProps} />, renderOptions)
}

describe('ProductMaterialControl', () => {
  beforeEach(() => {
    mockedUseAnalytics.mockImplementation(() => ({
      send: mockSendAnalytics,
    }))
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the component with default props without crashing', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('product_size_control')).toBeVisible()
  })

  it('should call setSelectedMaterial and analytics.send when user clicks on size control', async () => {
    const user = userEvent.setup()
    const { getByTestId } = makeSetup()
    const target = getByTestId('product_size_control')
    await user.click(target)
    expect(setSelectedMaterialMock).toHaveBeenCalledWith(defaultProps.item)
    expect(mockSendAnalytics).toHaveBeenCalledWith('swatchInteraction', {
      eventAction: 'swatch click',
      eventLabel: '12345',
      eventLocation: 'mega product',
      swatchType: 'material',
      swatchValue: 'Cotton',
      swatchVariant: 'vg1',
    })
  })

  it('should call setSelectedMaterial and analytics.send when user clicks on size control and item.materialName and selectedColor.vgId is not present', async () => {
    const user = userEvent.setup()
    const { getByTestId } = makeSetup({
      item: { firstURL: '/cotton' },
      selectedColor: { materialName: 'COTTON' },
    })
    const target = getByTestId('product_size_control')
    await user.click(target)
    expect(setSelectedMaterialMock).toHaveBeenCalledWith({ firstURL: '/cotton' })
    expect(mockSendAnalytics).toHaveBeenCalledWith('swatchInteraction', {
      eventAction: 'swatch click',
      eventLabel: '12345',
      eventLocation: 'mega product',
      swatchType: 'material',
      swatchValue: 'undefined',
      swatchVariant: 'undefined',
    })
  })

  it('should render the component properly when selectedColor material does not match item material', () => {
    const { getByTestId } = makeSetup({
      selectedColor: { materialName: 'Silk', vgId: 'vg2' },
      selectedMaterial: { materialName: 'Silk' },
    })
    expect(getByTestId('product_size_control')).toBeVisible()
  })

  it('should call setFullscreenLoading when user clicks on link', async () => {
    const user = userEvent.setup()
    const { getByTestId } = makeSetup({
      selectedColor: { materialName: 'Silk', vgId: 'vg2' },
      selectedMaterial: { materialName: 'Silk' },
    })
    const target = getByTestId('product_size_control')
    await user.click(target)
    expect(setFullscreenLoadingMock).toHaveBeenCalledWith(true)
  })
})

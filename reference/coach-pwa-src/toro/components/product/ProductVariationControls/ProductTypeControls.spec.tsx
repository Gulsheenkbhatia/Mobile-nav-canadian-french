import { render, CustomRenderOptions } from 'test-utils/react'
import ProductTypeControls from 'toro/components/product/ProductVariationControls/ProductTypeControls'

jest.mock('toro/components/product/ProductVariationControls/ProductSizeControls', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-qa="product_size_controls">ProductSizeControls</div>),
}))

const defaultProps = {
  masterId: 'master123',
  attrName: 'Height',
  associatedValues: [
    { label: 'Short', value: 'short' },
    { label: 'Regular', value: 'regular' },
    { label: 'Tall', value: 'tall' },
  ],
  isSticky: false,
  variantDataList: [
    { value: 'short', isAvailable: true },
    { value: 'regular', isAvailable: true },
    { value: 'tall', isAvailable: false },
  ],
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
  return render(<ProductTypeControls {...combinedProps} />, renderOptions)
}

describe('ProductTypeControls', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the component with default props without crashing', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('product_size_controls')).toBeVisible()
  })

  it('should not render ProductSizeControls when isSticky is true', () => {
    const { queryByTestId } = makeSetup({ isSticky: true })
    expect(queryByTestId('product_size_controls')).not.toBeInTheDocument()
  })

  it('should render the component without crashing when variationDataList is undefined', () => {
    const { queryByTestId } = makeSetup({ variantDataList: undefined })
    expect(queryByTestId('product_size_controls')).toBeVisible()
  })
})

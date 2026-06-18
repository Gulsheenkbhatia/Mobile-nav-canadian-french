import { render, CustomRenderOptions } from 'test-utils/react'
import ProductMaterialControls from 'toro/components/product/ProductVariationControls/ProductMaterialControls'

jest.mock('toro/components/product/ProductVariationControls/ProductVariationLabel', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-qa="product_variation_label">ProductVariationLabel</div>),
}))
jest.mock(
  'toro/components/product/ProductVariationControls/AlignedControlsContainer',
  () =>
    ({ children }: any) =>
      <div>{children}</div>
)
jest.mock('toro/components/product/ProductVariationControls/ProductMaterialControl', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-qa="product_variation_control">ProductMaterialControl</div>),
}))
jest.mock('@emotion/react', () => {
  const actual = jest.requireActual('@emotion/react')
  return {
    ...actual,
    keyframes: (...args: any[]) => {
      return 'keyframes'
    },
    useTheme: () => ({
      space: { s: 8 },
    }),
  }
})

const defaultProps = {
  selectedMaterial: { materialName: 'Cotton' },
  setSelectedMaterial: jest.fn(),
  isSticky: false,
  materialList: [
    { materialName: 'Cotton', materialId: 'm1' },
    { materialName: 'Silk', materialId: 'm2' },
  ],
  setFullscreenLoading: jest.fn(),
  megaPdpAttrDisplayName: 'Fabric',
  selectedColor: { colorName: 'Red', colorId: 'c1' },
  productId: 'p123',
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
  return render(<ProductMaterialControls {...combinedProps} />, renderOptions)
}

describe('ProductMaterialControls', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the component with default props without crashing', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('product_variation_label')).toBeVisible()
  })
})

import { render, CustomRenderOptions } from 'test-utils/react'
import ProductImagesControl from 'toro/components/product/ProductVariationControls/ProductImagesControl'
import ProductImagesControlContext from 'toro/components/product/ProductVariationControls/ProductImagesControlContext'
import { useUpdateAtom } from 'jotai/utils'

jest.mock('jotai/utils')

const mockSetFullScreenLoading = jest.fn()
const mockUseUpdateAtom = useUpdateAtom as jest.MockedFn<typeof useUpdateAtom>

jest.mock('next/dynamic', () => (fn) => {
  fn().then(() => jest.fn(() => <div data-qa="show_more_less_control" />))
  return function DynamicComponent() {
    return <div data-qa="show_more_les_control" />
  }
})
jest.mock('toro/components/product/ProductVariationControls/ProductColorItem', () => ({ item }) => (
  <div data-qa="product_color">{item.id}</div>
))
jest.mock(
  'toro/components/Hidden',
  () =>
    ({ children, onMobile }) =>
      onMobile ? null : <>{children}</>
)

const baseItems = [
  { id: '1', masterId: 'parent1', vgId: 'vg1', url: '/item1' },
  { id: '2', masterId: 'parent1', vgId: 'vg2', url: '/item2' },
  { id: '3', masterId: 'parent2', vgId: 'vg3', url: '/item3' },
]
const selectedItem = { id: '1', masterId: 'parent1' }
const mockSetShowMore = jest.fn()
const contextValue = {
  items: baseItems,
  selectedItem,
  isMegaPDPEligible: true,
  isQuickView: true,
  isShowMore: false,
  setShowMore: mockSetShowMore,
  maxSwatch: 3,
}

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

const makeSetup = (contextValueOverride?: any) => {
  const mergedContextValue = {
    ...contextValue,
    ...contextValueOverride,
  }

  return render(
    <ProductImagesControlContext.Provider value={mergedContextValue}>
      <ProductImagesControl />
    </ProductImagesControlContext.Provider>,
    renderOptions
  )
}

describe('ProductImagesControl', () => {
  beforeEach(() => {
    mockUseUpdateAtom.mockReturnValue(mockSetFullScreenLoading)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the component without crashing', () => {
    const { getAllByTestId } = makeSetup()
    expect(getAllByTestId('product_color')[0]).toBeVisible()
  })

  it('should render the component without crashing when isQuickView is false', () => {
    const { getAllByTestId } = makeSetup({ isQuickView: false })
    expect(getAllByTestId('product_color')[0]).toBeVisible()
  })

  it('should render the component without crashing when isMegaPDPEligible is false', () => {
    const { getAllByTestId } = makeSetup({ isMegaPDPEligible: false })
    expect(getAllByTestId('product_color')[0]).toBeVisible()
  })
})

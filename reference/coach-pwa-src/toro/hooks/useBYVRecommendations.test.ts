import { renderHook, waitFor } from 'test-utils/react'
import { useAtomValue } from 'jotai/utils'
import useBYVRecommendations from './useBYVRecommendations'
import { XgenContainerID } from 'toro/lib/xgen/types'

const mockGetRaw = jest.fn()
const mockSetContext = jest.fn()

const mockXgenClient = {
  recommendations: {
    getRaw: mockGetRaw,
    setContext: mockSetContext,
    exposeAdapter: jest.fn(() => ({ build: () => [] })),
  },
}

jest.mock('jotai/utils')
jest.mock('toro/analytics/useRecommAnalytics', () => ({
  __esModule: true,
  default: jest.fn(() => ({ addImpression: jest.fn(), selectRecommItem: jest.fn() })),
}))
jest.mock('store/xgen.atom', () => ({ xgenClientAtom: 'xgenClientAtom' }))
jest.mock('store/because-you-viewed-products.atom', () => ({
  mostViewedProductAtom: 'mostViewedProductAtom',
}))
jest.mock('store/search-results.atom', () => ({ activeFiltersAtom: 'activeFiltersAtom' }))

const mockedUseAtomValue = jest.mocked(useAtomValue)

const makeContainer = (
  itemCount = 3,
  containerId: XgenContainerID = XgenContainerID.sm_el_sitevisit1
) => ({
  containerId,
  display: true,
  strategyId: 'strategy-123',
  containerDisplayName: 'Because You Viewed',
  explanation: 'Because You Viewed',
  items: Array.from({ length: itemCount }, (_, i) => ({
    id: `prod-${i}`,
    name: `Product ${i}`,
    price: { fullPrice: 100 },
    detailUrl: `https://www.example.com/products/prod-${i}`,
    imageUrl: `https://img/${i}.jpg`,
    availability: 5,
    variationId: `var-${i}`,
    isSized: false,
  })),
})

const makeRaw = (
  itemCount = 3,
  containerId: XgenContainerID = XgenContainerID.sm_el_sitevisit1
) => ({
  containers: [makeContainer(itemCount, containerId)],
})

const setupAtoms = (overrides: Record<string, unknown> = {}) => {
  const atoms: Record<string, unknown> = {
    xgenClientAtom: mockXgenClient,
    mostViewedProductAtom: { vgId: 'vg-001', count: 2 },
    activeFiltersAtom: [],
    ...overrides,
  }
  mockedUseAtomValue.mockImplementation((atom: any) => atoms[atom] ?? null)
}

beforeEach(() => {
  jest.clearAllMocks()
  mockSetContext.mockResolvedValue(undefined)
})

describe('useBYVRecommendations', () => {
  it('splits items: items[0] → referenceProduct, items[1+] → carousel tiles', async () => {
    mockGetRaw.mockResolvedValue(makeRaw(3))
    setupAtoms()
    const { result } = renderHook(() => useBYVRecommendations())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.referenceProduct?.ID).toBe('prod-0')
    expect(result.current.products).toHaveLength(2)
    expect(result.current.products[0].ID).toBe('prod-1')
    expect(result.current.display).toBe(true)
  })

  it('appends ?rrec=true to detailURL on all products to trigger scroll-to-top on back nav', async () => {
    mockGetRaw.mockResolvedValue(makeRaw(3))
    setupAtoms()
    const { result } = renderHook(() => useBYVRecommendations())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.referenceProduct?.detailURL).toContain('?rrec=true')
    result.current.products.forEach((product) => {
      expect(product.detailURL).toContain('?rrec=true')
    })
  })

  it('display is false when only reference product returned — no tiles', async () => {
    mockGetRaw.mockResolvedValue(makeRaw(1))
    setupAtoms()
    const { result } = renderHook(() => useBYVRecommendations())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.display).toBe(false)
    expect(result.current.products).toHaveLength(0)
  })

  it('eyebrowLabel is populated from XGen explanation field', async () => {
    mockGetRaw.mockResolvedValue(makeRaw())
    setupAtoms()
    const { result } = renderHook(() => useBYVRecommendations())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.eyebrowLabel).toBe('Because You Viewed')
  })

  it('sets mostViewedProd context when count > 1 and always resets it after fetch', async () => {
    mockGetRaw.mockResolvedValue(makeRaw())
    setupAtoms()
    renderHook(() => useBYVRecommendations())
    await waitFor(() => expect(mockSetContext).toHaveBeenCalledWith({ mostViewedProd: undefined }))

    expect(mockSetContext).toHaveBeenCalledWith({ mostViewedProd: 'vg-001' })
    expect(mockSetContext).toHaveBeenCalledWith({ mostViewedProd: undefined })
  })

  it('skips mostViewedProd context when count <= 1 but still resets', async () => {
    mockGetRaw.mockResolvedValue(makeRaw())
    setupAtoms({ mostViewedProductAtom: { vgId: 'vg-001', count: 1 } })
    renderHook(() => useBYVRecommendations())
    await waitFor(() => expect(mockSetContext).toHaveBeenCalledWith({ mostViewedProd: undefined }))

    expect(mockSetContext).not.toHaveBeenCalledWith({ mostViewedProd: 'vg-001' })
    expect(mockSetContext).toHaveBeenCalledWith({ mostViewedProd: undefined })
  })

  it('skips fetch and returns display:false when active filters are applied', async () => {
    setupAtoms({ activeFiltersAtom: [{ id: 'color', label: 'Red' }] })
    const { result } = renderHook(() => useBYVRecommendations())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(mockGetRaw).not.toHaveBeenCalled()
    expect(result.current.display).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('returns display:false when XGen client is unavailable', async () => {
    setupAtoms({ xgenClientAtom: null })
    const { result } = renderHook(() => useBYVRecommendations())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.display).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('returns display:false when getRaw throws', async () => {
    mockGetRaw.mockRejectedValue(new Error('network error'))
    setupAtoms()
    const { result } = renderHook(() => useBYVRecommendations())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.display).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('returns display:false when response contains no matching container', async () => {
    mockGetRaw.mockResolvedValue({ containers: [] })
    setupAtoms()
    const { result } = renderHook(() => useBYVRecommendations())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.display).toBe(false)
  })

  it('exposes addImpression and selectRecommItem for analytics', async () => {
    mockGetRaw.mockResolvedValue(makeRaw())
    setupAtoms()
    const { result } = renderHook(() => useBYVRecommendations())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(typeof result.current.addImpression).toBe('function')
    expect(typeof result.current.selectRecommItem).toBe('function')
  })

  it('stays in loading state and skips fetch when enabled is false', async () => {
    setupAtoms()
    const { result } = renderHook(() =>
      useBYVRecommendations(XgenContainerID.sm_el_sitevisit1, { enabled: false })
    )

    expect(result.current.isLoading).toBe(true)
    expect(mockGetRaw).not.toHaveBeenCalled()
  })

  it('fetches once enabled transitions from false to true', async () => {
    mockGetRaw.mockResolvedValue(makeRaw())
    setupAtoms()
    let enabled = false
    const { result, rerender } = renderHook(() =>
      useBYVRecommendations(XgenContainerID.sm_el_sitevisit1, { enabled })
    )

    expect(mockGetRaw).not.toHaveBeenCalled()
    enabled = true
    rerender()
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(mockGetRaw).toHaveBeenCalledTimes(1)
    expect(result.current.display).toBe(true)
  })

  it('uses sm_el_sitevisit1 by default when no containerId is provided', async () => {
    mockGetRaw.mockResolvedValue(makeRaw())
    setupAtoms()
    const { result } = renderHook(() => useBYVRecommendations())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(mockGetRaw).toHaveBeenCalledWith('sm_el_sitevisit1')
    expect(result.current.vendorScheme).toBe('sm_el_sitevisit1')
  })

  it('fetches from sm_el_sitevisit2 when PDP containerId is provided', async () => {
    mockGetRaw.mockResolvedValue(makeRaw(3, XgenContainerID.sm_el_sitevisit2))
    setupAtoms()
    const { result } = renderHook(() => useBYVRecommendations(XgenContainerID.sm_el_sitevisit2))
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(mockGetRaw).toHaveBeenCalledWith('sm_el_sitevisit2')
    expect(result.current.vendorScheme).toBe('sm_el_sitevisit2')
    expect(result.current.display).toBe(true)
  })
})

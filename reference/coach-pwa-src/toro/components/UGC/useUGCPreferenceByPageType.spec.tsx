import { renderHook } from 'test-utils/react'
import { waitFor } from '@testing-library/react'
import fetch from 'toro/helpers/fetch'
import usePreference from 'toro/hooks/usePreference_new'
import useUGCPreferenceByPageType, {
  type UseUGCPreferenceProps,
} from './useUGCPreferenceByPageType'

jest.mock('toro/helpers/fetch')
jest.mock('toro/hooks/usePreference_new')

const mockUsePreference = usePreference as jest.MockedFunction<typeof usePreference>
const mockFetch = fetch as jest.MockedFunction<typeof fetch>
const mockResponse = {
  json: jest.fn().mockResolvedValue({
    total_results: 1,
    _embedded: { 'ugc:item': [{ id: 1, image_url: 'https://example.com/image.jpg' }] },
  }),
}
describe('useUGCPreferenceByPageType', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const initialPreferences = {
    wyng: {
      isEnableWyngOnHomePage: true,
      enableWyng: true,
      isEnableWyngOnPdpPage: true,
      isEnableWyngOnPlpPage: true,
      wyngFilterUUID: '1234567',
      isEnableViewGalleryCTA: true,
    },
    pixleeUgc: {
      enablePixleeUGC: true,
      pixleeUGCAlbumID: '12345',
      enablePixleeUGCHome: true,
      enableViewGalleryCTA: true,
      enablePixleeUGCPlp: true,
      enablePixleeUGCPdp: true,
    },
  }
  const inputArguments: UseUGCPreferenceProps = {
    pageType: 'home',
    externalId: '',
    categoryWyngFilterUUID: '',
    pageSize: 10,
    images: [],
    imagesCount: 0,
    enabled: true,
    emplifiVPC: '',
    pixleeAlbumID: '12345',
  }

  it('should create url for wyng service', async () => {
    mockUsePreference.mockReturnValue({
      ...initialPreferences,
      ...{ pixleeUgc: { enablePixleeUGC: false } },
    })
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)
    const { result } = renderHook(() => useUGCPreferenceByPageType(inputArguments))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.apiUrl).toBe(
      '/api/get-wyng-content?wyngFilterUUID=1234567&page=1&pagesize=10'
    )
  })
  it('should create url for pixlee service', async () => {
    mockUsePreference.mockReturnValue(initialPreferences)
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)
    const { result } = renderHook(() => useUGCPreferenceByPageType(inputArguments))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.apiUrl).toBe(
      '/api/get-pixlee-ugc?ids=12345&page=1&pagesize=10&pageType=home'
    )
  })
  it('should add query skuid to url', async () => {
    mockUsePreference.mockReturnValue(initialPreferences)
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)
    const { result } = renderHook(() =>
      useUGCPreferenceByPageType({ ...inputArguments, pageType: 'pdp', emplifiVPC: '777' })
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.apiUrl).toContain('skuid=777')
  })
  it('should add query wyngFilterUUID to url', async () => {
    mockUsePreference.mockReturnValue({
      ...initialPreferences,
      ...{ pixleeUgc: { enablePixleeUGC: false } },
    })
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)
    const { result } = renderHook(() =>
      useUGCPreferenceByPageType({
        ...inputArguments,
        pageType: 'plp',
        categoryWyngFilterUUID: '99999',
      })
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.apiUrl).toContain('wyngFilterUUID=9999')
  })

  it('should use page album first and pageType=home for outlet-style CLP when home Pixlee is on', async () => {
    mockUsePreference.mockReturnValue({
      ...initialPreferences,
      pixleeUgc: {
        ...initialPreferences.pixleeUgc,
        pixleeUGCAlbumID: '',
        enablePixleeUGCHome: true,
        enablePixleeUGCPlp: true,
      },
    })
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)
    const { result } = renderHook(() =>
      useUGCPreferenceByPageType({
        ...inputArguments,
        pageType: 'home',
        pixleeAlbumID: '71005983',
      })
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.apiUrl).toBe(
      '/api/get-pixlee-ugc?ids=71005983&page=1&pagesize=10&pageType=home'
    )
  })

  it('should prefer category Wyng UUID when home Wyng is on and category UUID is passed', async () => {
    mockUsePreference.mockReturnValue({
      ...initialPreferences,
      pixleeUgc: { enablePixleeUGC: false },
      wyng: {
        ...initialPreferences.wyng,
        isEnableWyngOnHomePage: true,
        wyngFilterUUID: 'pref-wyng-uuid',
      },
    })
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)
    const { result } = renderHook(() =>
      useUGCPreferenceByPageType({
        ...inputArguments,
        pageType: 'home',
        categoryWyngFilterUUID: 'category-only-uuid',
      })
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.apiUrl).toBe(
      '/api/get-wyng-content?wyngFilterUUID=category-only-uuid&page=1&pagesize=10'
    )
  })

  it('should use category Wyng UUID for pageType=home when pref home UUID is empty (outlet HP on CLP)', async () => {
    mockUsePreference.mockReturnValue({
      ...initialPreferences,
      pixleeUgc: { enablePixleeUGC: false },
      wyng: {
        ...initialPreferences.wyng,
        wyngFilterUUID: '',
        isEnableWyngOnHomePage: true,
        isEnableWyngOnPlpPage: true,
      },
    })
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)
    const { result } = renderHook(() =>
      useUGCPreferenceByPageType({
        ...inputArguments,
        pageType: 'home',
        categoryWyngFilterUUID: 'outlet-wyng-uuid',
      })
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.apiUrl).toBe(
      '/api/get-wyng-content?wyngFilterUUID=outlet-wyng-uuid&page=1&pagesize=10'
    )
  })
})

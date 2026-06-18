import { renderHook } from 'test-utils/react'
import usePreference from 'toro/hooks/usePreference_new'
import useTemplate from 'toro/hooks/useTemplate'
import useMonetateTrack from 'toro/hooks/useMonetateTrack'

const mockedUsePreference = jest.mocked(usePreference)
const mockedUseTemplate = jest.mocked(useTemplate)

jest.mock('jotai/utils')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useTemplate')

const addProductsMock = [{ productId: '12345' }]

describe('toro/hooks/useMonetateTrack.ts', () => {
  beforeEach(() => {
    window.monetateQ = undefined
    mockedUseTemplate.mockReturnValue(false)
  })

  it('Does not track when disabled via BM preference', () => {
    mockedUsePreference.mockImplementationOnce(() => ({
      toggleSiteFeatures: {
        enableMonetate: false,
      },
    }))
    renderHook(() => useMonetateTrack({ pageType: 'HP', isEnabled: true }))
    expect(window.monetateQ).toBeUndefined()
  })

  beforeAll(() => {
    mockedUsePreference.mockImplementation(() => ({
      toggleSiteFeatures: {
        enableMonetate: true,
      },
    }))
  })

  it('Does not track when disabled imperatively', () => {
    renderHook(() => useMonetateTrack({ pageType: 'HP', isEnabled: false }))
    expect(window.monetateQ).toBeUndefined()
  })

  it('Tracks on Homepage', () => {
    renderHook(() => useMonetateTrack({ pageType: 'HP', isEnabled: true }))
    expect(window.monetateQ).toBeDefined()
    expect(window.monetateQ).toContainEqual(['setPageType', 'HP'])
    expect(window.monetateQ).toContainEqual(['trackData'])
  })

  it('Tracks with product list on PLP/SRP', () => {
    renderHook(() =>
      useMonetateTrack({ pageType: 'PLP', isEnabled: true, products: addProductsMock })
    )
    expect(window.monetateQ).toBeDefined()
    expect(window.monetateQ).toContainEqual(['setPageType', 'PLP'])
    expect(window.monetateQ).toContainEqual(['addProducts', addProductsMock])
    expect(window.monetateQ).toContainEqual(['trackData'])
  })

  it('Tracks with product id on PDP', () => {
    renderHook(() => useMonetateTrack({ pageType: 'PDP', isEnabled: true, productId: '12345' }))
    expect(window.monetateQ).toBeDefined()
    expect(window.monetateQ).toContainEqual(['setPageType', 'PDP'])
    expect(window.monetateQ).toContainEqual(['addProductDetails', addProductsMock])
    expect(window.monetateQ).toContainEqual(['trackData'])
  })

  it('Does not track on PDP v7', () => {
    mockedUseTemplate.mockReturnValue(true)
    renderHook(() => useMonetateTrack({ pageType: 'PDP', isEnabled: true, productId: '12345' }))
    expect(window.monetateQ).toBeUndefined()
  })

  it('Tracks on HP when useTemplate reports PDP v7 (non-PDP pageType must not be gated)', () => {
    mockedUseTemplate.mockReturnValue(true)
    renderHook(() => useMonetateTrack({ pageType: 'HP', isEnabled: true }))
    expect(window.monetateQ).toBeDefined()
    expect(window.monetateQ).toContainEqual(['setPageType', 'HP'])
    expect(window.monetateQ).toContainEqual(['trackData'])
  })

  it('Tracks on PLP when useTemplate reports PDP v7', () => {
    mockedUseTemplate.mockReturnValue(true)
    renderHook(() =>
      useMonetateTrack({ pageType: 'PLP', isEnabled: true, products: addProductsMock })
    )
    expect(window.monetateQ).toBeDefined()
    expect(window.monetateQ).toContainEqual(['setPageType', 'PLP'])
  })

  it('Tracks on Search when useTemplate reports PDP v7', () => {
    mockedUseTemplate.mockReturnValue(true)
    renderHook(() => useMonetateTrack({ pageType: 'Search', isEnabled: true }))
    expect(window.monetateQ).toBeDefined()
    expect(window.monetateQ).toContainEqual(['setPageType', 'Search'])
  })
})

import {
  getThumbnailIndex2UpTemplate,
  isHalfScrollRequired,
  usePLPAutoscrollToVideoAsset,
} from './usePLPAutoscrollToVideoAsset'
import { renderHook } from '@testing-library/react'
import { useAtomValue } from 'jotai/utils'
import useExperiment from 'toro/hooks/useExperiment'
import usePreference from 'toro/hooks/usePreference_new'
import usePageType from 'toro/hooks/usePageType'
import type { PageTypeFlags } from 'toro/types'
import type { Color, MediaItem } from 'toro/types/productTypes'

describe('getThumbnailIndex2UpTemplate', () => {
  it.each([
    [-1, -1],
    [0, 0],
    [1, 0],
    [2, 1],
    [3, 1],
    [4, 2],
    [5, 2],
    [10, 5],
  ] as const)('index %i -> %i', (index, expected) => {
    expect(getThumbnailIndex2UpTemplate(index)).toBe(expected)
  })
})

describe('isHalfScrollRequired', () => {
  it.each([
    [-1, false],
    [0, false],
    [1, false],
    [2, true],
    [3, false],
    [4, true],
    [5, false],
    [10, true],
  ] as const)('index %i -> %s', (index, expected) => {
    expect(isHalfScrollRequired(index)).toBe(expected)
  })
})

jest.mock('jotai/utils')
jest.mock('toro/hooks/useExperiment')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/usePageType')
jest.mock('store/viewed-products.atom', () => ({ viewedProductsAtom: 'viewedProductsAtom' }))
jest.mock('store/plp.atom', () => ({ isOnModelPlp2UpAtom: 'isOnModelPlp2UpAtom' }))

const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
const mockedUseExperiment = useExperiment as jest.MockedFn<typeof useExperiment>
const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>
const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>

const mockAtomValues = ({
  viewedProductIds = [],
  isOnModel2Up = false,
}: {
  viewedProductIds?: string[]
  isOnModel2Up?: boolean
} = {}) => {
  mockedUseAtomValue.mockImplementation((atom: any) => {
    const atomMapper = {
      viewedProductsAtom: viewedProductIds,
      isOnModelPlp2UpAtom: isOnModel2Up,
    }
    return atomMapper[atom]
  })
}

describe('usePLPAutoscrollToVideoAsset', () => {
  beforeEach(() => {
    mockedUsePageType.mockReturnValue({ isPLP: true } as PageTypeFlags)
    mockedUseExperiment.mockReturnValue(true)
    mockedUsePreference.mockReturnValue({
      toggleSiteFeatures: { similarOptionsCTAConfig: { PLP: { enable: true } } },
    })
    mockAtomValues()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns -1/false/false when thumbnails are empty', () => {
    const color = { masterId: 'm1' } as Color

    const { result } = renderHook(() => usePLPAutoscrollToVideoAsset(color, [] as MediaItem[]))

    expect(result.current).toEqual({
      videoAssetIndex: -1,
      halfScrollRequired: false,
      autoscrollToVideoEnabled: false,
    })
  })

  it('computes videoAssetIndex/halfScrollRequired for normal and 1up templates', () => {
    mockAtomValues({ isOnModel2Up: false })

    const color = { masterId: 'm1' } as Color
    const thumbnails = [
      { type: 'image' },
      { type: 'image' },
      { type: 'image' },
      { type: 'video' },
    ] as MediaItem[]

    const { result } = renderHook(() => usePLPAutoscrollToVideoAsset(color, thumbnails))

    expect(result.current.videoAssetIndex).toBe(3)
    expect(result.current.halfScrollRequired).toBe(false)
  })

  it('computes videoAssetIndex/halfScrollRequired for 2up template (half scroll when video index is even > 1)', () => {
    mockAtomValues({ isOnModel2Up: true })

    const color = { masterId: 'm1' } as Color
    const thumbnails = [{ type: 'image' }, { type: 'image' }, { type: 'video' }] as MediaItem[]

    const { result } = renderHook(() => usePLPAutoscrollToVideoAsset(color, thumbnails))

    expect(result.current.videoAssetIndex).toBe(1)
    expect(result.current.halfScrollRequired).toBe(true)
  })

  it('enables autoscroll when all gates pass and masterId is viewed', () => {
    mockAtomValues({ viewedProductIds: ['m1'] })

    const color = { masterId: 'm1' } as Color
    const thumbnails = [{ type: 'image' }, { type: 'video' }] as MediaItem[]

    const { result } = renderHook(() => usePLPAutoscrollToVideoAsset(color, thumbnails))

    expect(result.current.videoAssetIndex).toBe(1)
    expect(result.current.autoscrollToVideoEnabled).toBe(true)
  })

  it('enables autoscroll when all gates pass and vgId starts with a viewed id', () => {
    mockAtomValues({ viewedProductIds: ['vg'] })

    const color = { vgId: 'vg-12345' } as Color
    const thumbnails = [{ type: 'video' }] as MediaItem[]

    const { result } = renderHook(() => usePLPAutoscrollToVideoAsset(color, thumbnails))

    expect(result.current.videoAssetIndex).toBe(0)
    expect(result.current.autoscrollToVideoEnabled).toBe(true)
  })

  it('disables autoscroll when CTA config gate is off', () => {
    mockedUsePreference.mockReturnValue({
      toggleSiteFeatures: { similarOptionsCTAConfig: { PLP: { enable: false } } },
    })
    mockAtomValues({ viewedProductIds: ['m1'] })

    const color = { masterId: 'm1', vgId: 'vg1' } as Color
    const thumbnails = [{ type: 'video' }] as MediaItem[]

    const { result } = renderHook(() => usePLPAutoscrollToVideoAsset(color, thumbnails))

    expect(result.current.autoscrollToVideoEnabled).toBe(false)
  })
})

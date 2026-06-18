import { renderHook } from '@testing-library/react'
import { useAccessorizeItCtaTarget } from 'toro/components/product/AccessorizeIt/hooks'
import usePreference from 'toro/hooks/usePreference_new'
import useIsKS from 'toro/helpers/isKS'

jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/helpers/isKS')

const mockUsePreference = jest.mocked(usePreference)
const mockUseIsKS = jest.mocked(useIsKS)

type MediaWithSrc = { src?: string; [key: string]: any }

const createMediaList = (...suffixes: string[]): MediaWithSrc[] =>
  suffixes.map((suffix) => ({
    src: `https://coach.scene7.com/is/image/Coach/cr508_b4ha_${suffix}`,
  }))

const setupPreferences = ({
  assetTypes = '',
  tangibleeCTAOne = '',
  tangibleeCTATwo = '',
  enableStrategicTangiblee = false,
}: {
  assetTypes?: string
  tangibleeCTAOne?: string
  tangibleeCTATwo?: string
  enableStrategicTangiblee?: boolean
} = {}) => {
  mockUsePreference.mockReturnValue({
    accessorizeIt: { addACharmCTAImageSuffix: assetTypes },
    tangiblee: {
      strategicTangibleePlacement: {
        tangibleeCTAOne,
        tangibleeCTATwo,
      },
      enableStrategicTangiblee,
    },
  } as any)
}

describe('useAccessorizeItCtaTarget', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseIsKS.mockReturnValue(false)
  })

  it('returns matching index when image suffix matches configured type', () => {
    setupPreferences({ assetTypes: 'a88' })
    const medias = createMediaList('a92', 'a88', 'a6')

    const { result } = renderHook(() => useAccessorizeItCtaTarget(medias))

    expect(result.current).toBe(1)
  })

  it('returns index on brand default when primary missing (QA scenario 2)', () => {
    setupPreferences({ assetTypes: 'a90' })
    const medias = createMediaList('a92', 'a88', 'a6')

    const { result } = renderHook(() => useAccessorizeItCtaTarget(medias))

    expect(result.current).toBe(1)
  })

  it('returns null when neither primary nor default in gallery (QA scenario 3)', () => {
    setupPreferences({ assetTypes: 'a90' })
    const medias = createMediaList('a92', 'a6', 'a10')

    const { result } = renderHook(() => useAccessorizeItCtaTarget(medias))

    expect(result.current).toBeNull()
  })

  it('returns null when preference empty on Kate Spade (no code default)', () => {
    mockUseIsKS.mockReturnValue(true)
    setupPreferences({ assetTypes: '' })
    const medias = createMediaList('a88', 'a90')

    const { result } = renderHook(() => useAccessorizeItCtaTarget(medias))

    expect(result.current).toBeNull()
  })

  it('uses Coach default a88 when preference is empty', () => {
    setupPreferences({ assetTypes: '' })
    const medias = createMediaList('a92', 'a88')

    const { result } = renderHook(() => useAccessorizeItCtaTarget(medias))

    expect(result.current).toBe(1)
  })

  it('honors comma-separated order before defaults', () => {
    setupPreferences({ assetTypes: 'a90,a88' })
    const medias = createMediaList('a88', 'a90')

    const { result } = renderHook(() => useAccessorizeItCtaTarget(medias))

    expect(result.current).toBe(1)
  })

  it('skips Tangiblee when enableStrategicTangiblee is false', () => {
    setupPreferences({
      assetTypes: 'a88',
      tangibleeCTAOne: 'a88',
      enableStrategicTangiblee: false,
    })
    const medias = createMediaList('a88')

    const { result } = renderHook(() => useAccessorizeItCtaTarget(medias))

    expect(result.current).toBe(0)
  })

  it('returns first match when multiple matching assets exist', () => {
    setupPreferences({ assetTypes: 'a88' })
    const medias = createMediaList('a92', 'a88', 'a6', 'a88')

    const { result } = renderHook(() => useAccessorizeItCtaTarget(medias))

    expect(result.current).toBe(1)
  })

  it('returns null when fullMedias is empty', () => {
    setupPreferences({ assetTypes: 'a88' })

    const { result } = renderHook(() => useAccessorizeItCtaTarget([]))

    expect(result.current).toBeNull()
  })

  it('handles undefined addACharmCTAImageSuffix gracefully', () => {
    mockUsePreference.mockReturnValue({
      accessorizeIt: { addACharmCTAImageSuffix: undefined },
      tangiblee: {
        strategicTangibleePlacement: null,
        enableStrategicTangiblee: false,
      },
    } as any)
    const medias = createMediaList('a88')

    const { result } = renderHook(() => useAccessorizeItCtaTarget(medias))

    expect(result.current).toBe(0)
  })

  it('does not duplicate brand default when already in configured list', () => {
    setupPreferences({ assetTypes: 'a88' })
    const medias = createMediaList('a88')

    const { result } = renderHook(() => useAccessorizeItCtaTarget(medias))

    expect(result.current).toBe(0)
  })

  it('handles Coach Outlet siteIdentifier with Coach defaults', () => {
    setupPreferences({ assetTypes: '' })
    const medias = createMediaList('a92', 'a88')

    const { result } = renderHook(() => useAccessorizeItCtaTarget(medias))

    expect(result.current).toBe(1)
  })

  it('handles Kate Spade surprise siteIdentifier with no code default', () => {
    mockUseIsKS.mockReturnValue(true)
    setupPreferences({ assetTypes: '' })
    const medias = createMediaList('a88', 'a90')

    const { result } = renderHook(() => useAccessorizeItCtaTarget(medias))

    expect(result.current).toBeNull()
  })

  it('handles image URLs with query params and extensions', () => {
    setupPreferences({ assetTypes: 'a88' })
    const medias = [
      { src: 'https://coach.scene7.com/is/image/Coach/cr508_b4ha_a92?$desktopProduct$' },
      { src: 'https://coach.scene7.com/is/image/Coach/cr508_b4ha_a88?$desktopProduct$' },
    ]

    const { result } = renderHook(() => useAccessorizeItCtaTarget(medias))

    expect(result.current).toBe(1)
  })

  it('handles Tangiblee CTA Two keys in addition to CTA One', () => {
    setupPreferences({
      assetTypes: 'a88,a92',
      tangibleeCTAOne: 'a6',
      tangibleeCTATwo: 'a92',
      enableStrategicTangiblee: true,
    })
    const medias = createMediaList('a92', 'a88')

    const { result } = renderHook(() => useAccessorizeItCtaTarget(medias))

    expect(result.current).toBe(1)
  })
})

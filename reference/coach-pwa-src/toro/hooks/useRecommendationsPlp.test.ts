import { renderHook as rtlRenderHook, act } from 'test-utils/react'
import { jest } from '@jest/globals'
import { usePlpRecommendations } from './useRecommendationsPlp'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { filtersAtom } from 'store/search-results.atom'
import { xgenClientAtom } from 'store/xgen.atom'
import { hasVisitedPdpInSessionAtom, plpRecsFetchedAtom } from 'store/plp.atom'

jest.mock('toro/hooks/usePageType')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useExperiment')
jest.mock('toro/hooks/useViewportType')

import usePageType from 'toro/hooks/usePageType'
import usePreference from 'toro/hooks/usePreference_new'
import useExperiment from 'toro/hooks/useExperiment'
import useViewportType from 'toro/hooks/useViewportType'

const mockUsePageType = jest.mocked(usePageType)
const mockUsePreference = jest.mocked(usePreference)
const mockUseExperiment = jest.mocked(useExperiment)
const mockUseViewportType = jest.mocked(useViewportType)

const CATEGORY_ID = 'cat-1'
const OTHER_CATEGORY_ID = 'cat-2'

function mockXgenClient() {
  return {
    recommendations: {
      setContext: jest.fn(async (): Promise<void> => {}),
      getRaw: jest.fn(async () => ({
        containers: [{ containerId: 'sm_el_plp_top_products', items: [] as unknown[] }],
      })),
    },
  }
}

type PlpHookOptions = {
  hasVisitedPdpInSession?: boolean
  /** Last category id XGen PLP recs were fetched for (`''` = none) */
  plpRecsFetched?: string
}

describe('usePlpRecommendations', () => {
  let client: ReturnType<typeof mockXgenClient>

  const renderPlpHook = (options?: PlpHookOptions) =>
    rtlRenderHook(() => usePlpRecommendations(), {
      contexts: {
        JotaiProviderContext: new Map([
          [filtersAtom, []],
          [xgenClientAtom, client],
          [hasVisitedPdpInSessionAtom, options?.hasVisitedPdpInSession ?? false],
          [plpRecsFetchedAtom, options?.plpRecsFetched ?? ''],
        ] as any),
      },
    })

  const enableMobilePlp = (enablePdpGatingForPlpRecs = false) => {
    mockUseViewportType.mockReturnValue({ isMobile: true } as any)
    mockUsePageType.mockReturnValue({ isPLP: true } as any)
    mockUseExperiment.mockImplementation(
      (exp: string) => exp === EXPERIMENTS.PERSONALIZED_RECOMMENDATION_PLP
    )
    mockUsePreference.mockReturnValue({
      recommendations: {
        enablePlpInGridRecommendations: true,
        enablePdpGatingForPlpRecs,
      },
    } as any)
  }

  const runFetch = async (
    result: ReturnType<typeof renderPlpHook>['result'],
    categoryId: string = CATEGORY_ID
  ) => {
    await act(async () => {
      await result.current(categoryId)
    })
  }

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation((message, ...args: unknown[]) => {
      if (typeof message === 'string' && message.includes('XGEN vendor is disabled')) return
      jest.requireActual<typeof console>('console').error(message, ...args)
    })
    localStorage.clear()
    client = mockXgenClient()
    mockUseViewportType.mockReturnValue({ isMobile: false } as any)
    mockUsePageType.mockReturnValue({ isPLP: false } as any)
    mockUseExperiment.mockImplementation(() => false)
    mockUsePreference.mockReturnValue({
      recommendations: {
        enablePlpInGridRecommendations: false,
        enablePdpGatingForPlpRecs: false,
      },
    } as any)
  })

  afterEach(() => {
    jest.mocked(console.error).mockRestore()
  })

  it('no-ops when PLP grid recs are not enabled', async () => {
    const { result } = renderPlpHook()
    await runFetch(result)
    expect(client.recommendations.setContext).not.toHaveBeenCalled()
  })

  it('calls XGen when enabled and PDP gating is off', async () => {
    enableMobilePlp()
    const { result } = renderPlpHook()
    await runFetch(result)
    expect(client.recommendations.setContext).toHaveBeenCalledWith({ parentCategory: CATEGORY_ID })
    expect(client.recommendations.getRaw).toHaveBeenCalled()
  })

  it('does not call XGen again for the same category after first fetch (plpRecsFetched per category)', async () => {
    enableMobilePlp(false)
    const { result } = renderPlpHook()
    await runFetch(result)
    expect(client.recommendations.setContext).toHaveBeenCalledTimes(1)
    client.recommendations.setContext.mockClear()
    client.recommendations.getRaw.mockClear()
    await runFetch(result)
    expect(client.recommendations.setContext).not.toHaveBeenCalled()
    expect(client.recommendations.getRaw).not.toHaveBeenCalled()
  })

  it('calls XGen for a different category after recs were fetched for another category', async () => {
    enableMobilePlp(false)
    const { result } = renderPlpHook({ plpRecsFetched: CATEGORY_ID })
    await runFetch(result, OTHER_CATEGORY_ID)
    expect(client.recommendations.setContext).toHaveBeenCalledWith({
      parentCategory: OTHER_CATEGORY_ID,
    })
    expect(client.recommendations.getRaw).toHaveBeenCalled()
  })

  it('does not call XGen when recs were already fetched for the same category (PDP gating off)', async () => {
    enableMobilePlp(false)
    const { result } = renderPlpHook({ plpRecsFetched: CATEGORY_ID })
    await runFetch(result)
    expect(client.recommendations.setContext).not.toHaveBeenCalled()
  })

  describe('PDP gating on', () => {
    beforeEach(() => enableMobilePlp(true))

    it('does not call XGen when user has not visited PDP from a PLP product tile', async () => {
      const { result } = renderPlpHook({
        hasVisitedPdpInSession: false,
        plpRecsFetched: '',
      })
      await runFetch(result)
      expect(client.recommendations.setContext).not.toHaveBeenCalled()
    })

    it('calls XGen when user visited PDP from a PLP product tile and recs not yet fetched for category', async () => {
      const { result } = renderPlpHook({
        hasVisitedPdpInSession: true,
        plpRecsFetched: '',
      })
      await runFetch(result)
      expect(client.recommendations.setContext).toHaveBeenCalledWith({
        parentCategory: CATEGORY_ID,
      })
      expect(client.recommendations.getRaw).toHaveBeenCalled()
    })

    it('does not call XGen when PLP recs were already fetched for the same category', async () => {
      const { result } = renderPlpHook({
        hasVisitedPdpInSession: true,
        plpRecsFetched: CATEGORY_ID,
      })
      await runFetch(result)
      expect(client.recommendations.setContext).not.toHaveBeenCalled()
    })
  })
})

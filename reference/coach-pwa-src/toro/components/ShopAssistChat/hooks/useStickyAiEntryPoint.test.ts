import { renderHook } from 'test-utils/react'
import { useAtomValue } from 'jotai/utils'
import useStickyAiEntryPoint from 'toro/components/ShopAssistChat/hooks/useStickyAiEntryPoint'
import usePreference from 'toro/hooks/usePreference_new'

jest.mock('jotai/utils')
jest.mock('toro/hooks/usePreference_new')

const mockUseAtomValue = useAtomValue as jest.MockedFunction<typeof useAtomValue>
const mockUsePreference = usePreference as jest.MockedFunction<typeof usePreference>

describe('useStickyAiEntryPoint', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockPreferenceDefaults = {
    aiGiftConcierge: {
      aiGiftConciergeData: {
        isGiftConciergeEnabled: false,
        limitStickyEntryPointByCategories: false,
        stickyEntryPointCategories: [],
      },
    },
    coachtopia: {
      coachtopiaHomeURL: '/coachtopia',
    },
  }

  it('should return false when gift concierge is disabled', () => {
    mockUseAtomValue.mockReturnValueOnce('category-123').mockReturnValueOnce(false)

    mockUsePreference.mockReturnValue({
      ...mockPreferenceDefaults,
      aiGiftConcierge: {
        aiGiftConciergeData: {
          isGiftConciergeEnabled: false,
          limitStickyEntryPointByCategories: false,
          stickyEntryPointCategories: [],
        },
      },
    })

    const { result } = renderHook(() => useStickyAiEntryPoint())

    expect(result.current).toBe(false)
  })

  it('should return true when sticky AI chat is already opened', () => {
    mockUseAtomValue.mockReturnValueOnce('category-123').mockReturnValueOnce(true)

    mockUsePreference.mockReturnValue({
      ...mockPreferenceDefaults,
      aiGiftConcierge: {
        aiGiftConciergeData: {
          isGiftConciergeEnabled: true,
          limitStickyEntryPointByCategories: true,
          stickyEntryPointCategories: ['category-123', 'category-456'],
        },
      },
    })

    const { result } = renderHook(() => useStickyAiEntryPoint())

    expect(result.current).toBe(true)
  })

  it('should return true when gift concierge is enabled and no category limitations', () => {
    mockUseAtomValue.mockReturnValueOnce('category-123').mockReturnValueOnce(false)
    mockUsePreference.mockReturnValue({
      ...mockPreferenceDefaults,
      aiGiftConcierge: {
        aiGiftConciergeData: {
          isGiftConciergeEnabled: true,
          limitStickyEntryPointByCategories: false,
          stickyEntryPointCategories: [],
        },
      },
    })

    const { result } = renderHook(() => useStickyAiEntryPoint())

    expect(result.current).toBe(true)
  })

  it('should return true when category limitations enabled but no categories specified', () => {
    mockUseAtomValue.mockReturnValueOnce('category-123').mockReturnValueOnce(false)

    mockUsePreference.mockReturnValue({
      ...mockPreferenceDefaults,
      aiGiftConcierge: {
        aiGiftConciergeData: {
          isGiftConciergeEnabled: true,
          limitStickyEntryPointByCategories: true,
          stickyEntryPointCategories: [],
        },
      },
    })

    const { result } = renderHook(() => useStickyAiEntryPoint())

    expect(result.current).toBe(true)
  })

  it('should return true when current category is in allowed categories', () => {
    mockUseAtomValue.mockReturnValueOnce('category-123').mockReturnValueOnce(false)

    mockUsePreference.mockReturnValue({
      ...mockPreferenceDefaults,
      aiGiftConcierge: {
        aiGiftConciergeData: {
          isGiftConciergeEnabled: true,
          limitStickyEntryPointByCategories: true,
          stickyEntryPointCategories: ['category-123', 'category-456'],
        },
      },
    })

    const { result } = renderHook(() => useStickyAiEntryPoint())

    expect(result.current).toBe(true)
  })

  it('should return false when current category is not in allowed categories', () => {
    mockUseAtomValue.mockReturnValueOnce('category-999').mockReturnValueOnce(false)

    mockUsePreference.mockReturnValue({
      ...mockPreferenceDefaults,
      aiGiftConcierge: {
        aiGiftConciergeData: {
          isGiftConciergeEnabled: true,
          limitStickyEntryPointByCategories: true,
          stickyEntryPointCategories: ['category-123', 'category-456'],
        },
      },
    })

    const { result } = renderHook(() => useStickyAiEntryPoint())

    expect(result.current).toBe(false)
  })

  it('should handle undefined categoryId when category restrictions are enabled', () => {
    mockUseAtomValue.mockReturnValueOnce(undefined).mockReturnValueOnce(false)

    mockUsePreference.mockReturnValue({
      ...mockPreferenceDefaults,
      aiGiftConcierge: {
        aiGiftConciergeData: {
          isGiftConciergeEnabled: true,
          limitStickyEntryPointByCategories: true,
          stickyEntryPointCategories: ['category-123'],
        },
      },
    })

    const { result } = renderHook(() => useStickyAiEntryPoint())

    expect(result.current).toBe(false)
  })

  it('should handle null categoryId when category restrictions are enabled', () => {
    mockUseAtomValue.mockReturnValueOnce(null).mockReturnValueOnce(false)

    mockUsePreference.mockReturnValue({
      ...mockPreferenceDefaults,
      aiGiftConcierge: {
        aiGiftConciergeData: {
          isGiftConciergeEnabled: true,
          limitStickyEntryPointByCategories: true,
          stickyEntryPointCategories: ['category-123'],
        },
      },
    })

    const { result } = renderHook(() => useStickyAiEntryPoint())

    expect(result.current).toBe(false)
  })

  it('should handle missing aiGiftConciergeData gracefully', () => {
    mockUseAtomValue.mockReturnValueOnce('category-123').mockReturnValueOnce(false)

    mockUsePreference.mockReturnValue({
      aiGiftConcierge: {},
      coachtopia: {
        coachtopiaHomeURL: '/coachtopia',
      },
    })

    const { result } = renderHook(() => useStickyAiEntryPoint())

    expect(result.current).toBe(false)
  })

  it('should handle missing aiGiftConcierge object gracefully', () => {
    mockUseAtomValue.mockReturnValueOnce('category-123').mockReturnValueOnce(false)

    mockUsePreference.mockReturnValue({
      aiGiftConcierge: {},
      coachtopia: {
        coachtopiaHomeURL: '/coachtopia',
      },
    })

    const { result } = renderHook(() => useStickyAiEntryPoint())

    expect(result.current).toBe(false)
  })

  it('should memoize result correctly when dependencies do not change', () => {
    mockUseAtomValue.mockReturnValue('category-123').mockReturnValue(false)

    mockUsePreference.mockReturnValue({
      ...mockPreferenceDefaults,
      aiGiftConcierge: {
        aiGiftConciergeData: {
          isGiftConciergeEnabled: true,
          limitStickyEntryPointByCategories: false,
          stickyEntryPointCategories: [],
        },
      },
    })

    const { result, rerender } = renderHook(() => useStickyAiEntryPoint())

    const firstResult = result.current
    rerender()
    const secondResult = result.current

    expect(firstResult).toBe(secondResult)
    expect(firstResult).toBe(true)
  })
})

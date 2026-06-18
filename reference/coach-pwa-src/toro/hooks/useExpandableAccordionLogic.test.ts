import { renderHook } from 'test-utils/react'
import { useExpandableAccordionLogic } from './useExpandableAccordionLogic'
import useProductData from 'toro/hooks/useProductData'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'

// Mock dependencies
jest.mock('toro/hooks/useProductData')
jest.mock('toro/hooks/useExperiment')

describe('useExpandableAccordionLogic', () => {
  const mockUseProductData = useProductData as jest.Mock
  const mockUseExperiment = useExperiment as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns hasFeaturedContent as true when featuredContentData is present', () => {
    // Arrange
    mockUseProductData.mockReturnValue(['some-featured-content', null, null, []])
    mockUseExperiment.mockReturnValue(false)

    // Act
    const { result } = renderHook(() => useExpandableAccordionLogic())

    // Assert
    expect(result.current.hasFeaturedContent).toBe(true)
    expect(mockUseProductData).toHaveBeenCalledWith([
      'featuredContentData',
      'custom.c_longDescription2',
      'custom.c_editorsNoteDescription',
      'pdpAccordionItems',
    ])
  })

  it('returns shouldShowCollapsible as true when experiment is enabled and has featured content', () => {
    // Arrange
    mockUseProductData.mockReturnValue(['some-featured-content', null, null, []])
    mockUseExperiment.mockImplementation((experiment) => {
      if (experiment === EXPERIMENTS.SHOW_COLLAPSIBLE_PRODUCT_INFO_V6) return true
      return false
    })

    // Act
    const { result } = renderHook(() => useExpandableAccordionLogic())

    // Assert
    expect(result.current.shouldShowCollapsible).toBe(true)
  })

  it('returns shouldShowCollapsible as true when experiment is enabled and total accordions > 1 (has details + 1 dynamic item)', () => {
    // Arrange
    // [featuredContentData, longDescription, editorNotes, accordionItems]
    mockUseProductData.mockReturnValue([null, 'long-desc', null, [{ id: 1 }]])
    mockUseExperiment.mockReturnValue(true)

    // Act
    const { result } = renderHook(() => useExpandableAccordionLogic())

    // Assert
    expect(result.current.shouldShowCollapsible).toBe(true)
  })

  it('returns shouldShowCollapsible as true when experiment is enabled and total accordions > 1 (no details + 2 dynamic items)', () => {
    // Arrange
    mockUseProductData.mockReturnValue([null, null, null, [{ id: 1 }, { id: 2 }]])
    mockUseExperiment.mockReturnValue(true)

    // Act
    const { result } = renderHook(() => useExpandableAccordionLogic())

    // Assert
    expect(result.current.shouldShowCollapsible).toBe(true)
  })

  it('returns shouldShowCollapsible as false when experiment is disabled', () => {
    // Arrange
    mockUseProductData.mockReturnValue([
      'some-featured-content',
      'desc',
      'notes',
      [{ id: 1 }, { id: 2 }],
    ])
    mockUseExperiment.mockReturnValue(false)

    // Act
    const { result } = renderHook(() => useExpandableAccordionLogic())

    // Assert
    expect(result.current.shouldShowCollapsible).toBe(false)
  })

  it('returns shouldShowCollapsible as false when experiment is enabled but no featured content and total accordions <= 1', () => {
    // Arrange
    // Only has product details (1 accordion), no dynamic items
    mockUseProductData.mockReturnValue([null, 'long-desc', null, []])
    mockUseExperiment.mockReturnValue(true)

    // Act
    const { result } = renderHook(() => useExpandableAccordionLogic())

    // Assert
    expect(result.current.shouldShowCollapsible).toBe(false)
  })

  it('handles null/undefined accordionItems gracefully', () => {
    // Arrange
    mockUseProductData.mockReturnValue([null, null, null, null])
    mockUseExperiment.mockReturnValue(true)

    // Act
    const { result } = renderHook(() => useExpandableAccordionLogic())

    // Assert
    expect(result.current.shouldShowCollapsible).toBe(false)
    expect(result.current.hasFeaturedContent).toBe(false)
  })
})

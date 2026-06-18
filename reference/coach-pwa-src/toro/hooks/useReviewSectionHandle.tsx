import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useCallback, useMemo } from 'react'
import { isHeaderHeightAtom } from 'store/headroom.atom'
import {
  reviewSectionNodeAtom,
  setReviewModalOpenedAtom,
  scrollToReview42Atom,
} from 'store/pdp.atom'
import useScrollWithHeadroomDisabled from 'toro/hooks/useScrollWithHeadroomDisabled'
import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'

type UseReviewSectionHandle = {
  (options?: { isEnabled: boolean; onClick?: () => void; shouldOpenTab?: boolean }): {
    onClick: () => void
    onMount: () => void
    closeModal: () => void
  }
}

/**
 * Utility hook that scopes all review section interaction logic internally.
 * @param {boolean} [options.isEnabled=true] Allows to conditionally enable/disable interactions.
 * @param {function(): void=} options.onClick Optional callback to be invoked on click.
 * @returns {ReturnType<UseReviewSectionHandle>} Handle object.
 */
const useReviewSectionHandle: UseReviewSectionHandle = (options) => {
  const { isEnabled = true, onClick, shouldOpenTab } = options || {}
  const reviewSectionNode = useAtomValue(reviewSectionNodeAtom)
  const headerHeight = useAtomValue(isHeaderHeightAtom)
  const { isStickyHeader, isTransparentStickyHeader } = useHeaderPositionPref()
  const scrollTo = useScrollWithHeadroomDisabled()
  const setReviewModalOpened = useUpdateAtom(setReviewModalOpenedAtom)
  const setShouldScrollToReviews = useUpdateAtom(scrollToReview42Atom)

  const scrollToReviewSection = useCallback(() => {
    if (shouldOpenTab) {
      setShouldScrollToReviews(true)
    } else {
      const isStickyHeaderEnabled = isStickyHeader || isTransparentStickyHeader
      const extraOffset = isStickyHeaderEnabled ? headerHeight : 0
      const reviewSectionOffset = reviewSectionNode ? reviewSectionNode.offsetTop - extraOffset : 0
      scrollTo({ top: reviewSectionOffset })
    }
  }, [reviewSectionNode, isStickyHeader, isTransparentStickyHeader, headerHeight, shouldOpenTab])

  return useMemo(() => {
    return {
      onClick: () => {
        if (!reviewSectionNode || !isEnabled) {
          return
        }
        onClick?.()
        scrollToReviewSection()
      },
      onMount: () => {
        if (!reviewSectionNode || !isEnabled) {
          return
        }
        scrollToReviewSection()
      },
      closeModal: () => {
        setReviewModalOpened(false)
      },
    }
  }, [reviewSectionNode, scrollToReviewSection, isEnabled, onClick])
}

export default useReviewSectionHandle

import { useMemo } from 'react'
import { useAtomValue } from 'jotai/utils'
import { categoryIdAtom, rootCategoryAtom } from 'store/search-results.atom'
import usePreference from 'toro/hooks/usePreference_new'
import { stickyAiChatAtom } from 'store/shop-assist-chat.atom'
import usePageType from 'toro/hooks/usePageType'

export default function useStickyAiEntryPoint(): boolean {
  const categoryId = useAtomValue(categoryIdAtom)
  const rootCategory = useAtomValue(rootCategoryAtom)
  const stickyAiChatOpened = useAtomValue(stickyAiChatAtom)
  const { isPDP } = usePageType()

  const {
    aiGiftConcierge: {
      aiGiftConciergeData: {
        isGiftConciergeEnabled = false,
        limitStickyEntryPointByCategories = false,
        stickyEntryPointCategories = [],
      } = {},
    } = {},
  } = usePreference({
    aiGiftConcierge: ['aiGiftConciergeData'],
  })

  return useMemo(() => {
    if (!isGiftConciergeEnabled) {
      return false
    }
    if (stickyAiChatOpened) return true
    if (isPDP) return false
    if (!limitStickyEntryPointByCategories) {
      return true
    }
    if (!stickyEntryPointCategories?.length) {
      return true
    }

    return (
      stickyEntryPointCategories.includes(categoryId) ||
      stickyEntryPointCategories.includes(rootCategory)
    )
  }, [
    isGiftConciergeEnabled,
    limitStickyEntryPointByCategories,
    stickyEntryPointCategories,
    categoryId,
    rootCategory,
    isPDP,
  ])
}

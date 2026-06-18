import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { useEffect } from 'react'
import { interactionsAtom, lastCategoryIdAtom } from 'store/matching-experience'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'

export const useClearInteractions = (currentCategoryID: string) => {
  const isEnhancedMatchingExperience = useExperiment(
    EXPERIMENTS.ENHANCED_CERTONA_MATCHING_EXPERIENCE
  )

  const [lastCategoryId, setLastCategoryId] = useAtom(lastCategoryIdAtom)
  const resetInteractions = useResetAtom(interactionsAtom)

  useEffect(() => {
    if (!isEnhancedMatchingExperience || lastCategoryId === currentCategoryID) return
    setLastCategoryId(currentCategoryID)
    resetInteractions()
  }, [isEnhancedMatchingExperience, lastCategoryId, currentCategoryID])
}

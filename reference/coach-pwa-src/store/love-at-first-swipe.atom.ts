import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import {
  STORAGE_LOVE_AT_FIRST_SWIPE_PRODUCTS,
  STORAGE_LOVE_AT_FIRST_SWIPE_STATS,
} from 'toro/constants/storageIds'
import type { LoveAtFirstSwipeResponse } from 'toro/components/LoveAtFirstSwipe/types'

const initialStats = {
  playedCount: 0,
  lastInteractionTime: null,
  isPersistentExperienceComplete: false,
}

export const loveAtFirstSwipeProductsAtom = atomWithStorage<Record<'left' | 'right', string[]>>(
  STORAGE_LOVE_AT_FIRST_SWIPE_PRODUCTS,
  { left: [], right: [] }
)

export const loveAtFirstSwipeRecommendationAtom = atom(null as LoveAtFirstSwipeResponse | null)

export const loveAtFirstSwipeStatsAtom = atomWithStorage<{
  playedCount: number
  lastInteractionTime?: number
  isPersistentExperienceComplete: boolean
}>(STORAGE_LOVE_AT_FIRST_SWIPE_STATS, initialStats)

export const loveAtFirstSwipeSourcePageAtom = atom<string>('')

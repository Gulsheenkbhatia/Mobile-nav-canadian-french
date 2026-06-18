import { atom, PrimitiveAtom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import { experimentsAtom } from 'store/experiments.atom'
import { EXPERIMENTS } from 'toro/constants/experiments'

export enum Action {
  COLOR_SWATCH = 1,
  CAROUSEL_SWIPE = 2,
  PDP_VISIT = 3,
}

export type InteractionType = {
  action: Action
  value?: string
}

export type MatchingExperienceFilter = {
  filterType: string
  displayValue: string
  value: string | number
  viewAllTitle: string
  viewAllLink: string
}

export type MatchingExperienceConfig = {
  title: string
  recommender: string
  filters: MatchingExperienceFilter[]
  channels?: Record<string, string>
}

type MatchingExperienceValue =
  | Record<string, MatchingExperienceConfig>
  | MatchingExperienceConfig
  | null

export const interactionsAtom = atomWithReset<InteractionType[]>([])

export const lastCategoryIdAtom = atom<string | null>(null) as PrimitiveAtom<string | null>

export const addInteractionAtom = atom(null, (get, set, interaction: InteractionType) => {
  const experiments = get(experimentsAtom)
  const isEnhancedMatchingExperience = experiments.includes(
    EXPERIMENTS.ENHANCED_CERTONA_MATCHING_EXPERIENCE
  )

  const lastCategoryId = get(lastCategoryIdAtom)

  if (!isEnhancedMatchingExperience || !interaction.value || !lastCategoryId) return

  set(interactionsAtom, (prev) => [interaction, ...prev])
})

export const homepageMatchingExperienceAtom = atom<MatchingExperienceValue>(null)

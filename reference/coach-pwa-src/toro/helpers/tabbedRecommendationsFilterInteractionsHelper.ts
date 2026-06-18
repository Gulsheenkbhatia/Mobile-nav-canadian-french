import { SetStateAction } from 'jotai'
import { Dispatch, type RefObject } from 'react'
import { InteractionType } from 'store/matching-experience'
import { TabFilter } from 'toro/components/RecommendationsTabbedContainer/types'

interface CompareFiltersAndInteractionsProps {
  filters: TabFilter[]
  interactions: InteractionType[]
  setSelectedFilter: Dispatch<SetStateAction<number>>
  tabsRef: RefObject<HTMLDivElement>
}

/**
 * Normalizes a filter/interaction value for case-insensitive comparisons.
 *
 * Coerces any input to a string, treats `null`/`undefined` as an empty string,
 * and lowercases the result.
 *
 * @param value - Raw value from filter config or recorded interaction.
 * @returns A normalized lowercase string (empty string for nullish inputs).
 */
const normalizeFilterValue = (value: unknown): string => String(value ?? '').toLowerCase()

/**
 * Compares the provided filters with user interactions and updates the selected filter accordingly.
 * If a matching interaction is found, it sets the selected filter and scrolls the corresponding
 * filter button into view.
 *
 * @param {TabFilter[]} params.filters - The array of filter objects.
 * @param {InteractionType[]} params.interactions - The array of user interaction objects.
 * @param {(index: number) => void} params.setSelectedFilter - Function to update the selected filter index.
 * @param {React.RefObject<HTMLDivElement>} params.tabsRef - Reference to the tabs container element.
 */
export const compareFiltersAndInteractions = ({
  filters,
  interactions,
  setSelectedFilter,
  tabsRef,
}: CompareFiltersAndInteractionsProps) => {
  const filterValues = filters.map((filter) => normalizeFilterValue(filter.value))
  const validInteractions = interactions
    .filter((interaction) => {
      return filterValues.includes(normalizeFilterValue(interaction.value))
    })
    .sort((a, b) => b.action - a.action)
  const validInteraction = validInteractions[0]

  if (!validInteraction) {
    return
  }
  const filterIndex = filters.findIndex(
    (filter) => normalizeFilterValue(filter.value) === normalizeFilterValue(validInteraction.value)
  )
  if (filterIndex === -1) {
    return
  }

  setSelectedFilter(filterIndex)

  const container = tabsRef.current?.querySelector('#recommendationContainer')
  const selectedTab = container?.querySelector<HTMLElement>(`[data-index="${filterIndex}"]`)
  if (!container || !selectedTab) return
  container.scrollTo({
    left: selectedTab.offsetLeft,
    behavior: 'smooth',
  })
}

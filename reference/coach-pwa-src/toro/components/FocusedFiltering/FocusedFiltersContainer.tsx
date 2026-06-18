import useViewportType from 'toro/hooks/useViewportType'
import usePageType from 'toro/hooks/usePageType'
import dynamic from 'next/dynamic'
import { focusedFilteringAtom } from 'store/search-results.atom'
import { useAtomValue } from 'jotai/utils'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Experiment from 'toro/components/Experiment'

const FocusedFiltering = dynamic(() => import('toro/components/FocusedFiltering'), {
  ssr: false,
})

const FocusedFiltersContainer = ({ loading }) => {
  const focusedFiltering = useAtomValue(focusedFilteringAtom)
  const { isMobile } = useViewportType()
  const { isPLP } = usePageType()
  const isFocusedFilteringEnabled = Boolean(focusedFiltering?.categoryID && focusedFiltering?.value)

  if (!isMobile || !isPLP || !isFocusedFilteringEnabled) {
    return null
  }

  return (
    <Experiment forIDs={EXPERIMENTS.FOCUSED_FILTERING}>
      <FocusedFiltering focusedFiltering={focusedFiltering} loading={loading} />
    </Experiment>
  )
}

export default FocusedFiltersContainer

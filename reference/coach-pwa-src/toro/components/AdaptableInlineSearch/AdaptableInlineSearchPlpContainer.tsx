import usePreference from 'toro/hooks/usePreference_new'
import dynamic from 'next/dynamic'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePageType from 'toro/hooks/usePageType'
import Experiment from 'toro/components/Experiment'
import { isPlpV3Atom } from 'store/plp.atom'
import { useAtomValue } from 'jotai/utils'
import get from 'lodash/get'

const AdaptableInlineSearch = dynamic(() => import('toro/components/AdaptableInlineSearch'), {
  ssr: false,
})

function AdaptableInlineSearchPlpContainer() {
  const {
    adaptiveExperience: { inlineSearch: inlineSearchPreference },
  } = usePreference({
    adaptiveExperience: ['inlineSearch'],
  })
  const inlineSearch = get(inlineSearchPreference, 'inlineSearch')

  const { isPLP } = usePageType()
  const isPlpV3 = useAtomValue(isPlpV3Atom)

  if (!isPLP || !inlineSearch?.enabled || !isPlpV3) {
    return null
  }

  return (
    <Experiment forIDs={`${EXPERIMENTS.INLINE_SEARCH_PLP}`} forMobile>
      <AdaptableInlineSearch />
    </Experiment>
  )
}

export default AdaptableInlineSearchPlpContainer

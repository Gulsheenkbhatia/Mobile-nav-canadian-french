import usePreference from 'toro/hooks/usePreference_new'
import dynamic from 'next/dynamic'
import usePageType from 'toro/hooks/usePageType'
import { currentLocaleAtom } from 'store/global.atom'
import { surveySessionyStatusAtom } from 'store/survey-session-atom'
import { useAtomValue } from 'jotai/utils'
import get from 'lodash/get'
import type { SurveyProps } from 'toro/components/Survey'

const Survey = dynamic(() => import('toro/components/Survey'), {
  ssr: false,
})

function SurveyContainer({ answers, variant }: SurveyProps) {
  const locale = useAtomValue(currentLocaleAtom)
  const {
    adaptiveExperience: { surveyDetails },
  } = usePreference({
    adaptiveExperience: ['surveyDetails'],
  })

  const isSurveyPLPEnabled = get(surveyDetails, `${locale}.plp`)
  const isSurveyPDPEnabled = get(surveyDetails, `${locale}.pdp`)

  const { isPLP, isPDP } = usePageType()
  const isSurveyAvailable = useAtomValue(surveySessionyStatusAtom)

  if (!isSurveyAvailable || !answers?.length) {
    return null
  }

  if (isPLP && !isSurveyPLPEnabled) {
    return null
  }

  if (isPDP && !isSurveyPDPEnabled) {
    return null
  }

  return <Survey answers={answers} variant={variant} />
}

export default SurveyContainer

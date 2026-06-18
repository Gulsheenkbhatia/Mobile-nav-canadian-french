import dynamic from 'next/dynamic'
import usePreference from 'toro/hooks/usePreference_new'
import { useAtomValue } from 'jotai/utils'
import { isPlpV3Atom } from 'store/plp.atom'
import AdaptableInlineSearchPlpContainer from 'toro/components/AdaptableInlineSearch/AdaptableInlineSearchPlpContainer'
import Box from 'toro/components/Box'
import CertonaComponents from 'toro/components/PLPBottomSlotsContainer/components'
import SurveyContainer from 'toro/components/Survey/SurveyContainer'
import get from 'lodash/get'
import RecommendedCategoriesContainer from 'toro/components/product/RecommendedCategories'
import { XgenContainerID } from 'toro/lib/xgen'

const RecommendationOnPlp = dynamic(() => import('toro/components/Certona/RecommendationOnPlp'), {
  ssr: false,
})

const BecauseYouViewedContainerPlp = dynamic(
  () => import('toro/components/BecauseYouViewedRecommendation/plp'),
  { ssr: false }
)

type BottomSlot = {
  id: string
  slot: number
  position: number
  recommendations: string
  tileUP: number
  placement?: 'bottom' | 'inline'
  isCertona?: boolean
  isInlineSearch?: boolean
  isSurvey?: boolean
  isRecommendedCategories?: boolean
  categories?: { catIDs: string[] }
}

export type PLPBottomSlotsContainerProps = {
  bottomSlots?: BottomSlot[]
  styles: Record<string, any>
  categoryId?: string
  isComparablePriceEnabledCategory?: boolean
}

function PLPBottomSlotsContainer({
  bottomSlots,
  styles,
  categoryId,
  isComparablePriceEnabledCategory,
}: PLPBottomSlotsContainerProps) {
  const isPlpV3 = useAtomValue(isPlpV3Atom)

  const {
    recommendations: { hideRecommendationPrice },
  } = usePreference({
    recommendations: ['hideRecommendationPrice'],
  })

  if (!bottomSlots?.length) {
    return null
  }

  const renderCertonaSlot = (slot: BottomSlot) => {
    const CertonaComponent = CertonaComponents[slot.recommendations]
    if (CertonaComponent) {
      return (
        <CertonaComponent
          key={slot.id}
          slot={slot}
          categoryId={categoryId}
          type={slot.recommendations}
        />
      )
    }

    return (
      <RecommendationOnPlp
        key={slot.id}
        type={slot.recommendations}
        hideRecommendationPrice={hideRecommendationPrice}
        isPlpV3={isPlpV3}
      />
    )
  }

  return (
    <Box sx={styles.bottomContentSlotsWrapper}>
      {bottomSlots.map((slot, idx) => {
        if (slot?.isInlineSearch) {
          return <AdaptableInlineSearchPlpContainer key={`inlineSearch-${idx}`} />
        }

        if (slot?.isSurvey) {
          return (
            <SurveyContainer
              key={`survey-${idx}`}
              answers={get(slot, 'answers')}
              variant={isPlpV3 ? 'round' : ''}
            />
          )
        }

        if (slot?.isRecommendedCategories) {
          return (
            <RecommendedCategoriesContainer
              key={`recommended-categories-${idx}`}
              recommendedCategoriesData={slot?.categories}
              isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
            />
          )
        }

        if (slot?.recommendations === XgenContainerID.sm_el_sitevisit1) {
          return <BecauseYouViewedContainerPlp key={slot.id} />
        }

        return renderCertonaSlot(slot)
      })}
    </Box>
  )
}

export default PLPBottomSlotsContainer

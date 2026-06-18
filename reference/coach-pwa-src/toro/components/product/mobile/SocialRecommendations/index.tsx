import { FC, useEffect, useMemo } from 'react'
import { useAtomValue } from 'jotai/utils'
import { visuallySimilarDataAtom } from 'store/global.atom'
import LLMRecommendations from 'toro/components/LLMRecommendations'
import useProductData from 'toro/hooks/useProductData'
import { CertonaScheme } from 'store/certona-schemes.atoms'
import { CertonaRecommendation } from 'toro/components/Certona/Recommendation/BaseCertonaContainer'
import RecommendationsContainer from 'toro/components/RecommendationsContainer'
import useLLMRecommendations from 'toro/hooks/useLLMRecommendations'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import {
  RECOMMENDATIONS_SOCIAL_LANDER_LIMIT,
  SOCIAL_LANDER_GRID_HEADER_TITLE,
} from 'toro/constants/adaptiveExperience'
import RecommendationTitle from 'toro/components/product/mobile/SocialRecommendations/RecommendationTitle'
import useSelectCertonaItems from 'toro/hooks/useSelectCertonaItems'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { RecommendationStyles } from 'toro/components/RecommendationsContainer/types'
import { useIntl } from 'react-intl'

interface RecommendationsProps {
  styles: RecommendationStyles
}

const limit = RECOMMENDATIONS_SOCIAL_LANDER_LIMIT

const CertonaRecommendations: FC<RecommendationsProps> = ({ styles }) => {
  const id = useProductData('id')
  const certonaSchemeData = useSelectCertonaItems('product3_rr') as CertonaScheme | undefined
  const { formatMessage } = useIntl()
  const hasData = certonaSchemeData?.items?.length > 0
  if (!hasData) return null

  return (
    <>
      <RecommendationTitle styles={styles} />
      <CertonaRecommendation
        certonaData={certonaSchemeData}
        hidePrice={false}
        type="product3_rr"
        variant="aeDrawerGridSocial"
        productId={id}
        label={formatMessage({
          id: 'pdp.socialRecommendations.title',
          defaultMessage: SOCIAL_LANDER_GRID_HEADER_TITLE,
        })}
        onItemClick={undefined}
        onClickATCDrawerRecommendationLink={undefined}
        recommendationViewMoreUrl={undefined}
        limit={limit}
        isMatchingExperience={undefined}
        showLoadMoreButton={false}
        showDivider={false}
        hideWishlist={true}
        hideLabel={true}
      />
    </>
  )
}

const VisuallySimilarRecommendations: FC<RecommendationsProps> = ({ styles }) => {
  const { setVisuallySimilarProp, visuallySimilarProp } = useLLMRecommendations()
  const visuallySimilarData = useAtomValue(visuallySimilarDataAtom)
  const { formatMessage } = useIntl()

  const hasData = visuallySimilarData?.length > 0

  useEffect(() => {
    setVisuallySimilarProp(visuallySimilarProp)
  }, [visuallySimilarProp])

  const products = useMemo(() => {
    return limit ? visuallySimilarData?.slice(0, limit) : visuallySimilarData
  }, [visuallySimilarData])

  if (!hasData) return null

  return (
    <>
      <RecommendationTitle styles={styles} />
      <LLMRecommendations
        products={products}
        scheme="product3_rr"
        variant="aeDrawerGridSocial"
        isGrid={true}
        hideLabel={true}
        hideLLMPromo={true}
        hideWishlist={true}
        label={formatMessage({
          id: 'pdp.socialRecommendations.title',
          defaultMessage: SOCIAL_LANDER_GRID_HEADER_TITLE,
        })}
      />
    </>
  )
}

export const SocialRecommendations = () => {
  const styles = useMultiStyleConfig('RecommendationsContainer', {
    variant: 'similarProductRecommendationAdaptivePDP',
  })

  const { formatMessage } = useIntl()

  return (
    <>
      <Experiment forIDs={EXPERIMENTS.XGEN_RECOMMENDATIONS_PDP}>
        <RecommendationsContainer
          type="product3_rr"
          variant="aeDrawerGridSocial"
          hideLabel={true}
          limit={limit}
          showRecommendationTitle
          showDivider={false}
          styles={styles}
          hideWishlist={true}
          title={formatMessage({
            id: 'pdp.socialRecommendations.title',
            defaultMessage: SOCIAL_LANDER_GRID_HEADER_TITLE,
          })}
        />
      </Experiment>

      <Experiment forIDs={EXPERIMENTS.VIEW_SIMILAR_RECOMMENDATIONS_PDP}>
        <VisuallySimilarRecommendations styles={styles} />
      </Experiment>

      <Experiment forIDs={EXPERIMENTS.CERTONA_RECOMMENDATIONS_PDP}>
        <CertonaRecommendations styles={styles} />
      </Experiment>
    </>
  )
}

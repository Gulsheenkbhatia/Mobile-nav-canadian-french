import certonaSchemesAtom from 'store/certona-schemes.atoms'
import { useAtomValue } from 'jotai/utils'
import CertonaRecommendation from 'toro/components/Certona/Recommendation'
import { useMemo, useState, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import useViewportType from 'toro/hooks/useViewportType'
import withVendorSwitch from 'toro/hocs/withVendorSwitch'
import RecommendationsContainer from 'toro/components/RecommendationsContainer'
import withSchemeValidation from 'toro/hocs/withSchemeValidation'

const CertonaRecommendationOnPLP = ({ type, hideRecommendationPrice, isPlpV3 }) => {
  const certonaSchemeData = useAtomValue(certonaSchemesAtom)
  const [skeletonVisible, setSkeletonVisible] = useState(true)
  const { isMobile, isDesktop } = useViewportType()
  const currentScheme = useMemo(
    () => certonaSchemeData?.find((item) => item.scheme === type),
    [type, certonaSchemeData]
  )

  const manageVisibility = useCallback(
    (visible) => {
      if (visible && currentScheme) {
        setSkeletonVisible(false)
      }
    },
    [currentScheme]
  )

  const { ref: inViewRef } = useInView({
    onChange: manageVisibility,
  })

  return (
    <div
      className="plp-certona"
      id="recommendations-section"
      key={currentScheme?.scheme}
      data-qa={isMobile ? 'recommendations-section-plp-certona' : 'recommendations-section'}
      ref={inViewRef}
    >
      <CertonaRecommendation
        certonaData={currentScheme}
        hidePrice={hideRecommendationPrice}
        label={currentScheme?.explanation}
        variant={isPlpV3 ? 'inlinegridV3' : 'inlinegrid'}
        skeletonVisible={skeletonVisible}
        isPLPv3Desktop={isPlpV3 && isDesktop}
      />
    </div>
  )
}

export default withVendorSwitch(
  CertonaRecommendationOnPLP,
  withSchemeValidation(RecommendationsContainer, CertonaRecommendationOnPLP)
)

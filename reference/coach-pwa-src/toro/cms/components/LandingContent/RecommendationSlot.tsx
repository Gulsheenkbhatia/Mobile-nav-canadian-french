import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import Lazy from 'toro/components/Lazy'
import withVendorSwitch from 'toro/hocs/withVendorSwitch'
import RecommendationsContainer from 'toro/components/RecommendationsContainer'
import usePreference from 'toro/hooks/usePreference_new'
import useCertonaScheme from 'toro/hooks/useCertonaScheme'
import withSchemeValidation from 'toro/hocs/withSchemeValidation'
import type { CertonaScheme, CertonaSchemeType } from 'store/certona-schemes.atoms'
import { useAtomValue } from 'jotai/utils'
import { isOneCoachNAEnabledAtom, oneSiteActiveBrandAtom } from 'store/menu-data.atom'
import { homepageMatchingExperienceAtom } from 'store/matching-experience'

const RecommendationOnHome = dynamic(() => import('toro/components/Certona/RecommendationOnHome'), {
  ssr: false,
})

function CertonaSlot({
  siteId,
  brand,
  type,
}: {
  siteId: string
  brand: string
  type: CertonaSchemeType
  hideWishlist?: boolean
  /** Forwarded to Xgen `RecommendationsContainer` only; unused for Certona. */
  emitHomeFeaturedProductsJsonLd?: boolean
}) {
  const isOneCoachNAEnabled = useAtomValue(isOneCoachNAEnabledAtom)
  const activeBrand = useAtomValue(oneSiteActiveBrandAtom)
  const matchingExperienceFromCustomObject = useAtomValue(homepageMatchingExperienceAtom)

  const {
    recommendations: { hideRecommendations, disableRecommendationOnPages, hideRecommendationPrice },
    adaptiveExperience: { matchingExperience: matchingExperienceFromPreference },
  } = usePreference({
    CertonaConfiguration: ['Certona_HP_Visibility'],
    adaptiveExperience: ['matchingExperience'],
    recommendations: [
      'hideRecommendations',
      'disableRecommendationOnPages',
      'hideRecommendationPrice',
    ],
  })

  // TODO: Remove preference fallback once all brands have migrated to the custom object (DIGIT-41184)
  const rawMatchingExperience =
    matchingExperienceFromCustomObject ?? matchingExperienceFromPreference

  const matchingExperience =
    isOneCoachNAEnabled && activeBrand
      ? rawMatchingExperience?.[activeBrand]
      : rawMatchingExperience

  const hideYmalOnHome = disableRecommendationOnPages?.includes('home')
  const scheme = useCertonaScheme(type, {
    pagetype: 'home',
    enabled: !Boolean(matchingExperience?.recommender) && !hideYmalOnHome && !hideRecommendations,
  }) as CertonaScheme

  return useMemo(() => {
    if (!hideYmalOnHome && !hideRecommendations && scheme) {
      return (
        <Lazy className="certona-recommendations-home">
          <RecommendationOnHome
            certonaData={scheme}
            siteId={siteId}
            label={scheme?.explanation || 'You may also like'}
            hidePrice={hideRecommendationPrice}
            brand={brand}
          />
        </Lazy>
      )
    }
    return null
  }, [hideYmalOnHome, hideRecommendations, scheme])
}

const RecommendationsContainerWithFallback = withSchemeValidation(
  RecommendationsContainer,
  CertonaSlot
)

export default withVendorSwitch(CertonaSlot, RecommendationsContainerWithFallback)

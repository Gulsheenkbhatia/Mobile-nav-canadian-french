import { useContext, useEffect, useMemo } from 'react'
import Box from 'toro/components/Box'
import ReactDOM from 'react-dom'
import { useIntl } from 'react-intl'
import get from 'lodash/get'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePreference from 'toro/hooks/usePreference_new'
import PWAContext from 'components/common/PWAContext'
import dynamic from 'next/dynamic'
import { carouselKeyStateAtom } from 'store/pdp.atom'
import useMinicartCertona from 'toro/hooks/useMinicartCertona'
import ATBDrawerRecommendationsCTA from 'toro/components/ATBProductRecommendations/ATBDrawerRecommendationsCTA'
import usePageType from 'toro/hooks/usePageType'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useAtomValue } from 'jotai/utils'
import CertonaSkeleton from 'toro/components/Certona/CertonaSkeleton'
import toggleBodyScroll from 'toro/helpers/toggleBodyScroll'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import withVendorSwitch from 'toro/hocs/withVendorSwitch'
import RecommendationsContainer from 'toro/components/RecommendationsContainer'
import withOverlay from 'toro/hocs/withOverlay'
import withSchemeValidation from 'toro/hocs/withSchemeValidation'

const CertonaRecommendation = dynamic(() => import('toro/components/Certona/Recommendation'), {
  ssr: false,
})

const ATBProductRecommendation = ({
  drawerVisible,
  closeDrawer,
  variant = 'atcRecommendationMobile',
  variantId,
}) => {
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const styles = useMultiStyleConfig('AddToBagDrawer')
  const { appData } = useContext(PWAContext)
  const siteId = get(appData, 'siteId')
  // show overlay even without recommendations (on PLP only)
  // expected that on PDP it will the same soon and condition will be removed
  const { isPLP } = usePageType()

  const ymalScheme = useMinicartCertona(variantId)

  const carouselKeyState = useAtomValue(carouselKeyStateAtom)
  const { recommendations: isXgenExperience } = useAtomValue(xgenFeaturesAtom)

  const {
    recommendations: {
      hideRecommendations,
      hideRecommendationPriceOnATC: hideYmalPriceATC,
      isCertonaEnableOnATC,
      recViewMoreUrl: atbDrawerRecommendationsLinkUrl,
    },
  } = usePreference({
    recommendations: [
      'hideRecommendations',
      'hideRecommendationPriceOnATC',
      'isCertonaEnableOnATC',
      'recViewMoreUrl',
    ],
  })
  const showRecommendationPreferences = !hideRecommendations && isCertonaEnableOnATC
  const isATCDrawerRecommendationEnabled = useMemo(
    () =>
      showRecommendationPreferences &&
      Boolean(ymalScheme?.items?.length) &&
      ymalScheme?.display?.toLowerCase() !== 'no',
    [hideRecommendations, isCertonaEnableOnATC, ymalScheme]
  )
  const showRecommendationSkeleton = showRecommendationPreferences && !ymalScheme

  const onClickATCDrawerRecommendationLink = () => {
    analytics.send('cartInteraction', {
      eventLocation: 'checkout drawer',
      eventAction: 'Explore More click',
      eventLabel: variantId,
    })
  }

  useEffect(() => {
    if (drawerVisible && (isATCDrawerRecommendationEnabled || isPLP)) {
      toggleBodyScroll(false)
    } else {
      toggleBodyScroll(true)
    }
    return () => {
      toggleBodyScroll(true)
    }
  }, [drawerVisible, isATCDrawerRecommendationEnabled])

  if (
    isXgenExperience ||
    !showRecommendationPreferences ||
    (ymalScheme && !isATCDrawerRecommendationEnabled)
  ) {
    return null
  }

  return (
    <Box sx={styles.drawerRecommendation}>
      {(isATCDrawerRecommendationEnabled || isPLP) &&
        ReactDOM.createPortal(
          <Box sx={styles.bagDrawerOverlay} onClick={isPLP ? closeDrawer : undefined} />,
          document.getElementById('maincontent')
        )}
      {isATCDrawerRecommendationEnabled && (
        <Box id="recommendations-section-ATC" className="recomm-sec-ATC" key={carouselKeyState}>
          <CertonaRecommendation
            certonaData={ymalScheme}
            siteId={siteId}
            hidePrice={hideYmalPriceATC}
            variant={variant}
            skeletonVisible={false}
            label={
              ymalScheme?.explanation ||
              formatMessage({ id: 'pdp.product.pairItWith', defaultMessage: 'Pair it with' })
            }
            type="yaml"
            onClickATCDrawerRecommendationLink={onClickATCDrawerRecommendationLink}
            onItemClick={closeDrawer}
            recommendationViewMoreUrl={atbDrawerRecommendationsLinkUrl}
          />

          {atbDrawerRecommendationsLinkUrl && (
            <Experiment forIDs={EXPERIMENTS.VIEW_MORE_ON_POST_ATC}>
              <ATBDrawerRecommendationsCTA
                url={atbDrawerRecommendationsLinkUrl}
                onClickATCDrawerRecommendationLink={onClickATCDrawerRecommendationLink}
              />
            </Experiment>
          )}
        </Box>
      )}
      {showRecommendationSkeleton && (
        <Box id="recommendations-section-ATC" className="recomm-sec-ATC">
          <CertonaSkeleton variant={variant} />
        </Box>
      )}
    </Box>
  )
}

const RecommendationsContainerWithOverlay = withOverlay(RecommendationsContainer)
const RecommendationsContainerWithFallback = withSchemeValidation(
  RecommendationsContainerWithOverlay,
  ATBProductRecommendation
)

export default withErrorBoundaryWrapper(
  withVendorSwitch(ATBProductRecommendation, RecommendationsContainerWithFallback)
)

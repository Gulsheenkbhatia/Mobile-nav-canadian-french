import useCertonaScheme from 'toro/hooks/useCertonaScheme'
import type { CertonaScheme } from 'store/certona-schemes.atoms'
import get from 'lodash/get'
import useViewportType from 'toro/hooks/useViewportType'
import dynamic from 'next/dynamic'
import Box from 'toro/components/Box'
import withVendorSwitch from 'toro/hocs/withVendorSwitch'
import withSchemeValidation from 'toro/hocs/withSchemeValidation'
import { DEALS_SCHEME } from 'toro/components/Certona/certona-schemes'

const EnhancedRecommendation = dynamic(() => import('toro/components/EnhancedRecommendation'), {
  ssr: false,
})

const DealsRecommendationContainer = dynamic(
  () => import('toro/components/EnhancedRecommendation/DealsRecommendationContainer'),
  { ssr: false }
)

function DealsContainer({ slot, categoryId, type }) {
  const { isMobile } = useViewportType()

  const certonaData = useCertonaScheme(DEALS_SCHEME, {
    enabled: isMobile,
    filter: get(slot, 'filters', {}),
    pagetype: 'productlisting',
    recommendations: true,
    categoryID: categoryId,
  }) as CertonaScheme

  if (!isMobile) return null

  return (
    <Box id="deals-container">
      <EnhancedRecommendation
        recommendationData={certonaData}
        variant="deals"
        label={certonaData?.explanation}
      />
    </Box>
  )
}

export default withVendorSwitch(
  DealsContainer,
  withSchemeValidation(DealsRecommendationContainer, DealsContainer)
)

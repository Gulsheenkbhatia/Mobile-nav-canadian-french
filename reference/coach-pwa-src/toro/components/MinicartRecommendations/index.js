import { useEffect } from 'react'
import Box from 'toro/components/Box'
import { useIntl } from 'react-intl'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import dynamic from 'next/dynamic'

import usePreference from 'toro/hooks/usePreference'
import Divider from 'toro/components/Divider'
import useMinicartCertona from 'toro/hooks/useMinicartCertona'

const CertonaRecommendation = dynamic(() => import('toro/components/Certona/Recommendation'), {
  ssr: false,
})

const MinicartRecommendations = ({
  variantId,
  siteId,
  onItemClick,
  scrollProductsItemsToTop,
  loadingProducts,
}) => {
  const { formatMessage } = useIntl()
  const ymalScheme = useMinicartCertona(variantId)

  const hideYmalPriceATC = usePreference({
    groupId: 'recommendations',
    preferenceId: 'hideRecommendationPriceOnATC',
    siteId,
  })

  useEffect(() => {
    if (ymalScheme?.items?.length > 1 && !loadingProducts) {
      scrollProductsItemsToTop()
    }
  }, [ymalScheme?.items?.length, loadingProducts])

  if (!ymalScheme?.items?.length) {
    return <Divider variant="dashed" borderColor="var(--color-neutral-base)" />
  }

  return (
    <>
      <Box className="minicart-certona" minH="250px">
        <CertonaRecommendation
          certonaData={ymalScheme}
          siteId={siteId}
          hidePrice={hideYmalPriceATC}
          label={
            ymalScheme?.explanation ||
            formatMessage({ id: 'pdp.product.pairItWith', defaultMessage: 'Pair it with' })
          }
          type="yaml"
          loading={false}
          variant="minicart"
          sliderOptions={{
            perPage: 3,
            arrows: ymalScheme?.items?.length > 2,
          }}
          skeletonVisible={false}
          onItemClick={onItemClick}
        />
      </Box>
    </>
  )
}

export default withErrorBoundaryWrapper(MinicartRecommendations)

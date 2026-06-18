import { useEffect, useMemo } from 'react'
import useCertonaScheme from 'toro/hooks/useCertonaScheme'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import get from 'lodash/get'
import { useIntl } from 'react-intl'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import BecauseYouViewedHeaderSkeleton from 'toro/components/Certona/BecauseYouViewedRecommendation/BecauseYouViewedHeaderSkeleton'
import EnhancedCarousel from 'toro/components/EnhancedRecommendation/EnhancedCarousel'
import CertonaSkeleton from 'toro/components/Certona/CertonaSkeleton'
import { useUpdateAtom, useAtomValue } from 'jotai/utils'
import { mostViewedProductAtom } from 'store/because-you-viewed-products.atom'
import { clearSchemeInCertonaAtom, CertonaScheme } from 'store/certona-schemes.atoms'
import { BECAUSE_YOU_VIEWED_RECOMMENDER_SCHEME } from 'toro/components/Certona/certona-schemes'

const CERTONA_PAGE_TYPE = 'sitevisit'

function BecauseYouViewedRecommendationPlp() {
  const styles = useStyleConfig('BecauseYouViewedRecommendation')
  const { formatMessage } = useIntl()
  const clearScheme = useUpdateAtom(clearSchemeInCertonaAtom)
  const mostViewedProduct = useAtomValue(mostViewedProductAtom)

  const featuredItemID = mostViewedProduct?.count > 1 ? mostViewedProduct?.vgId : undefined

  useEffect(() => {
    return () => {
      clearScheme(BECAUSE_YOU_VIEWED_RECOMMENDER_SCHEME)
    }
  }, [])

  const certonaData = useCertonaScheme(BECAUSE_YOU_VIEWED_RECOMMENDER_SCHEME, {
    pagetype: CERTONA_PAGE_TYPE,
    itemid: featuredItemID,
    enabled: true,
    force: true,
    recommendations: true,
  }) as CertonaScheme

  const { referenceProduct, certonaSchema } = useMemo(() => {
    const products = get(certonaData, 'items', [])
    const referenceProduct = products[0]
    const recommendedProducts = products.slice(1)

    return { referenceProduct, certonaSchema: { ...certonaData, items: recommendedProducts } }
  }, [certonaData])

  const shouldCollapseCertonaContainer = !certonaData?.items?.length

  const label =
    certonaData?.explanation ||
    formatMessage({
      id: 'pdp.product.becauseYouViewed',
      defaultMessage: 'Because you viewed',
    })

  if (shouldCollapseCertonaContainer) {
    return null
  }

  const renderBecauseYouViewedHeader = () => {
    if (!certonaSchema) {
      return <BecauseYouViewedHeaderSkeleton />
    }

    const thumbnailImage = String(referenceProduct?.imageURL).replace(
      '$imageRec$',
      '$mobilePLPSwatch$'
    )

    return (
      <Box sx={styles.certonaHeaderContainer}>
        <Box sx={styles.certonaHeaderThumbnail}>
          <Image
            className="product-image"
            src={thumbnailImage}
            alt={`${referenceProduct?.name}, ${referenceProduct?.Color}, ProductTile`}
            maxWidth={'none'}
            lazy
          />
        </Box>

        <Flex sx={styles.certonaHeaderTitleWrapper}>
          <Box
            as="h2"
            className="certona_title"
            sx={styles.certonaHeaderTitle}
            data-qa="certona-title"
          >
            {label}
          </Box>

          <Box as="h3" sx={styles.certonaHeaderSubTitle}>
            {referenceProduct?.name}
          </Box>
        </Flex>
      </Box>
    )
  }

  return (
    <Box sx={styles.becauseYouViewedRecommendationContainer} id="because-you-viewed-plp">
      <Flex sx={styles.becauseYouViewedWrapper} className="certona_wrapper">
        {renderBecauseYouViewedHeader()}
        {!certonaSchema ? (
          <CertonaSkeleton
            variant={'BecauseYouViewedPDPRecommendation'}
            manageVisibility={() => {}}
          />
        ) : (
          <EnhancedCarousel recommendationData={certonaSchema} label={label} />
        )}
      </Flex>
    </Box>
  )
}

export default BecauseYouViewedRecommendationPlp

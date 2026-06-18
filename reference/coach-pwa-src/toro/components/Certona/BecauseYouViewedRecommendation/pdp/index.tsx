import { useEffect, useMemo } from 'react'
import useCertonaScheme from 'toro/hooks/useCertonaScheme'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import get from 'lodash/get'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { mostViewedProductAtom } from 'store/because-you-viewed-products.atom'
import { useIntl } from 'react-intl'
import CertonaRecommendation from 'toro/components/Certona/Recommendation'
import BecauseYouViewedHeaderSkeleton from 'toro/components/Certona/BecauseYouViewedRecommendation/BecauseYouViewedHeaderSkeleton'
import { clearSchemeInCertonaAtom, CertonaScheme } from 'store/certona-schemes.atoms'
import type { BecauseYouViewedRecommendationProps } from 'toro/components/Certona/BecauseYouViewedRecommendation/types'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import usePageType from 'toro/hooks/usePageType'

function BecauseYouViewedRecommendation({
  hidePrice,
  certonaScheme,
  pageType,
  variant,
}: BecauseYouViewedRecommendationProps) {
  const styles = useStyleConfig('BecauseYouViewedRecommendation', {
    variant,
  })
  const { formatMessage } = useIntl()
  const mostViewedProduct = useAtomValue(mostViewedProductAtom)
  const clearScheme = useUpdateAtom(clearSchemeInCertonaAtom)
  const { isPLP } = usePageType()

  const featuredItemID = mostViewedProduct?.count > 1 ? mostViewedProduct?.vgId : undefined

  useEffect(() => {
    return () => {
      clearScheme(certonaScheme)
    }
  }, [])

  const certonaData = useCertonaScheme(certonaScheme, {
    pagetype: pageType,
    enabled: true,
    itemid: featuredItemID,
    force: true,
    recommendations: true,
  }) as CertonaScheme

  const { referenceProduct, certonaSchema } = useMemo(() => {
    const products = get(certonaData, 'items', [])
    const referenceProduct = products[0]
    const recommendedProducts = products.slice(1)

    return { referenceProduct, certonaSchema: { ...certonaData, items: recommendedProducts } }
  }, [certonaData])

  const shouldCollapseCertonaContainer =
    certonaSchema && (certonaSchema?.items?.length === 0 || !referenceProduct)

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
    <Box
      sx={styles.becauseYouViewedRecommendationContainer}
      id={isPLP ? 'because-you-viewed-plp' : 'because-you-viewed-pdp'}
    >
      <Flex sx={styles.becauseYouViewedWrapper} className="certona_wrapper">
        {renderBecauseYouViewedHeader()}

        <CertonaRecommendation
          certonaData={certonaSchema}
          hidePrice={hidePrice}
          variant={variant}
          label={label}
          isLoading={!certonaSchema}
        />
      </Flex>
    </Box>
  )
}

export default BecauseYouViewedRecommendation

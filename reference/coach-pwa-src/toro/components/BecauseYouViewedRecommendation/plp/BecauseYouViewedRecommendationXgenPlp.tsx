import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai/utils'

import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Image from 'toro/components/Image'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import BecauseYouViewedHeaderSkeleton from 'toro/components/Certona/BecauseYouViewedRecommendation/BecauseYouViewedHeaderSkeleton'
import CertonaSkeleton from 'toro/components/Certona/CertonaSkeleton'
import EnhancedCarousel from 'toro/components/EnhancedRecommendation/EnhancedCarousel'
import {
  adaptXgenToEnhancedRecommendation,
  type EnhancedRecommendationScheme,
} from 'toro/components/EnhancedRecommendation/adapters'
import { xgenClientAtom } from 'store/xgen.atom'
import { XgenContainerID } from 'toro/lib/xgen/types'
import { mostViewedProductAtom } from 'store/because-you-viewed-products.atom'
import { activeFiltersAtom } from 'store/search-results.atom'
import type { CertonaScheme } from 'store/certona-schemes.atoms'
import { getProductImageSrc } from 'toro/helpers/productImages'
import isEmpty from 'lodash/isEmpty'

function BecauseYouViewedRecommendationXgenPlp({ type }: { type: string }) {
  const styles = useStyleConfig('BecauseYouViewedRecommendation')
  const xgenClient = useAtomValue(xgenClientAtom)

  const mostViewedProduct = useAtomValue(mostViewedProductAtom)
  const activeFilters = useAtomValue(activeFiltersAtom)

  const featuredVgId = mostViewedProduct?.count > 1 ? mostViewedProduct?.vgId : undefined

  const [xgenData, setXgenData] = useState<EnhancedRecommendationScheme | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchXgenRecommendations = useCallback(async () => {
    if (!xgenClient) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      if (featuredVgId) {
        await xgenClient.recommendations.setContext({ mostViewedProd: featuredVgId })
      }

      const containerId = XgenContainerID[type]
      const rawData = await xgenClient.recommendations.getRaw(containerId)
      const matchingContainer = rawData?.containers?.find(
        (container) => container.containerId === containerId
      )

      if (matchingContainer) {
        setXgenData(adaptXgenToEnhancedRecommendation(matchingContainer, type))
      } else {
        setXgenData(null)
      }
    } catch {
      setXgenData(null)
    } finally {
      await xgenClient.recommendations.setContext({ mostViewedProd: undefined })
      setIsLoading(false)
    }
  }, [xgenClient, featuredVgId, type])

  useEffect(() => {
    fetchXgenRecommendations()
  }, [fetchXgenRecommendations])

  const { referenceProduct, carouselData, label } = useMemo(() => {
    if (isEmpty(xgenData)) {
      return {
        referenceProduct: null,
        carouselData: null,
        label: '',
      }
    }

    const items = xgenData?.items ?? []

    return {
      referenceProduct: items[0] ?? null,
      carouselData: {
        ...xgenData,
        items: items.slice(1)?.map((item, idx) => {
          const variantType = idx % 3 === 0 ? 'Large' : 'Small'
          return {
            ...item,
            imageURL: `${item?.imageURL}?$YMALPDP${variantType}$`,
          }
        }),
      },
      label: xgenData.explanation ?? '',
    }
  }, [xgenData])

  if (activeFilters.length > 0) return null
  if (!isLoading && !xgenData) return null

  const renderHeader = () => {
    if (isLoading) {
      return <BecauseYouViewedHeaderSkeleton />
    }

    return (
      <Box sx={styles.certonaHeaderContainer}>
        {referenceProduct?.imageURL && (
          <Box sx={styles.certonaHeaderThumbnail}>
            <Image
              className="product-image"
              src={getProductImageSrc(referenceProduct.imageURL, 'mobile', 'plp', {
                isSwatchImage: true,
              })}
              alt={`${referenceProduct?.name ?? ''}, ProductTile`}
              maxWidth={'none'}
              lazy
            />
          </Box>
        )}
        <Flex sx={styles.certonaHeaderTitleWrapper}>
          <Box
            as="h2"
            className="certona_title"
            sx={styles.certonaHeaderTitle}
            data-qa="byv-xgen-title"
          >
            {label}
          </Box>
          {referenceProduct?.name && (
            <Box as="h3" sx={styles.certonaHeaderSubTitle}>
              {referenceProduct.name}
            </Box>
          )}
        </Flex>
      </Box>
    )
  }

  return (
    <Box sx={styles.becauseYouViewedRecommendationContainer} id="because-you-viewed-plp">
      <Flex sx={styles.becauseYouViewedWrapper} className="certona_wrapper">
        {renderHeader()}
        {isLoading ? (
          <CertonaSkeleton
            variant={'BecauseYouViewedPDPRecommendation'}
            manageVisibility={() => {}}
          />
        ) : (
          <EnhancedCarousel recommendationData={carouselData as CertonaScheme} label={label} />
        )}
      </Flex>
    </Box>
  )
}

export default BecauseYouViewedRecommendationXgenPlp

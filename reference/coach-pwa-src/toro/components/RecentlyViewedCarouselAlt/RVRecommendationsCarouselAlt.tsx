import { memo, Ref, useRef, useCallback } from 'react'
import Flex from 'toro/components/Flex'
import Image from 'toro/components/Image'
import Text from 'toro/components/Text'
import Link from 'toro/components/Link'
import { CertonaSchemeType } from 'store/certona-schemes.atoms'
import AddToBagButton from 'toro/components/AddToBagButton'
import { getRelativeUrl } from 'toro/lib/sales-force-connector/utils/getUrl'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import useRVRecommendations from 'toro/hooks/useRVRecommendations'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useInView } from 'react-intersection-observer'
import Box from 'toro/components/Box'

const MAX_HORIZONTAL_ITEMS_LIMIT = 2

export type RVRecommendationsAltConfig = {
  location: string
  certonaScheme: CertonaSchemeType
  enableBadging: boolean
  limit?: number
  forwardedRef?: Ref<{ getHeight: () => number }>
}

const RVRecommendationsCarouselAlt = ({
  location,
  certonaScheme,
  enableBadging,
  limit,
  forwardedRef,
}: RVRecommendationsAltConfig) => {
  const carouselRef = useRef(null)
  const styles = useStyleConfig('RVCarouselAlt')
  const analytics = useAnalytics()
  const hasTrackedImpression = useRef(false)

  const {
    experienceId,
    title,
    products,
    display,
    vendorScheme,
    handleClick,
    onLinkClick,
    onTileVisible,
  } = useRVRecommendations({
    location,
    certonaScheme,
    enableBadging,
    limit,
    forwardedRef,
    carouselRef,
  })

  const { ref: inViewRef } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    onChange: (inView) => {
      if (inView && !hasTrackedImpression.current && display && products.length > 0) {
        hasTrackedImpression.current = true
        analytics.send('listInteraction', {
          eventAction: 'recommendation dropdown module impression',
          eventLabel: title?.toLowerCase() || 'recently viewed',
        })
      }
    },
  })

  const containerRef = useCallback(
    (node) => {
      carouselRef.current = node
      inViewRef(node)
    },
    [inViewRef]
  )

  const productsLength = products.length

  if (!productsLength || !display) {
    return null
  }

  return (
    <Box sx={styles.rvWrapper}>
      <Flex id="rv_container" sx={styles.rvContainer} onClick={handleClick} ref={containerRef}>
        {productsLength > MAX_HORIZONTAL_ITEMS_LIMIT && (
          <Text sx={{ ...styles.rvTitle, ...styles.rvTitleTopPosition }} className="rv-title">
            {title}
          </Text>
        )}
        <Flex sx={styles.rvCarousel} id="rv_carousel">
          {productsLength <= MAX_HORIZONTAL_ITEMS_LIMIT && (
            <Text sx={styles.rvTitle} className="rv-title">
              {title}
            </Text>
          )}
          {products.map((product, idx) => {
            return (
              <ImpressionSensor
                key={`product-${product?.ID}`}
                payload={{ idx, product }}
                onVisible={onTileVisible(product, idx)}
                threshold={1}
                rootMargin={'0px'}
                className="rvImpressionSensor"
              >
                <AddToBagButton
                  variantId={product.variationId}
                  variantGroupId={product.ID}
                  isSizedProduct={product.isSized}
                  analyticsData={{
                    experienceId,
                    eventLocation: vendorScheme,
                    recAIType: product.vendor,
                    containerLabel: title,
                    sendSelectItemFirst: true,
                    index: `${idx + 1}`,
                  }}
                  styleVariant="collapsibleRVOverlay"
                />
                <Link
                  key={product.detailURL}
                  href={getRelativeUrl(product.detailURL)}
                  onClick={onLinkClick(product, idx)}
                >
                  <Image
                    key={product.imageURL}
                    src={product.imageURL}
                    noMinW
                    noMinH
                    sx={styles.rvImage}
                    data-qa="RV_tile_link_pt_img"
                  />
                </Link>
              </ImpressionSensor>
            )
          })}
        </Flex>
      </Flex>
    </Box>
  )
}

export default memo(RVRecommendationsCarouselAlt)

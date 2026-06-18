import { memo, Ref, useRef } from 'react'
import Flex from 'toro/components/Flex'
import Image from 'toro/components/Image'
import Text from 'toro/components/Text'
import Link from 'toro/components/Link'
import Box from 'toro/components/Box'
import { CertonaSchemeType } from 'store/certona-schemes.atoms'
import RecommendationPrice from 'toro/components/Certona/RecommendationPrice'
import { getRelativeUrl } from 'toro/lib/sales-force-connector/utils/getUrl'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import useRVRecommendations from 'toro/hooks/useRVRecommendations'

export type RVRecommendationsConfig = {
  location: string
  certonaScheme: CertonaSchemeType
  enableBadging: boolean
  limit?: number
  forwardedRef?: Ref<{ getHeight: () => number }>
}

const RVRecommendationsCarousel = ({
  location,
  certonaScheme,
  enableBadging,
  limit,
  forwardedRef,
}: RVRecommendationsConfig) => {
  const carouselRef = useRef(null)
  const styles = useStyleConfig('RVCarousel')

  const { title, products, display, vendorScheme, handleClick, onLinkClick, onTileVisible } =
    useRVRecommendations({
      location,
      certonaScheme,
      enableBadging,
      limit,
      forwardedRef,
      carouselRef,
    })

  if (!products.length || !display) {
    return null
  }

  return (
    <Flex id="rv_container" sx={styles.rvContainer} onClick={handleClick} ref={carouselRef}>
      <Text sx={styles.rvTitle} className="rv-title">
        {title}
      </Text>
      <Flex sx={styles.rvCarouselWrapper}>
        <Flex sx={styles.rvCarousel} id="rv_carousel">
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
                <Link
                  key={product.detailURL}
                  href={getRelativeUrl(product.detailURL)}
                  onClick={onLinkClick(product, idx)}
                >
                  <Image
                    key={product.imageURL}
                    src={product.imageURL}
                    height="auto"
                    width="24.7vw"
                    aspectRatio={0.8}
                    noMinW
                    noMinH
                    sx={styles.rvImage}
                    data-qa="RV_tile_link_pt_img"
                  />
                  <RecommendationPrice
                    product={product}
                    scheme={vendorScheme}
                    variant="RVRecommendationsItem"
                    hidePrice={false}
                  />
                  {product.isAlmostGone && (
                    <Text sx={styles.rvBadgeText}>{product.Availability} left</Text>
                  )}
                  {product.promotions?.map(({ type, content }) => (
                    <Box
                      key={type}
                      sx={styles.rvPromo}
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ))}
                </Link>
              </ImpressionSensor>
            )
          })}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default memo(RVRecommendationsCarousel)

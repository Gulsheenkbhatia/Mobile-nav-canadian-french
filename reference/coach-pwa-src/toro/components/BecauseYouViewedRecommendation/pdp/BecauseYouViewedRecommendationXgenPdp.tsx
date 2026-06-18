import { memo, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import Link from 'toro/components/Link'
import BYVPdpSkeleton from 'toro/components/BecauseYouViewedRecommendation/pdp/BYVPdpSkeleton'
import RecommendationPrice from 'toro/components/Certona/RecommendationPrice'
import AddToBagButton from 'toro/components/AddToBagButton'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import usePreference from 'toro/hooks/usePreference_new'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useBYVRecommendations from 'toro/hooks/useBYVRecommendations'
import { XgenContainerID } from 'toro/lib/xgen/types'
import { getProductImageSrc } from 'toro/helpers/productImages'
import { RecommendationVendors } from 'toro/lib/vendorProductsAdapter/recommendations/configurations'
import type { RecentlyViewedProduct } from 'toro/hooks/useRecentlyViewedData'
import getProductURLHref from 'helpers/getProductURLHref'
import getAPIURL from 'helpers/getAPIURL'

const CONTAINER_ID = XgenContainerID.sm_el_sitevisit2

type CardProduct = RecentlyViewedProduct

interface BYVPdpCardProps {
  product: CardProduct
  idx: number
  hidePrice: boolean
  scheme: string
  experienceId: string
  label: string
  addImpression: (payload: any) => void
  selectRecommItem: (payload: any) => Promise<void>
  hasAtbButton: boolean
  styles: Record<string, any>
}

const BYVPdpCard = memo(
  ({
    product,
    idx,
    hidePrice,
    scheme,
    experienceId,
    label,
    addImpression,
    selectRecommItem,
    hasAtbButton,
    styles,
  }: BYVPdpCardProps) => {
    const [isATBButtonDisabled, setIsATBButtonDisabled] = useState(false)
    const pdpUrl = getProductURLHref(product?.detailURL)

    const onTileVisible = () => {
      addImpression({
        listName: label,
        product: { ...product, is_quick_add: isATBButtonDisabled ? '0' : '1' },
        idx,
        certonaScheme: scheme,
        recAIType: RecommendationVendors.XGEN,
      })
    }

    const onLinkClick = async () => {
      await selectRecommItem({
        listName: label,
        product: { ...product, is_quick_add: isATBButtonDisabled ? '0' : '1' },
        idx,
        eventLocation: scheme,
        recAIType: RecommendationVendors.XGEN,
      })
    }

    return (
      <ImpressionSensor onVisible={onTileVisible} threshold={1}>
        <Box sx={styles.card}>
          <Link
            href={pdpUrl}
            prefetchUrl={getAPIURL(pdpUrl)}
            prefetch
            onClick={onLinkClick}
            data-qa="byv-pdp-product-link"
          >
            <Box sx={styles.cardImageWrapper}>
              <Image
                className="product-image"
                src={getProductImageSrc(product?.imageURL, 'mobile', 'plp')}
                alt={product?.name ?? ''}
                sx={styles.cardImage}
                lazy
              />
            </Box>
          </Link>

          <Box sx={styles.cardNamePriceWrapper}>
            <Box as="p" sx={styles.cardName} data-qa="byv-pdp-product-name">
              {product?.name}
            </Box>
            <RecommendationPrice
              product={product}
              hidePrice={hidePrice}
              scheme={scheme}
              variant="BecauseYouViewedPdp"
            />
          </Box>

          {hasAtbButton && (
            <Box sx={styles.cardAtbWrapper}>
              <AddToBagButton
                styles={{
                  button: styles.atbButton,
                  buttonText: styles.atbButtonText,
                }}
                variantId={product?.variationId}
                variantGroupId={product?.ID}
                isSizedProduct={product?.isSized}
                analyticsData={{
                  eventLocation: scheme,
                  experienceId,
                  recAIType: RecommendationVendors.XGEN,
                }}
                setIsATBButtonDisabled={setIsATBButtonDisabled}
              />
            </Box>
          )}
        </Box>
      </ImpressionSensor>
    )
  }
)

function BecauseYouViewedRecommendationXgenPdp() {
  const styles = useMultiStyleConfig('BecauseYouViewedPdp')
  const carouselRef = useRef<HTMLDivElement>(null)
  const { ref: sectionRef, inView } = useInView({ triggerOnce: true })

  const {
    recommendations: { hideRecommendationPrice: hidePrice, atbDisabledSchemes = [] },
  } = usePreference({
    recommendations: ['hideRecommendationPrice', 'atbDisabledSchemes'],
  })

  const hasAtbButton = !atbDisabledSchemes.includes(CONTAINER_ID)

  const {
    isLoading,
    display,
    referenceProduct,
    products: carouselItems,
    eyebrowLabel: label,
    experienceId,
    addImpression,
    selectRecommItem,
  } = useBYVRecommendations(CONTAINER_ID, { enabled: inView })

  useEffect(() => {
    carouselRef.current?.scrollTo({ left: 0 })
  }, [carouselItems])

  if (!isLoading && !display) return null

  const thumbnailSrc = referenceProduct?.imageURL
    ? getProductImageSrc(referenceProduct.imageURL, 'mobile', 'plp', { isSwatchImage: true })
    : undefined

  return (
    <Box
      ref={sectionRef}
      sx={styles.container}
      id="because-you-viewed-pdp"
      data-qa="byv-pdp-section"
    >
      <Box sx={styles.inner}>
        {isLoading ? (
          <BYVPdpSkeleton />
        ) : (
          <>
            <Box sx={styles.header}>
              <Box sx={styles.thumbnail}>
                {thumbnailSrc && (
                  <Image
                    src={thumbnailSrc}
                    alt={referenceProduct?.name ?? ''}
                    maxWidth="none"
                    lazy
                  />
                )}
              </Box>
              <Box sx={styles.titleWrapper}>
                <Box as="p" sx={styles.eyebrow} data-qa="byv-pdp-eyebrow">
                  {label}
                </Box>
                <Box as="p" sx={styles.productName} data-qa="byv-pdp-reference-name">
                  {referenceProduct?.name}
                </Box>
              </Box>
            </Box>
            <Box sx={styles.carouselTrack} ref={carouselRef} data-qa="byv-pdp-carousel">
              {carouselItems.map((product, idx) => (
                <BYVPdpCard
                  key={product?.ID ?? idx}
                  product={product}
                  idx={idx}
                  hidePrice={!!hidePrice}
                  scheme={CONTAINER_ID}
                  experienceId={experienceId}
                  label={label}
                  addImpression={addImpression}
                  selectRecommItem={selectRecommItem}
                  hasAtbButton={hasAtbButton}
                  styles={styles}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

export default BecauseYouViewedRecommendationXgenPdp

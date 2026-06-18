import { FC, useCallback, useRef } from 'react'
import ProductCard from 'toro/components/product/desktop/ProductCard'
import Box from 'toro/components/Box'
import HotSpotBadge from 'toro/components/product/desktop/HotspotBadge'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import ProductDetailsContentWrapper from 'toro/components/product/desktop/ProductDetails/ProductDetailsContentWrapper'
import { getProductDetailsMoveEvent } from 'toro/helpers/pdpGaEvents'
import useAnalytics from 'toro/analytics/useAnalytics'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import { useAtomValue } from 'jotai/utils'
import {
  isMegaPDPEligibleAtom,
  isNewMegaPDPEligibleAtom,
  productCardDetailsAtom,
} from 'store/pdp.atom'
import { useIntl } from 'react-intl'
import useProductData from 'toro/hooks/useProductData'

const ProductHighlights: FC = () => {
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('ProductHighlights')
  const productCardDetails = useAtomValue(productCardDetailsAtom)
  const analytics = useAnalytics()
  const selectedVariantId = useSelectedVariantData('id')
  const onCloseList = useRef([])
  const maxScrollPosRef = useRef(0)
  const onMove = useCallback(
    (idx: number) => {
      if (idx > maxScrollPosRef.current) {
        maxScrollPosRef.current = idx
        const eventPayload = getProductDetailsMoveEvent({ selectedVariantId })
        analytics.send(...eventPayload)
      }
      onCloseList.current.forEach((onClose) => onClose?.())
    },
    [selectedVariantId]
  )
  const productId = useProductData('id')
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const isNewMegaPDPEligible = useAtomValue(isNewMegaPDPEligibleAtom)

  const setCloseTooltip = useCallback((onClose) => {
    onCloseList.current.push(onClose)
  }, [])

  const onHotspotClick = (isOpen) => {
    if (!isOpen) {
      analytics.send('productInteraction', {
        event: 'product_interaction',
        eventLocation: isMegaPDPEligible || isNewMegaPDPEligible ? 'mega product' : 'product',
        eventAction: 'visual product details hotspot click',
        eventLabel: productId,
      })
    }
  }

  if (!productCardDetails?.length) return null

  return (
    <Box sx={styles.productDetails}>
      <Box as="h2" sx={styles.sectionSliderTitle} data-qa="cm_pdp_btn_pdtls_card_hdr">
        {formatMessage({
          id: 'pdp.product.productHighlightsTitle',
          defaultMessage: 'Product highlights',
        })}
      </Box>
      <ProductDetailsContentWrapper
        styles={styles}
        onMove={onMove}
        hasCardDetails={!!productCardDetails?.length}
        options={{
          gap: 'var(--spacing-2)',
        }}
        customPagination={false}
      >
        {productCardDetails ? (
          productCardDetails?.map((card) => (
            <ProductCard
              key={`${card?.title}-${card?.subtitle}`}
              styleVariant={card?.styleVariant}
              tangibleeCta={card?.tangibleeCta}
              imageUrl={card?.image}
            >
              <ProductCard.Body>
                <Box as="h2">{card.title}</Box>
                <ProductCard.Image
                  image={card?.image}
                  loadStrategy={card?.loadStrategy}
                  imgShift={card?.imgShift}
                >
                  {card?.hotspots?.map((item, idx) => (
                    <HotSpotBadge
                      key={`${idx}-${item?.title || ''}`}
                      {...item}
                      title={item?.title || ''}
                      styleVariant={card?.styleVariant}
                      titleAbove={item?.titleAbove}
                      setCloseTooltip={setCloseTooltip}
                      onClick={onHotspotClick}
                    />
                  ))}
                </ProductCard.Image>
              </ProductCard.Body>
            </ProductCard>
          ))
        ) : (
          <></>
        )}
      </ProductDetailsContentWrapper>
    </Box>
  )
}

export default ProductHighlights

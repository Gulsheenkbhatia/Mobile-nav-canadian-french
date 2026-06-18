import { FC, useCallback } from 'react'
import ProductCard from 'toro/components/product/desktop/ProductCard'
import Box from 'toro/components/Box'
import HotSpotBadge from 'toro/components/product/desktop/HotspotBadge'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import ProductCardTable from 'toro/components/product/desktop/ProductCardTable'
import ProductDetailsContentWrapper from 'toro/components/product/desktop/ProductDetails/ProductDetailsContentWrapper'
import { getProductDetailsMoveEvent } from 'toro/helpers/pdpGaEvents'
import useAnalytics from 'toro/analytics/useAnalytics'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import { useAtomValue } from 'jotai/utils'
import { productCardDetailsAtom } from 'store/pdp.atom'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'

const ProductDetails: FC = () => {
  const styles = useMultiStyleConfig('ProductDetails')
  const productCardDetails = useAtomValue(productCardDetailsAtom)
  const analytics = useAnalytics()
  const selectedVariantId = useSelectedVariantData('id')
  const onMove = useCallback(() => {
    const eventPayload = getProductDetailsMoveEvent({ selectedVariantId })
    analytics.send(...eventPayload)
  }, [selectedVariantId])
  const isV5_1 = useTemplate([TemplateName.pdpv5_1])

  return (
    <Box sx={styles.productDetails}>
      <Box as="h2" sx={styles.sectionSliderTitle} data-qa="cm_pdp_btn_pdtls_card_hdr">
        Product details
      </Box>
      <ProductDetailsContentWrapper
        styles={styles}
        onMove={onMove}
        hasCardDetails={!!productCardDetails?.length}
      >
        <ProductCardTable />
        {productCardDetails ? (
          productCardDetails?.map((card) => (
            <ProductCard
              key={`${card?.title}-${card?.subtitle}`}
              styleVariant={card?.styleVariant}
              tangibleeCta={card?.tangibleeCta}
              imageUrl={card?.image}
            >
              <ProductCard.Header>
                {card?.subtitle && !isV5_1 && (
                  <Box as="h3" className="vpc-eyebrow">
                    {card.subtitle}
                  </Box>
                )}
                <Box as="h2">{card.title}</Box>
                {card?.description && !isV5_1 && <Box as="h3">{card.description}</Box>}
              </ProductCard.Header>
              <ProductCard.Body>
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

export default ProductDetails

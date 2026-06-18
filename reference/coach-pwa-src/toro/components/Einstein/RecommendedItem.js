import React, { useState, useEffect, useMemo, memo, useCallback } from 'react'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import useViewportType from 'toro/hooks/useViewportType'
import Text from 'toro/components/Text'
import Image from 'toro/components/Image'
import Link from 'toro/components/Link'
import SaveForLater from 'toro/components/SaveForLater'
import Box from 'toro/components/Box'
import get from 'lodash/get'
import { InView } from 'react-intersection-observer'

function RecommendedItem({
  product,
  idx,
  viewport,
  siteId,
  comparablePriceOn,
  priceRangeTogglePref,
  handleClickReco,
  hidePrice,
  handleViewReco,
  visibleItemsOnViewPort,
  label,
  addImpression,
  addToWishlistRecommItem,
  scheme,
  variant,
  styles,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const { isMobile } = useViewportType()

  let price = 0
  let samePrice = false
  let oldPrice = 0
  const productNameWrapperStyles = useMemo(() => styles.productNameWrapper(viewport), [viewport])

  const recommendedPriceTextStyles = useMemo(
    () => styles.recommendedPriceText({ comparablePriceOn, samePrice }),
    [comparablePriceOn, samePrice]
  )

  const productImageMainWrapperStyles = useMemo(
    () => styles.productImageMainWrapper(viewport),
    [viewport]
  )

  const productImageStyles = useMemo(() => styles.productImage(isMobile), [isMobile])

  const productImageWrapperStyles = useMemo(() => styles.productImageWrapper(isMobile), [isMobile])
  const productWrapperStyles = useMemo(() => styles.productWrapper(isMobile), [isMobile])
  // selected variant id
  const selectedVariant = {}
  selectedVariant.productId = product.id

  const productURL = new URL(product?.product_url)
  const regexProductURL = /\/products\/.*/
  const productURLHref = productURL?.pathname?.match(regexProductURL)?.[0]
  // Price

  if (parseInt(product?.price?.saleprice) === 0) {
    price = product?.price?.fullprice
  } else {
    price = product?.price?.saleprice
    oldPrice = product?.price?.fullprice
  }
  if (price === oldPrice) {
    samePrice = true
  }

  const renderPrice = (price) => {
    let showPriceRange = false
    if (priceRangeTogglePref) {
      const enabledSiteValue = getSiteValueFromPref(priceRangeTogglePref, siteId)
      showPriceRange =
        typeof enabledSiteValue !== 'undefined'
          ? enabledSiteValue
          : get(priceRangeTogglePref, `value`)
    }
    if (
      showPriceRange &&
      price?.saleprice &&
      price?.fullprice &&
      price?.saleprice !== price?.fullprice
    ) {
      return <>{`${price?.currency}${price?.saleprice} - ${price?.currency}${price?.fullprice}`}</>
    }
    return <>{`${price?.currency}${price?.saleprice}`}</>
  }

  const stringifiedProductData = useMemo(() => JSON.stringify(product), [product])

  const handleInViewChange = (visible) => {
    if (visible) {
      setIsVisible(true)
      addImpression({ listName: label, product, idx, recAIType: 'einstein', certonaScheme: scheme })
    }
  }

  useEffect(() => {
    if (isVisible && idx > visibleItemsOnViewPort) {
      handleViewReco([{ id: product?.id }])
    }
  }, [isVisible])

  const onItemClick = useCallback(() => {
    handleClickReco(product?.id, idx, product)
  }, [product, idx])

  const onSuccess = useCallback(() => {
    addToWishlistRecommItem({
      listName: label,
      product,
      idx,
      eventLocation: scheme,
      recAIType: 'einstein',
    })
  }, [product, label, idx, scheme])

  return (
    <InView onChange={handleInViewChange}>
      <Box sx={productWrapperStyles}>
        <Link
          href={`${productURLHref}?rrec=true`}
          sx={styles.productLink}
          onClick={onItemClick}
          pageData={stringifiedProductData}
        >
          <Box as="div" sx={productImageMainWrapperStyles}>
            <Box sx={productImageWrapperStyles}>
              <Image
                src={product.image_url}
                alt={`${product.product_name}, ProductTile`}
                sx={productImageStyles}
                lazy
                data-qa={isMobile ? 'm_plp_link_pt_img' : 'd_plp_link_pt_img'}
              />
            </Box>
            <Box sx={productNameWrapperStyles}>
              <Text data-qa="cm_pdt_link_pt_title" sx={styles.productName}>
                {product.product_name}
              </Text>
            </Box>
          </Box>
        </Link>

        {!hidePrice && (
          <Box className="recommended-price" sx={styles.recommendedPriceMainWrapper}>
            <Box sx={styles.recommendedPriceTextWrapper}>
              <Text
                variant="secondary"
                className="active-price"
                data-qa="cm_txt_pdt_price"
                sx={recommendedPriceTextStyles}
              >
                {renderPrice(product?.price)}
              </Text>
            </Box>
            {oldPrice > 0 && !samePrice && !comparablePriceOn && (
              <Box sx={styles.oldPriceWrapper}>
                <Text
                  variant="body-text-secondary"
                  size="md"
                  className="old-price"
                  data-qa="cm_txt_pdt_price_strthr"
                  sx={styles.oldPriceText}
                >
                  ${oldPrice}
                </Text>
              </Box>
            )}
          </Box>
        )}
        {variant !== 'pdpV3EinsteinRecommendationMobile' && (
          <SaveForLater
            onAddToWishlistSuccess={onSuccess}
            name={product.product_name}
            selectedVariant={selectedVariant}
            pdpQaTag={'pdpQaTagRecomm'}
            isRecommendationTile
            styleVariant={variant}
            wrapperStyles={styles.saveForLaterPosition}
          />
        )}
      </Box>
    </InView>
  )
}

export default memo(RecommendedItem)

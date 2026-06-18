import React, { memo, useState, useMemo, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import Grid from 'toro/components/Grid'
import GridItem from 'toro/components/GridItem'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Image from 'toro/components/Image'
import Button from 'toro/components/Button'
import useStyles from 'toro/hooks/useStyles'
import { Product } from 'toro/components/ShopAssistChat/types'
import { formatPrice, toTitleCase } from 'toro/components/ShopAssistChat/utils'
import { NavChevronDownIcon, NavChevronUpIcon } from 'toro/icons'
import usePreference from 'toro/hooks/usePreference_new'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useAtomValue } from 'jotai/utils'
import { shopAssistChatStateAtom } from 'store/shop-assist-chat.atom'
import { useInView } from 'react-intersection-observer'

import ProductAddToBag from 'toro/components/ShopAssistChat/ProductAddToBag'

const PlpSizeDrawer = dynamic(() => import('toro/components/list/PlpSizeDrawer'), {
  ssr: false,
})

interface ProductTileRendererProps {
  products: Product[]
}

export const ProductTileRenderer = ({ products }: ProductTileRendererProps) => {
  const styles = useStyles()
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()

  const { activeSessionId } = useAtomValue(shopAssistChatStateAtom)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const skipNextImpressionRef = useRef(false)

  const [isSizeDrawerOpen, setIsSizeDrawerOpen] = useState(false)
  const [drawerAtbHandler, setDrawerAtbHandler] = useState(null)

  const handleRegisterDrawerHandler = useCallback((handler) => {
    setDrawerAtbHandler(() => handler)
  }, [])

  const {
    aiGiftConcierge: {
      aiGiftConciergeData: {
        giftingAssistantProductDisplayCount: initialDisplayCount = 6,
        giftingAssistantMaxProductsReturned: maxDisplayCount = 12,
      } = {},
    } = {},
    generalConfiguration: { siteIdentifier },
    priceSitePreferences: { isComparablePriceValue = false },
  } = usePreference({
    aiGiftConcierge: ['aiGiftConciergeData'],
    generalConfiguration: ['siteIdentifier'],
    priceSitePreferences: ['isComparablePriceValue'],
  })

  const totalProducts = products?.length || 0
  const effectiveMax = Math.min(totalProducts, maxDisplayCount)

  const [displayCount, setDisplayCount] = useState(Math.min(initialDisplayCount, effectiveMax))

  const moreProducts = effectiveMax > 1

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  })

  const displayedProducts = useMemo(
    () => products?.slice(0, displayCount) || [],
    [products, displayCount]
  )

  const hasMoreProducts = displayCount < effectiveMax

  const formatAnalyticsItems = (items: Product[], startIndex = 0) =>
    items.map((product, index) => {
      const wasPriceNumber = Number(product.price)
      const salePriceNumber = product.sale_price != null ? Number(product.sale_price) : null

      const isValidSalePrice =
        salePriceNumber != null &&
        Number.isFinite(salePriceNumber) &&
        salePriceNumber < wasPriceNumber

      const netPriceNumber = isValidSalePrice ? salePriceNumber : wasPriceNumber

      const formattedWasPrice = Number.isFinite(wasPriceNumber) ? wasPriceNumber.toFixed(2) : '0'

      const formattedNetPrice = Number.isFinite(netPriceNumber)
        ? netPriceNumber.toFixed(2)
        : formattedWasPrice

      const discountNumber =
        isValidSalePrice && Number.isFinite(wasPriceNumber) ? wasPriceNumber - netPriceNumber : 0

      const formattedDiscount = discountNumber ? discountNumber.toFixed(2) : '0'

      const categories = (product.category ?? '')
        .split('>')
        .map((c) => toTitleCase(c.trim()))
        .filter(Boolean)
        .slice(0, 4)

      const categoryFields = categories.reduce<Record<string, string>>((acc, cat, i) => {
        const key = i === 0 ? 'item_category' : `item_category${i + 1}`
        acc[key] = cat
        return acc
      }, {})

      const masterId = product.masterId || product.id.split('-')[0]

      return {
        extendAnalyticsData: {
          ...categoryFields,
          item_list_name: 'gift-assistant',
          item_name: product.title,
          item_id: masterId,
          price: formattedNetPrice,
          color: product.color,
          index: String(startIndex + index + 1),
          item_variant: product.item_variant,
          was_price: formattedWasPrice,
          net_price: formattedNetPrice,
          list_price: formattedNetPrice,
          item_discount: formattedDiscount,
        },
        eventLocation: 'gift assistant',
      }
    })

  useEffect(() => {
    if (skipNextImpressionRef.current) {
      skipNextImpressionRef.current = false
      return
    }

    if (!inView) return
    if (!displayedProducts.length) return

    analytics.send('viewItemListCategory', {
      items: formatAnalyticsItems(displayedProducts, 0),
    })
  }, [inView])

  const activateProduct = (product: Product) => {
    if (typeof window !== 'undefined' && product?.url) {
      window.open(product.url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleProductTileClick = (product: Product) => (e: React.MouseEvent) => {
    e.preventDefault()

    activateProduct(product)

    const actualIndex = products.findIndex((p) => p.id === product.id)

    const [formattedProduct] = formatAnalyticsItems([product], actualIndex)

    analytics.send('selectItem', {
      product: formattedProduct,
      eventLocation: 'gift assistant',
    })
  }

  const handleProductTileKeyDown = (product: Product) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      activateProduct(product)
    }
  }

  const handleShowMore = () => {
    skipNextImpressionRef.current = true

    const nextCount = Math.min(displayCount + initialDisplayCount, effectiveMax)

    const newlyVisibleProducts = products.slice(displayCount, nextCount)

    if (newlyVisibleProducts.length) {
      analytics.send('viewItemListCategory', {
        items: formatAnalyticsItems(newlyVisibleProducts, displayCount),
      })
    }

    setDisplayCount(nextCount)

    analytics.send('agentInteraction', {
      eventAction: 'see more products',
      eventLabel: window.location.pathname,
      agentSessionId: activeSessionId,
    })
  }

  const handleShowLess = () => {
    setDisplayCount(Math.min(initialDisplayCount, effectiveMax))

    requestAnimationFrame(() => {
      const current = wrapperRef.current?.closest('[data-id]')
      if (!current) return

      let prevUser = Array.from(current.parentElement?.children || [])
        ?.slice(0, Array.from(current.parentElement?.children || []).indexOf(current))
        ?.reverse()
        ?.find((el) => (el as HTMLElement).id?.startsWith('user-')) as HTMLElement | undefined

      if (!prevUser) return

      prevUser.scrollIntoView({ behavior: 'smooth', block: 'start' })
      prevUser.focus({ preventScroll: true })
    })
  }

  const isKateSpadeOutlet = siteIdentifier === 'ksna-surprise'
  const showComparablePrice = isKateSpadeOutlet && isComparablePriceValue

  const renderProductTile = useCallback(
    (product: Product) => {
      return (
        <Box
          sx={{
            ...styles.productTile,
            ...(moreProducts && styles.productTileGrid),
          }}
          tabIndex={0}
          onClick={handleProductTileClick(product)}
          onKeyDown={handleProductTileKeyDown(product)}
          data-qa="suggested-product-tile"
        >
          <Box
            sx={{
              ...styles.productImageContainer,
              ...(moreProducts && styles.productImageContainerGrid),
            }}
          >
            {product?.image_url && (
              <Image
                src={product?.image_url}
                alt={product?.title}
                sx={styles.productImageView}
                lazy
              />
            )}
          </Box>

          <Box
            sx={{
              ...styles.productDetails,
              ...(showComparablePrice && moreProducts && styles.productDetailsComparable),
              ...(moreProducts && styles.productDetailsGrid),
            }}
          >
            <Text sx={styles.productTitle} data-qa="ai-product-name">
              {product?.title}
            </Text>

            {(!!product?.sale_price || !!product?.price) && (
              <Box
                sx={{
                  ...styles.priceContainer,
                  ...(showComparablePrice && styles.priceContainerComparable),
                }}
              >
                {showComparablePrice && !!product?.comparable_price && (
                  <Text sx={styles.comparablePriceText}>
                    {formatMessage(
                      {
                        id: 'shopAssistChat.productItem.comparableValue',
                        defaultMessage: 'Comparable Value {comparablePrice}',
                      },
                      { comparablePrice: formatPrice(product?.comparable_price) }
                    )}
                  </Text>
                )}
                {product?.sale_price ? (
                  <Box
                    sx={{
                      ...styles.priceContainer,
                      ...(showComparablePrice && styles.comparablePriceRow),
                    }}
                  >
                    <Text sx={styles.salePrice} data-qa="ai-final-price">
                      {formatPrice(product?.sale_price)}
                    </Text>

                    <Text sx={styles.originalPrice} data-qa="ai-strikethrough-price">
                      {formatPrice(product?.price)}
                    </Text>

                    {product?.discount_percentage && (
                      <Text sx={styles.discountText}>
                        {formatMessage(
                          {
                            id: 'shopAssistChat.productItem.discount',
                            defaultMessage: '({percentage}% Off)',
                          },
                          { percentage: product?.discount_percentage }
                        )}
                      </Text>
                    )}
                  </Box>
                ) : (
                  <Text sx={styles.productPrice}>{formatPrice(product?.price)}</Text>
                )}
              </Box>
            )}

            <Box sx={styles.addToBagContainer}>
              <ProductAddToBag
                productId={product.id}
                setIsSizeDrawerOpen={setIsSizeDrawerOpen}
                registerDrawerHandler={handleRegisterDrawerHandler}
                formatAnalyticsItems={formatAnalyticsItems}
                productIndex={products.findIndex((p) => p.id === product.id)}
                productData={product}
              />
            </Box>
          </Box>
        </Box>
      )
    },
    [styles, moreProducts, showComparablePrice, isSizeDrawerOpen, products]
  )

  const renderToggleButton = () => {
    if (effectiveMax <= initialDisplayCount) return null

    return (
      <Box sx={styles.toggleButtonContainer}>
        <Button
          variant="ghost"
          sx={styles.toggleButton}
          onClick={hasMoreProducts ? handleShowMore : handleShowLess}
        >
          {hasMoreProducts
            ? formatMessage({
                id: 'shopAssistChat.products.showMore',
                defaultMessage: 'See More Products',
              })
            : formatMessage({
                id: 'shopAssistChat.products.showLess',
                defaultMessage: 'See Less Products',
              })}

          {hasMoreProducts ? (
            <NavChevronDownIcon width="24px" height="24px" />
          ) : (
            <NavChevronUpIcon width="24px" height="24px" />
          )}
        </Button>

        <Box as="hr" sx={styles.productDivider} />
      </Box>
    )
  }

  if (effectiveMax === 1) {
    return (
      <Box>
        {renderProductTile(displayedProducts[0])}
        {renderToggleButton()}
        {isSizeDrawerOpen && (
          <PlpSizeDrawer setIsOpen={setIsSizeDrawerOpen} onAddToBagClick={drawerAtbHandler} />
        )}
      </Box>
    )
  }

  return (
    <>
      <Box ref={wrapperRef}>
        <Grid sx={styles.productGrid} ref={inViewRef}>
          {displayedProducts?.map((product) => (
            <GridItem key={product.id}>{renderProductTile(product)}</GridItem>
          ))}
        </Grid>

        {renderToggleButton()}
      </Box>

      {isSizeDrawerOpen && (
        <PlpSizeDrawer setIsOpen={setIsSizeDrawerOpen} onAddToBagClick={drawerAtbHandler} />
      )}
    </>
  )
}

export default memo(ProductTileRenderer)

import { ReactElement, useCallback, useState } from 'react'
import { useAtomValue } from 'jotai/utils'
import { useIntl } from 'react-intl'
import SaveForLater from 'toro/components/SaveForLater'
import ProductItemTile from 'toro/components/ProductItemTile'
import { ProductItem, Variant } from 'toro/types'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import { isOneCoachNAEnabledAtom } from 'store/menu-data.atom'

import type { AnalyticsEvents } from 'toro/components/RecommendationsContainer/types'
import AddToBagButton, { type AddToBagButtonVariant } from 'toro/components/AddToBagButton'
import { RecommendationVendors } from 'toro/lib/vendorProductsAdapter/recommendations/configurations'
import getAPIURL from 'helpers/getAPIURL'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import Link from 'toro/components/Link'
import Skeleton from 'toro/components/Skeleton'

type RecommendationItemTileProps = {
  idx?: number
  containerId: string
  strategyId: string
  onClick?: () => void
  variants?: Variant[]
  productItem: ProductItem
  styleVariant?: AddToBagButtonVariant
  variantControls?: ReactElement
  analyticsEvents: AnalyticsEvents
  containerLabel?: string
  vendor: RecommendationVendors
  showSkeleton?: boolean
  hideWishlist?: boolean
  hidePromotions?: boolean
  enableInlineAddToBag?: boolean
}

const RecommendationItemTile = ({
  idx,
  containerId,
  strategyId,
  onClick,
  variants,
  productItem,
  styleVariant,
  variantControls,
  analyticsEvents,
  containerLabel,
  vendor,
  showSkeleton = false,
  hideWishlist = false,
  hidePromotions = false,
  enableInlineAddToBag = false,
}: RecommendationItemTileProps) => {
  const [selectedVariant, setSelectedVariant] = useState<Partial<ProductItem>>(
    variants && variants.length ? variants.find((variant) => variant.isDefault) : productItem
  )

  const onVariantChange = useCallback(
    (variantId: string) => {
      setSelectedVariant(variants?.find((variant) => variant.id === variantId))
    },
    [variants]
  )

  const styles = useMultiStyleConfig('RecommendationItemTile', { variant: styleVariant })
  const isOneCoachNAEnabled = useAtomValue(isOneCoachNAEnabledAtom)

  const { image, name } = selectedVariant
  const { price, url, allowSaving, displayAtb, ctsButton, promotions } = productItem

  /*
   * this is a temporary solution:
   * we'll segregate the product tile into:
   * Controller(handlers) and View Model(state, computations)
   * */

  const onVisible = useCallback(() => {
    analyticsEvents.onTileVisible(
      productItem,
      idx,
      containerLabel ? { listName: containerLabel } : {}
    )
  }, [productItem, idx, analyticsEvents])

  const onWrapperClick = useCallback(() => {
    onClick?.()

    analyticsEvents.onTileClick(
      productItem,
      idx,
      containerLabel ? { listName: containerLabel } : {}
    )
  }, [productItem, idx, analyticsEvents, onClick])

  const onAddToWishlist = useCallback(() => {
    analyticsEvents.onAddToWishlistSuccess(productItem, idx)
  }, [productItem, idx, analyticsEvents])

  const onRemoveFromWishlist = useCallback(() => {
    analyticsEvents.onRemoveFromWishlistSuccess(productItem, idx)
  }, [productItem, idx, analyticsEvents])

  const onLinkClick = useCallback(() => {
    analyticsEvents.onLinkClick(productItem, idx)
  }, [productItem, idx, analyticsEvents])

  const { formatMessage } = useIntl()

  if (showSkeleton) {
    const height = (image?.aspectRatio || 1.25) * 100

    return (
      <ProductItemTile styles={styles}>
        <Box sx={styles.tileWrapper} position="relative">
          <Box sx={styles.tileImageWrapper}>
            <Skeleton
              isLoaded={false}
              sx={{
                width: '100%',
                paddingBottom: `${height}%`,
                bg: 'var(--color-neutral-light-1)',
              }}
            >
              <Box />
            </Skeleton>
          </Box>

          <Box sx={styles.tileNameWrapper}>
            <Skeleton isLoaded={false} height="16px" width="85%">
              <Box />
            </Skeleton>
          </Box>

          {price && (
            <Box sx={styles.tilePriceWrapper}>
              <Skeleton isLoaded={false} height="16px" width="70px">
                <Box />
              </Skeleton>
            </Box>
          )}

          {ctsButton && (
            <Box sx={styles.clickToShopbtnContainer}>
              <Skeleton isLoaded={false} height="32px" width="120px">
                <Box />
              </Skeleton>
            </Box>
          )}

          {displayAtb && (
            <Box sx={styles.addToBagButton?.wrapper}>
              <Skeleton isLoaded={false} height="36px" width="100%">
                <Box />
              </Skeleton>
            </Box>
          )}
        </Box>
      </ProductItemTile>
    )
  }

  return (
    <ImpressionSensor
      onVisible={onVisible}
      key={`product-${productItem.id}`}
      style={styles.recommendationImpressionSensor}
    >
      <ProductItemTile styles={styles}>
        <ProductItemTile.Wrapper url={url} onClick={onWrapperClick}>
          <ProductItemTile.Image {...image} />
          <Box sx={styles.tileMetaColumn}>
            <ProductItemTile.Name>{name}</ProductItemTile.Name>
            {price && <ProductItemTile.Price {...price} />}

            {variants && variants.length && (
              <ProductItemTile.Controls
                variants={variants}
                selectedVariant={selectedVariant}
                onVariantChange={onVariantChange}
              >
                {variantControls}
              </ProductItemTile.Controls>
            )}
            {allowSaving && !hideWishlist && (
              <SaveForLater
                name={name}
                isRecommendationTile
                styleVariant={styleVariant}
                selectedVariant={selectedVariant}
                onAddToWishlistSuccess={onAddToWishlist}
                wrapperStyles={styles.saveForLaterPosition}
                onRemoveFromWishlistSuccess={onRemoveFromWishlist}
              />
            )}
            {!hidePromotions && promotions?.length > 0 && (
              <ProductItemTile.Promotions>
                {promotions.map(({ type, content }) => (
                  <Box key={type} dangerouslySetInnerHTML={{ __html: content }} />
                ))}
              </ProductItemTile.Promotions>
            )}
            {enableInlineAddToBag && displayAtb && (
              <AddToBagButton
                variantId={selectedVariant.variationId}
                variantGroupId={productItem.variationGroupId}
                isSizedProduct={productItem.isSized}
                styles={styles.addToBagButton}
                analyticsData={{
                  containerLabel,
                  experienceId: strategyId,
                  eventLocation: containerId,
                  recAIType: vendor,
                }}
                styleVariant={styleVariant}
                buttonCaption={formatMessage({
                  id: 'plp.quickAddText',
                  defaultMessage: '+ Quick Add',
                })}
                hideIcon={isOneCoachNAEnabled}
              />
            )}
          </Box>
        </ProductItemTile.Wrapper>
        {ctsButton && (
          <Link
            href={url}
            prefetchUrl={getAPIURL(url)}
            prefetch
            sx={styles.clickToShopLink}
            onClick={onLinkClick}
            pageData={productItem}
          >
            <Box sx={styles.clickToShopbtnContainer}>
              <Button sx={styles.clickToShopbtn}>{ctsButton}</Button>
            </Box>
          </Link>
        )}
        {!enableInlineAddToBag && displayAtb && (
          <AddToBagButton
            variantId={selectedVariant.variationId}
            variantGroupId={productItem.variationGroupId}
            isSizedProduct={productItem.isSized}
            styles={styles.addToBagButton}
            analyticsData={{
              containerLabel,
              experienceId: strategyId,
              eventLocation: containerId,
              recAIType: vendor,
            }}
            styleVariant={styleVariant}
            hideIcon={isOneCoachNAEnabled}
          />
        )}
      </ProductItemTile>
    </ImpressionSensor>
  )
}

export default RecommendationItemTile

import { useContext, useState, useRef, useEffect } from 'react'
import SessionContext from 'toro/components/SessionContext'
import Button from 'toro/components/Button'
import QuickAddToBag from 'toro/components/list/QuickAddToBag'
import Box from 'toro/components/Box'
import ProductTileSizeDrawer from 'toro/components/list/ProductTileSizeDrawer'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useAddToCart from 'toro/hooks/useAddToCart'

interface AnalyticsData {
  eventLocation?: string
  containerLabel?: string
}

const CmsAddToBagButton = ({
  buttonText = 'Add to Bag',
  showToastAlways = false,
  tileContainer,
  atbButton,
  disabled,
  productId,
  analyticsData,
  onSizedProductClick,
}: {
  buttonText?: string
  showToastAlways?: boolean
  tileContainer?: HTMLDivElement
  // ATB button is implemented as <div> for legacy reasons
  atbButton: HTMLDivElement
  disabled: boolean
  productId: string
  analyticsData?: AnalyticsData
  onSizedProductClick?: () => void
}) => {
  const context = useContext(SessionContext)

  const [product, setProductInfo] = useState({ productId, disabled })
  const targetRefSizeDrawer = useRef(tileContainer?.querySelector(`.cms-size-drawer`))
  const isSizedProduct = tileContainer?.getAttribute('data-sized-product') === 'true'
  const variantGroupId = tileContainer?.getAttribute('data-wishlist-pid')

  const {
    addToCart,
    addToCartVariant,
    isDisabled,
    isMaxQuantityReached,
    showSizesSelectionDesktop,
    onCloseSizeDrawer,
  } = useAddToCart({
    variantId: product.productId,
    variantGroupId,
    showToastAlways,
    isCMS: true,
    targetRefSizeDrawer,
    tileContainer,
    isSizedProduct,
    analyticsData,
    onSizedProductClick,
  })

  useEffect(() => {
    const handleSwatchChange = (e: CustomEvent<{ productId: string; available: boolean }>) => {
      const { productId, available } = e.detail
      setProductInfo({ productId, disabled: !available })
    }
    atbButton?.addEventListener('swatch-change', handleSwatchChange)
    return () => {
      atbButton?.removeEventListener('swatch-change', handleSwatchChange)
    }
  }, [])

  if (!context) {
    // Handle the absence of context, e.g., render a fallback UI or return null
    return <Button data-server-portal="true">{buttonText}</Button>
  }

  return (
    <Box my="var(--spacing-4)" position="relative">
      <QuickAddToBag
        onClick={addToCart}
        isProductSet={false}
        disabled={isDisabled || product.disabled}
        variant="plpV3"
        showOnLegacy
        isMaxQuantityReached={isMaxQuantityReached}
      />
      {showSizesSelectionDesktop && (
        <Box position="absolute" left="0" right="0" bottom="0" height="auto">
          <ProductTileSizeDrawer
            closeDrawer={onCloseSizeDrawer}
            onAddToBagClick={(variantId) => {
              addToCartVariant(variantId)
            }}
            isCMSTile={true}
          />
        </Box>
      )}
    </Box>
  )
}

export default withErrorBoundaryWrapper(CmsAddToBagButton)

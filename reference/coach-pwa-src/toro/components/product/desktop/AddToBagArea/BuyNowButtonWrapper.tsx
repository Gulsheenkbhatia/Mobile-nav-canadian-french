import { useCallback } from 'react'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { useAtomValue, useResetAtom } from 'jotai/utils'
import { useAtom } from 'jotai'
import {
  isCustomizedProductAtom,
  selectedQtyAtom,
  orderingErrorAtom,
  submittableVariantIdAtom,
  maxQuantityErrorAtom,
  alterCtaToShowAtom,
  AlterCtaToShow,
} from 'store/pdp.atom'
import { reminderInCartAtom } from 'store/add-to-cart-reminder.atom'
import { ORDERING_ERROR } from 'toro/helpers/productVariations'
import useAddItemToCart from 'toro/hooks/useAddToCartDesktopMobile'
import withFeatureFlag from 'toro/hocs/withFeatureFlag'
import useAnalytics from 'toro/analytics/useAnalytics'
import { getNotSelectedErrorEvents } from 'toro/helpers/pdpGaEvents'

import ByNowButtonBase from 'toro/components/BuyNowButton'
const BuyNowButton = withFeatureFlag(ByNowButtonBase, { PDPPreferences: ['showBuyNowButton'] })

const BuyNowButtonWrapper = () => {
  const [orderingError, setOrderingError] = useAtom(orderingErrorAtom)
  const analytics = useAnalytics()

  const isCustomizedProduct = useAtomValue(isCustomizedProductAtom)
  const submittableVariantId = useAtomValue(submittableVariantIdAtom)
  const selectedQty = useAtomValue(selectedQtyAtom)
  const resetVisitedPagesCount = useResetAtom(reminderInCartAtom)
  const alterCtaToShow = useAtomValue(alterCtaToShowAtom)

  const { addToCart } = useAddItemToCart({ isBuyNow: true })
  const maxQuantityError = useAtomValue(maxQuantityErrorAtom)

  const onBuyNowButtonClick = useCallback(() => {
    if (!submittableVariantId) {
      setOrderingError(ORDERING_ERROR.notSelected)
      const eventsPayload = getNotSelectedErrorEvents()
      analytics.send(...eventsPayload)
    } else {
      addToCart()
      resetVisitedPagesCount()
    }
  }, [submittableVariantId, addToCart])

  if (isCustomizedProduct || alterCtaToShow !== AlterCtaToShow.BUYNOW) return null

  return (
    <BuyNowButton
      onBuyNowButtonClick={onBuyNowButtonClick}
      maxQuantityError={maxQuantityError}
      selectedVariantId={submittableVariantId}
      selectedQty={selectedQty}
      errorType={orderingError}
      isPdpV5
    />
  )
}

export default withErrorBoundaryWrapper(BuyNowButtonWrapper)

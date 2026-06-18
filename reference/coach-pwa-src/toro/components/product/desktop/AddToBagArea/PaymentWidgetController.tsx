import { useCallback, useMemo } from 'react'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { useAtomValue } from 'jotai/utils'
import { useAtom } from 'jotai'
import {
  selectedQtyAtom,
  orderingErrorAtom,
  submittableVariantIdAtom,
  gaProductDataAtom,
} from 'store/pdp.atom'
import { ORDERING_ERROR } from 'toro/helpers/productVariations'
import PaymentWidget from 'toro/components/PaymentWidget'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import useAnalytics from 'toro/analytics/useAnalytics'
import { getApplePayClickEvent, getApplePayOpenPopupEvents } from 'toro/helpers/pdpGaEvents'

const PaymentWidgetController = () => {
  const [orderingError, setOrderingError] = useAtom(orderingErrorAtom)
  const analytics = useAnalytics()
  const gaProductData = useAtomValue(gaProductDataAtom)
  const [id, pricingInfo] = useSelectedVariantData(['id', 'pricingInfo'])
  const submittableVariantId = useAtomValue(submittableVariantIdAtom)
  const selectedQty = useAtomValue(selectedQtyAtom)
  const productData = useMemo(
    () => ({
      id,
      pricingInfo,
    }),
    [id, pricingInfo]
  )

  const onApplePayClick = useCallback(() => {
    let success = true
    if (!submittableVariantId) {
      setOrderingError(ORDERING_ERROR.notSelected)
      success = false
    } else {
      const eventPayload = getApplePayClickEvent({
        gaProductData,
        submittableVariantId,
      })
      analytics.send(...eventPayload)
    }
    // return new formed message
    return success
  }, [submittableVariantId, gaProductData, submittableVariantId])

  const onApplePayOpen = useCallback(() => {
    const eventsPayload = getApplePayOpenPopupEvents({ gaProductData })
    eventsPayload.forEach((event) => analytics.send(...event))
  }, [gaProductData])

  return (
    <PaymentWidget
      productData={productData}
      selectedQty={selectedQty}
      onClick={onApplePayClick}
      onOpen={onApplePayOpen}
      disabled={orderingError === ORDERING_ERROR.cartThreshold}
      isPdpV5
    />
  )
}

export default withErrorBoundaryWrapper(PaymentWidgetController)

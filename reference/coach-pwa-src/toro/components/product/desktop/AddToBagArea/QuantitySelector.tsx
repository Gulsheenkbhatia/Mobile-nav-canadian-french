import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useStyles from 'toro/hooks/useStyles'
import ToroSelect from 'toro/components/ToroSelect'
import { useAtom } from 'jotai'
import { selectedQtyAtom, isMegaPDPEligibleAtom, selectedVariantAtom } from 'store/pdp.atom'
import { useMemo } from 'react'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useAtomValue } from 'jotai/utils'

const QuantitySelector = ({
  isDisabled = false,
  enableMaxQtyRestriction,
  defaultMaxOrderQuantity,
  maxQty,
  className = '',
}) => {
  const styles = useStyles()
  const [selectedQty, setSelectedQty] = useAtom(selectedQtyAtom)
  const analytics = useAnalytics()
  const selectedVariant = useAtomValue(selectedVariantAtom)
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)

  const qtySelectOptions = useMemo(() => {
    let maxOrderableQty = 1
    if (enableMaxQtyRestriction) {
      if (maxQty !== undefined && maxQty > 0) {
        maxOrderableQty = maxQty
      } else if (defaultMaxOrderQuantity !== undefined && defaultMaxOrderQuantity > 0) {
        maxOrderableQty = defaultMaxOrderQuantity
      }
    }
    return Array.from({ length: maxOrderableQty }, (_, i) => ({
      label: i + 1,
      value: i + 1,
    }))
  }, [enableMaxQtyRestriction, defaultMaxOrderQuantity, maxQty])

  const handleQuantityChange = (e) => {
    setSelectedQty(e.value)
    const eventLocationValue = isMegaPDPEligible ? 'mega product' : 'product'

    analytics.send('productInteraction', {
      eventLocationForced: eventLocationValue,
      eventAction: 'quantity dropdown select',
      eventLabel: selectedVariant?.id,
    })
  }

  return (
    <ToroSelect
      options={qtySelectOptions}
      onChange={handleQuantityChange}
      isDisabled={isDisabled}
      value={selectedQty}
      variant="desktopV5Template"
      rootProps={{ className: 'atb-qty-selector', sx: styles.qtyWrapper }}
      data-qa="quantity_dropdown"
    />
  )
}

export default withErrorBoundaryWrapper(QuantitySelector)

import React, { useContext, useEffect, useMemo, useState } from 'react'
import get from 'lodash/get'
import usePreference from 'toro/hooks/usePreference'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import PWAContext from 'components/common/PWAContext'
import ToroSelect from 'toro/components/ToroSelect'
import useAnalytics from 'toro/analytics/useAnalytics'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useAtomValue } from 'jotai/utils'
import { isMegaPDPEligibleAtom } from 'store/pdp.atom'

function QuantitySelector({
  selectedQuantity,
  disabled,
  onChange,
  isQuickView,
  productId,
  maxQty,
  isBundleVariant,
  sxStyles,
  quickViewEventLocation,
  selectedVgId,
  variant,
  isSticky = false,
  selectedProductId,
  ...props
}) {
  const { appData } = useContext(PWAContext)
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const siteId = useMemo(() => get(appData, 'siteId'), [appData])
  // const [maxOrderableQty, setMaxOrderableQty] = useState(1) // will be enabled when stock API is ready
  const [internalSelectedQuantity, setInternalSelectedQuantity] = useState(selectedQuantity)
  const analytics = useAnalytics()
  const styles = useMultiStyleConfig('ToroSelect', {
    variant,
  })
  const [qtySelectOptions, setQtySelectOptions] = useState([
    {
      label: 1,
      value: 1,
    },
  ])

  const enableMaxQtyRestrictionPref = usePreference({
    groupId: 'ToggleSiteFeatures',
    preferenceId: 'enableMaxQtyRestriction',
  })
  const defaultMaxOrderQtyPref = usePreference({
    groupId: 'CartCheckoutSettings',
    preferenceId: 'defaultMaxOrderQuantity',
  })

  const isMaxQtyRestrictionEnabled = getSiteValueFromPref(
    enableMaxQtyRestrictionPref,
    siteId,
    false
  )
  const defaultMaxOrderQty = getSiteValueFromPref(defaultMaxOrderQtyPref, siteId, 5)

  useEffect(() => {
    let maxOrderableQty = 1
    if (isMaxQtyRestrictionEnabled) {
      if (maxQty !== undefined && maxQty > 0) {
        maxOrderableQty = maxQty
      } else if (defaultMaxOrderQty !== undefined && defaultMaxOrderQty > 0) {
        maxOrderableQty = defaultMaxOrderQty
      }
    }
    const qtyOptions = [...Array(maxOrderableQty).keys()].map((val) => ({
      label: val + 1,
      value: val + 1,
    }))
    setQtySelectOptions(qtyOptions)
  }, [isMaxQtyRestrictionEnabled, defaultMaxOrderQty, maxQty])

  useEffect(() => {
    if (selectedQuantity && selectedQuantity !== internalSelectedQuantity) {
      setInternalSelectedQuantity(selectedQuantity)
    }
  }, [selectedQuantity])

  useEffect(() => {
    if (!isBundleVariant && disabled && qtySelectOptions?.length > 0) {
      const firstOption = { ...qtySelectOptions[0] }
      setInternalSelectedQuantity(firstOption.value)
      onChange && onChange(firstOption.value, false)
    }
  }, [disabled])

  function handleChange(e, sendAnalytics = true) {
    let eventLocationValue = isMegaPDPEligible
      ? `mega ${isSticky ? 'pdp sticky' : 'product'}`
      : `${isSticky ? 'pdp sticky' : 'product'}`
    onChange && onChange(e.value)
    {
      !isQuickView
        ? analytics.send('productInteraction', {
            eventLocationForced: eventLocationValue,
            eventAction: 'quantity dropdown select',
            eventLabel: selectedProductId || productId,
          })
        : sendAnalytics &&
          analytics.send('quickViewInteraction', {
            eventAction: 'quantity dropdown select',
            eventLabel: selectedVgId || productId,
            eventLocation: quickViewEventLocation,
          })
    }
  }

  return isMaxQtyRestrictionEnabled ? (
    <ToroSelect
      data-qa="quantity_dropdown"
      options={qtySelectOptions}
      isDisabled={disabled}
      value={internalSelectedQuantity}
      onChange={handleChange}
      {...props}
      sx={{
        ...sxStyles,
        ...styles.select,
        '&[disabled]:focus': { borderColor: 'var(--color-inactive)' },
        '&[disabled]:active': { borderColor: 'var(--color-inactive)' },
      }}
    />
  ) : null
}

QuantitySelector.propTypes = {
  selectedQuantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  isQuickView: PropTypes.bool,
  productId: PropTypes.string,
  maxQty: PropTypes.number,
  isBundleVariant: PropTypes.bool,
  sxStyles: PropTypes.object,
}

QuantitySelector.defaultProps = {
  onChange: () => {},
  sxStyles: {},
}

export default withErrorBoundaryWrapper(QuantitySelector)

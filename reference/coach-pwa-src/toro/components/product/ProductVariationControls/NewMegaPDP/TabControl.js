import Link from 'toro/components/Link'
import React, { memo, useCallback } from 'react'
import ProductSizeControl from 'toro/components/product/ProductVariationControls/ProductSizeControl'
import PropTypes from 'prop-types'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useUpdateAtom } from 'jotai/utils'
import { selectedTabsDataAtom } from 'store/pdp.atom'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
function TabControl({ item, selected, selectedColor, idx, productId, dataTestId, variant }) {
  const analytics = useAnalytics()
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)
  const setSelectedTabsData = useUpdateAtom(selectedTabsDataAtom)

  const handleClick = useCallback(() => {
    if (selected) {
      return
    }
    setFullscreenLoading(true)
    setSelectedTabsData((prevSelectedTabsData) => {
      const updatedSelectedTabsData = prevSelectedTabsData?.map((selectedTab) => {
        if (selectedTab?.tabId?.toLowerCase() === item?.tabId?.toLowerCase()) {
          return { ...selectedTab, name: item?.name }
        }
        return selectedTab
      })
      return updatedSelectedTabsData
    })
    analytics.send('swatchInteraction', {
      eventAction: 'swatch click',
      eventLabel: productId,
      eventLocation: 'mega product',
      swatchType: item?.tabId || 'undefined',
      swatchValue: item?.name || 'undefined',
      swatchVariant: selectedColor?.vgId || 'undefined',
    })
  }, [item, selected, productId, selectedColor?.vgId])

  const disabled = item?.url === '/'

  const sizeControl = (
    <ProductSizeControl
      key={item?.tabId}
      label={item?.tabId}
      text={item?.name}
      selected={selected}
      onClick={handleClick}
      data-testid={dataTestId}
      disabled={disabled}
      clickDisabled={disabled}
      isNewMegaPDPEligible
      variantType={item?.tabId}
      variant={variant}
    />
  )

  if (selected || disabled) {
    return sizeControl
  }

  return (
    <Link
      key={idx}
      href={item?.url}
      variant="unstyled"
      prefetch={true}
      prefetchUrl={item?.url}
      scroll={false}
    >
      {sizeControl}
    </Link>
  )
}

TabControl.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    tabId: PropTypes.string,
    url: PropTypes.string,
  }),
  selected: PropTypes.bool,
  selectedColor: PropTypes.object,
  setSelectedTab: PropTypes.func,
  idx: PropTypes.number,
  productId: PropTypes.string,
}

export default memo(TabControl)

import Link from 'toro/components/Link'
import React, { memo, useCallback } from 'react'
import ProductSizeControl from 'toro/components/product/ProductVariationControls/ProductSizeControl'
import PropTypes from 'prop-types'
import useAnalytics from 'toro/analytics/useAnalytics'

function ProductMaterialControl({
  item,
  setFullscreenLoading,
  selectedMaterial,
  selectedColor,
  setSelectedMaterial,
  idx,
  productId,
}) {
  const analytics = useAnalytics()
  const handleClick = useCallback(
    (item) => {
      analytics.send('swatchInteraction', {
        eventAction: 'swatch click',
        eventLabel: productId,
        eventLocation: 'mega product',
        swatchType: 'material',
        swatchValue: item?.materialName || 'undefined',
        swatchVariant: selectedColor?.vgId || 'undefined',
      })
    },
    [productId, selectedColor?.vgId]
  )
  const onSizeControlClick = useCallback(() => {
    setSelectedMaterial?.(item)
    handleClick(item)
  }, [item, handleClick, setSelectedMaterial])

  const sizeControl = (
    <ProductSizeControl
      key={item?.materialName}
      label={'material'}
      text={item?.materialName?.toUpperCase()}
      selected={item?.materialName?.toLowerCase() === selectedMaterial?.materialName?.toLowerCase()}
      onClick={onSizeControlClick}
      variantType={'material'}
    />
  )

  if (selectedColor?.materialName?.toLowerCase?.() === item?.materialName?.toLowerCase?.()) {
    return sizeControl
  } else {
    const productUrl = item?.firstURL
    return (
      <Link
        key={idx}
        href={productUrl}
        variant="unstyled"
        prefetch={true}
        prefetchUrl={productUrl}
        scroll={false}
        onClick={() => setFullscreenLoading(true)}
      >
        {sizeControl}
      </Link>
    )
  }
}
ProductMaterialControl.propTypes = {
  item: PropTypes.object,
  setFullscreenLoading: PropTypes.func,
  selectedMaterial: PropTypes.object,
  selectedColor: PropTypes.object,
  setSelectedMaterial: PropTypes.func,
  idx: PropTypes.number,
  productId: PropTypes.string,
}

export default memo(ProductMaterialControl)

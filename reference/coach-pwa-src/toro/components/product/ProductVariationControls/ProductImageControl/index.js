import dynamic from 'next/dynamic'
import { memo, useMemo } from 'react'
import get from 'lodash/get'
import useViewportType from 'toro/hooks/useViewportType'
import { getProductImageSrc } from 'toro/helpers/productImages'
import PropTypes from 'prop-types'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'
import usePreference from 'toro/hooks/usePreference_new'
import getPreferenceConfigValue from 'toro/helpers/getPreferenceConfigValue'
import useStyles from 'toro/hooks/useStyles'

import DefaultVariant from 'toro/components/product/ProductVariationControls/ProductImageControl/DefaultVariant'

const QuickViewVariant = dynamic(() =>
  import('toro/components/product/ProductVariationControls/ProductImageControl/QuickViewVariant')
)

function ProductImageControl({
  onClick,
  selected,
  labelValue,
  isQuickView,
  disabled,
  isItemHidden,
  masterId,
  isCustomizer,
  src,
  alt,
  qvImageSrc,
  id,
  monogramFontName,
  monogramInitialsHtml,
}) {
  const styles = useStyles()
  const { viewport } = useViewportType()
  const isV3Experience = useExperiment(EXPERIMENTS.PDP_V3)
  const {
    toggleSiteFeatures: { stickyAddToCartEnabled },
  } = usePreference({
    ToggleSiteFeatures: ['stickyAddToCartEnabled'],
  })

  const [imageSrc, productIdAttr, lazyOffset] = useMemo(() => {
    const imgOption = isV3Experience ? { isSwatchImageV3: true } : { isSwatchImage: true }
    const imageSrc = getProductImageSrc(src, viewport, 'pdp', imgOption)
    const productIdAttr = `${masterId?.split('-')?.[0]} ${id}`
    const stickyAddToCartPrefObj = getPreferenceConfigValue(stickyAddToCartEnabled)
    const isStickyAddToCartEnabled = !get(stickyAddToCartPrefObj, 'No', true)
    const lazyOffset = isStickyAddToCartEnabled ? -60 : 0

    return [imageSrc, productIdAttr, lazyOffset]
  }, [isV3Experience, src, viewport, masterId, id, stickyAddToCartEnabled])

  const classes = useMemo(() => {
    let classes = 'variant-image-swatch'
    if (disabled) {
      if (isQuickView) {
        classes += ' disabled-color '
      } else {
        classes += ' disabled-image '
      }
    }
    if (isCustomizer) classes += ' customized-variant'
    if (selected) classes += ' activeColorSwatch'
    return classes
  }, [disabled, isQuickView, isCustomizer, selected])

  if (isQuickView) {
    return (
      <QuickViewVariant
        alt={alt}
        styles={styles}
        onClick={onClick}
        classes={classes}
        selected={selected}
        disabled={disabled}
        imageSrc={imageSrc}
        labelValue={labelValue}
        qvImageSrc={qvImageSrc}
        productIdAttr={productIdAttr}
      />
    )
  } else {
    return (
      <DefaultVariant
        alt={alt}
        styles={styles}
        onClick={onClick}
        classes={classes}
        selected={selected}
        disabled={disabled}
        imageSrc={imageSrc}
        labelValue={labelValue}
        productIdAttr={productIdAttr}
        isItemHidden={isItemHidden}
        lazyOffset={lazyOffset}
        monogramFontName={monogramFontName}
        monogramInitialsHtml={monogramInitialsHtml}
      />
    )
  }
}

ProductImageControl.propTypes = {
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  labelValue: PropTypes.string,
  isQuickView: PropTypes.bool,
  disabled: PropTypes.bool,
  isItemHidden: PropTypes.bool,
  masterId: PropTypes.string,
  isCustomizer: PropTypes.bool,
  src: PropTypes.string,
  alt: PropTypes.string,
  qvImageSrc: PropTypes.string,
  id: PropTypes.string,
  monogramFontName: PropTypes.string,
  monogramInitialsHtml: PropTypes.string,
}

ProductImageControl.defaultProps = {
  onClick: () => {},
  selected: false,
  labelValue: '',
  isQuickView: false,
  disabled: false,
  isItemHidden: false,
  masterId: '',
  isCustomizer: false,
  src: '',
  alt: '',
  qvImageSrc: '',
  id: '',
  monogramFontName: '',
  monogramInitialsHtml: '',
}

export default memo(ProductImageControl)

import { memo } from 'react'
import VariationOptionButton from 'toro/components/VariationOptionButton'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import { variationTypeControlInteraction } from 'store/pdp.atom'
import ProductSizeControlText from 'toro/components/product/ProductVariationControls/ProductSizeControlText'
import { useUpdateAtom } from 'jotai/utils'

function ProductSizeControl({
  text,
  selected,
  onClick,
  label,
  isQuickView,
  isVariationTypeControls,
  isBundleVariant,
  variantType,
  selectedCountry,
  isNeutralSizingApplicable,
  disabled,
  clickDisabled,
  isNewMegaPDPEligible,
  variant,
  ...props
}) {
  const setVariationTypeControlInteraction = useUpdateAtom(variationTypeControlInteraction)

  const handleClick = () => {
    !selected && !clickDisabled && onClick && onClick()
    isVariationTypeControls &&
      setVariationTypeControlInteraction({
        eventLocation: 'product',
        eventAction: 'swatch click',
        swatchType: label?.toLowerCase(),
        swatchValue: text?.toLowerCase(),
      })
  }

  return (
    <VariationOptionButton
      onClick={handleClick}
      selected={selected}
      allowClickOnDisabled
      label={label}
      variantType={variantType}
      styleVariant={variant}
      disabled={disabled}
      {...props}
      isQuickView={isQuickView}
      isBundleVariant={isBundleVariant}
      isNeutralSizingApplicable={isNeutralSizingApplicable}
      isNewMegaPDPEligible={isNewMegaPDPEligible}
    >
      <ProductSizeControlText text={text} selectedCountry={selectedCountry} />
    </VariationOptionButton>
  )
}

ProductSizeControl.propTypes = {
  text: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  label: PropTypes.string,
  isQuickView: PropTypes.bool,
  isBundleVariant: PropTypes.bool,
  selectedCountry: PropTypes.string,
  isNeutralSizingApplicable: PropTypes.bool,
  isNewMegaPDPEligible: PropTypes.bool,
}

ProductSizeControl.defaultProps = {
  onClick: () => {},
  selectedCountry: '',
  isNeutralSizingApplicable: false,
  isNewMegaPDPEligible: false,
}

export default memo(withErrorBoundaryWrapper(ProductSizeControl))

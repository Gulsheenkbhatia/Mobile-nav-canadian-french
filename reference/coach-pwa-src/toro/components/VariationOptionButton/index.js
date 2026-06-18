import { useMemo } from 'react'
import Button from 'toro/components/Button'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

function VariationOptionButton({
  selected,
  disabled,
  allowClickOnDisabled,
  label,
  isQuickView,
  isBundleVariant,
  variantType,
  isNeutralSizingApplicable,
  isNewMegaPDPEligible,
  styleVariant,
  ...props
}) {
  const styles = useMultiStyleConfig('VariationOptionButton', { variant: styleVariant })
  let className = `variation-option variation-${label?.toLowerCase()}`
  if (selected) {
    className = `${className} selected`
  }
  if (disabled && allowClickOnDisabled) {
    className = `${className} allow-disabled`
  }
  if (label !== 'size' && isNewMegaPDPEligible) {
    className = `${className} material-button`
  }

  const lowerCaseVariantType = variantType?.toLocaleLowerCase()

  const ProductAttributes = {
    Size: 'size',
    Width: 'width',
    Material: 'material',
    StyleType: 'style type',
    HeelHeight: 'heel height',
    BagSize: 'bag size',
  }

  const dataQa = useMemo(() => {
    switch (lowerCaseVariantType) {
      case ProductAttributes.Size:
      case ProductAttributes.BagSize:
        return selected
          ? 'cm_link_size_swatch_slctd'
          : disabled
          ? 'cm_link_size_swatch_dsbld'
          : selected && isBundleVariant
          ? 'bundle_select-size'
          : 'cm_link_size_swatch_enbld'
      case ProductAttributes.Width:
        return selected
          ? 'cm_link_width_swatch_slctd'
          : disabled
          ? 'cm_link_width_swatch_dsbld'
          : 'cm_link_width_swatch_enbld'
      case ProductAttributes.Material:
        return selected
          ? 'cm_link_material_swatch_slctd'
          : disabled
          ? 'cm_link_material_swatch_dsbld'
          : 'cm_link_material_swatch_enbld'
      case ProductAttributes.StyleType:
        return selected
          ? 'cm_link_styletype_swatch_slctd'
          : disabled
          ? 'cm_link_styletype_swatch_dsbld'
          : 'cm_link_styletype_swatch_enbld'
      case ProductAttributes.HeelHeight:
        return selected
          ? 'cm_link_heelheight_swatch_slctd'
          : disabled
          ? 'cm_link_heelheight_swatch_dsbld'
          : 'cm_link_heelheight_swatch_enbld'
      default:
        return ' '
    }
  }, [selected, disabled, label, lowerCaseVariantType])

  return (
    <Button
      variant={
        isNeutralSizingApplicable
          ? 'size-variation-option'
          : isNewMegaPDPEligible && !isQuickView
          ? 'megaPDP-variation-option'
          : 'variation-option'
      }
      sx={styles.sizeVariationButton}
      className={className}
      {...props}
      data-qa={dataQa}
    />
  )
}

export default VariationOptionButton

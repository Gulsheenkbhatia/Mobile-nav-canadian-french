export type SelectedVariantComputed = {
  isCustomizedOrMonogrammed: boolean
  customizationAction: 'customization' | 'monogram' | 'customization and monogram'
}
export function getComputeSelectedVariantData({ selectedVariant }): SelectedVariantComputed {
  return {
    isCustomizedOrMonogrammed:
      selectedVariant?.isCustomized || selectedVariant?.isMonogrammed || false,
    customizationAction: selectedVariant?.isCustomized
      ? 'customization'
      : selectedVariant?.isMonogrammed
      ? 'monogram'
      : 'customization and monogram',
  }
}

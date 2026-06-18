export const getShowStrikeOffPrice = (
  variantsOnSale,
  isProductOnSale,
  isHideStrikeOffPriceEnabled,
  isVariantSelected,
  productHasDiscount,
  isSearchSuggestionFormat,
  enableSwatches
) => {
  const allVariantsOnSale = variantsOnSale.every((v) => v.onSale)
  const someVariantsOnSale = variantsOnSale.some((v) => v.onSale)

  if (
    allVariantsOnSale ||
    (!enableSwatches && !isHideStrikeOffPriceEnabled && productHasDiscount)
  ) {
    return true
  } else if (someVariantsOnSale) {
    if (!isVariantSelected && !isSearchSuggestionFormat) {
      return !isHideStrikeOffPriceEnabled
    }
  }

  return isProductOnSale || productHasDiscount
}

const isPriceOrDiscountValid = (p: string) => !!p && p !== '0.0' && p !== '0'

const validatePriceAndDiscount = (price: {
  fullprice: string
  saleprice: string
  discountpercentage: string
}) => {
  const isListPriceValid = isPriceOrDiscountValid(price?.fullprice)
  const isSalePriceValid = isPriceOrDiscountValid(price?.saleprice)
  const isDiscountPercentValid = isPriceOrDiscountValid(price?.discountpercentage)
  return {
    isListPriceValid,
    isSalePriceValid,
    isDiscountPercentValid,
    hasDiscount: isListPriceValid && isSalePriceValid && isDiscountPercentValid,
  }
}

export default validatePriceAndDiscount

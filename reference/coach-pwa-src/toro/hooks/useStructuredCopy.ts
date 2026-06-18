import useProductData from 'toro/hooks/useProductData'
import usePreference from 'toro/hooks/usePreference_new'
import type { ProductDetailItem } from 'toro/types/productTypes/detailedProduct'

const useStructuredCopy = (overrideProductDetails?: ProductDetailItem[]) => {
  const storeProductDetails = useProductData('productDetails') as ProductDetailItem[] | undefined
  const { pdpPreferences: { newStructuredCopy } = { newStructuredCopy: false } } = usePreference({
    PDPPreferences: ['newStructuredCopy'],
  })

  const productDetails = overrideProductDetails ?? storeProductDetails
  const hasStructuredCopy =
    !!newStructuredCopy && Array.isArray(productDetails) && productDetails.length > 0

  return { productDetails, hasStructuredCopy }
}

export default useStructuredCopy

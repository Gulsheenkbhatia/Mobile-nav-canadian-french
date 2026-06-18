import ProductMainSection from 'toro/components/product/ProductMainSection'
import isEmpty from 'lodash/isEmpty'
import usePDPAtomsUpdate from 'toro/hooks/usePDPAtomsUpdate'

const QuickViewContent = ({ productData }) => {
  usePDPAtomsUpdate(true, productData)
  if (!productData || isEmpty(productData)) {
    return null
  }

  return <ProductMainSection />
}

export default QuickViewContent

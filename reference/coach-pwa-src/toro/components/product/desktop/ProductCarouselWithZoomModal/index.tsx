import { useState } from 'react'
import ProductCarousel from 'toro/components/product/desktop/ProductCarousel'
import PDPColorSwatches from 'toro/components/product/desktop/PDPColorSwatches'
import ProductCarouselZoomModal from 'toro/components/product/desktop/ProductCarouselZoomModal'
import Flex from 'toro/components/Flex'
import { TemplateName } from 'toro/constants/templates'
import Template from 'toro/components/Template'

const ProductCarouselWithZoomModal = () => {
  const [zoomedIdx, setZoomedIdx] = useState<number | null>(null)
  const openZoomModal = (idx: number) => {
    setZoomedIdx(idx)
  }
  const isZoom = zoomedIdx !== null

  return (
    <>
      <ProductCarousel openZoomModal={openZoomModal} />
      <ProductCarouselZoomModal isOpen={isZoom} onClose={() => setZoomedIdx(null)}>
        <ProductCarousel isZoom zoomedIdx={zoomedIdx} />
        <Template forIDs={[TemplateName.pdpv5_0]}>
          <Flex margin="auto" justifyContent="center" position="relative" bottom="1%">
            <PDPColorSwatches variant="pdpv5Zoom" fadeColor="var(--color-page-bg, #F0F0F0)" />
          </Flex>
        </Template>
      </ProductCarouselZoomModal>
    </>
  )
}

export default ProductCarouselWithZoomModal

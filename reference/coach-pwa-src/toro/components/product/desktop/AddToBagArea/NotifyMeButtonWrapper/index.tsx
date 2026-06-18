import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { orderingErrorAtom, selectedColorAtom, selectedVariantAtom } from 'store/pdp.atom'
import dynamic from 'next/dynamic'
import useProductData from 'toro/hooks/useProductData'

const NotifyMeButton = dynamic(
  () => import('toro/components/product/NotifyMeWidget/NotifyMeButton')
)
const NotifyMeButtonWrapper = () => {
  const setOrderingError = useUpdateAtom(orderingErrorAtom)
  const selectedColor = useAtomValue(selectedColorAtom)
  const name = useProductData('name')
  const selectedVariant = useAtomValue(selectedVariantAtom)

  return (
    <NotifyMeButton
      productId={selectedVariant?.id}
      setOrderingError={setOrderingError}
      selectedColor={selectedColor}
      productName={name}
      selectedVariant={selectedVariant}
    />
  )
}

export default withErrorBoundaryWrapper(NotifyMeButtonWrapper)

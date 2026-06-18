import dynamic from 'next/dynamic'

const LastSlideWithSimilarOptions = dynamic(
  () => import('toro/components/LastSlideWithSimilarOptions'),
  {
    ssr: false,
  }
)

type ProductHeroBottomWidgetsProps = {
  isLastSlideWithSimilarOptions: boolean
  selectedVariantId: string
}

const ProductHeroBottomWidgets = ({
  isLastSlideWithSimilarOptions,
  selectedVariantId,
}: ProductHeroBottomWidgetsProps) => {
  if (!isLastSlideWithSimilarOptions) return null
  return <LastSlideWithSimilarOptions variant={null} selectedVariantId={selectedVariantId} />
}

export default ProductHeroBottomWidgets

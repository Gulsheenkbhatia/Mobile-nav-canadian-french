import { useAtomValue } from 'jotai/utils'
import { isSizedProductAtom } from 'store/pdp.atom'
import Box from 'toro/components/Box'
import ProductPrice from 'toro/components/product/desktop/v5_1/ProductPrice'
import PDPColorSwatches from 'toro/components/product/desktop/PDPColorSwatches'
import AddToBagArea from 'toro/components/product/desktop/AddToBagArea'
import StylesProvider from 'toro/components/StylesProvider'
import useProductData from 'toro/hooks/useProductData'
import Text from 'toro/components/Text'
import ProductTitleBadge from 'toro/components/product/desktop/StickyBar/ProductTitleBadge'
import StarReviewRating from 'toro/components/product/desktop/StickyBar/StarReviewRating'
import RotatingMessages from 'toro/components/product/desktop/v5_1/RotatingMessages'
import SizeSelector from 'toro/components/product/desktop/v5_1/SizeSelector'
import Wishlist from 'toro/components/product/desktop/v5_1/Wishlist'
import FindInStore from 'toro/components/product/mobile/FindInStore'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import PromoCallout from 'toro/components/product/PromoCallout'
import { PROMO_TYPES } from 'toro/helpers/getPromoByType'
import PartOfBundleCta from 'toro/components/product/desktop/v5_1/PartOfBundleCta'

const MainStageArea = () => {
  const name = useProductData('name')
  const styles = useMultiStyleConfig('MainStageArea')
  const isSizedProduct = useAtomValue(isSizedProductAtom)

  return (
    <StylesProvider value={{}}>
      <Box sx={styles.mainStageArea}>
        <Flex sx={styles.starReviewRatingWrapper}>
          <StarReviewRating />
          <Wishlist />
        </Flex>
        <ProductTitleBadge />
        <Text data-qa="pdp_txt_pdt_title" as="h1" sx={styles.productName}>
          {name}
        </Text>
        <ProductPrice />
        <PromoCallout promoType={PROMO_TYPES.IPX1} variant="pdpV5_1" />
        <PromoCallout promoType={PROMO_TYPES.IPX2} variant="pdpV5_1" />
        <PDPColorSwatches />
        {isSizedProduct && <SizeSelector />}
        <PromoCallout promoType={PROMO_TYPES.IPX3} variant="pdpV5_1" />
        <AddToBagArea />
        <PromoCallout promoType={PROMO_TYPES.RB} variant="pdpV5_1" />
        <FindInStore lazyMinHeight={80} />
        <RotatingMessages />
        <PartOfBundleCta />
      </Box>
    </StylesProvider>
  )
}

export default MainStageArea

import StylesProvider from 'toro/components/StylesProvider'
import ProductItemWrapper from 'toro/components/ProductItemTile/ProductItemWrapper'
import ProductItemImage from 'toro/components/ProductItemTile/ProductItemImage'
import ProductItemPrice from 'toro/components/ProductItemTile/ProductItemPrice'
import ProductItemName from 'toro/components/ProductItemTile/ProductItemName'
import ProductItemControls from 'toro/components/ProductItemTile/ProductItemControls'
import ProductItemPromotions from 'toro/components/ProductItemTile/ProductItemPromotions'
import { FC } from 'react'
import Box from 'toro/components/Box'

type ProductItemComponentProps = {
  Wrapper: typeof ProductItemWrapper
  Image: typeof ProductItemImage
  Price: typeof ProductItemPrice
  Name: typeof ProductItemName
  Controls: typeof ProductItemControls
  Promotions: typeof ProductItemPromotions
}

const ProductItemTile: FC<{ styles: any }> & ProductItemComponentProps = ({ styles, children }) => {
  return (
    <StylesProvider value={styles}>
      {/* to keep absolute positioning in the scope of the component, we need to keep a high-level relative wrapper */}
      <Box sx={styles.tileContentWrapper} position="relative">
        {children}
      </Box>
    </StylesProvider>
  )
}

ProductItemTile.Wrapper = ProductItemWrapper
ProductItemTile.Image = ProductItemImage
ProductItemTile.Price = ProductItemPrice
ProductItemTile.Name = ProductItemName
ProductItemTile.Controls = ProductItemControls
ProductItemTile.Promotions = ProductItemPromotions

export default ProductItemTile

import { FC } from 'react'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import { useStyles } from '@chakra-ui/react'
import StylesProvider from 'toro/components/StylesProvider'
import ProductTangibleeControl, {
  TangibleeControlType,
} from 'toro/components/product/desktop/ProductTangibleeControl'

type ProductCardImageProps = {
  image: string
  loadStrategy?: 'lazy' | null
  imgShift?: {
    mt?: number | string
    mr?: number | string
    mb?: number | string
    ml?: number | string
    transform?: string
  }
}

export const ProductCardHeader: FC = ({ children }) => {
  const styles = useStyles()
  return (
    <Flex sx={styles.productCardTitleContainer} className="productCardHeaderContainer">
      {children}
    </Flex>
  )
}

export const ProductCardBody: FC = ({ children }) => {
  const styles = useStyles()
  return <Flex sx={styles.productCardBodyContainer}>{children}</Flex>
}

export const ProductCardImage: FC<ProductCardImageProps> = ({
  image,
  loadStrategy,
  children,
  imgShift = {},
}) => {
  const styles = useStyles()
  const presetImage = `${image}?$productTile-1-1-m$`
  const dataSplideLazy = loadStrategy ? presetImage : null
  const imageSrc = !loadStrategy ? presetImage : null

  return (
    <Box sx={styles.productCardImageWrapper}>
      <Image
        sx={styles.productCardImage}
        src={imageSrc}
        data-splide-lazy={dataSplideLazy}
        lazy
        fetchpriority="low"
        {...imgShift}
      >
        {children}
      </Image>
    </Box>
  )
}

const ProductCard: FC<{
  styleVariant?: string
  tangibleeCta?: TangibleeControlType
  imageUrl?: string
}> & {
  Header?: typeof ProductCardHeader
  Body?: typeof ProductCardBody
  Image?: typeof ProductCardImage
} = ({ children, styleVariant, tangibleeCta, imageUrl }) => {
  const styles = useMultiStyleConfig('ProductCard', { variant: styleVariant })
  return (
    <StylesProvider value={styles}>
      <Flex sx={styles.productCardWrapper} className="productCardContainer" role="group">
        {children}
        {tangibleeCta && (
          <Box sx={styles.productCardTangibleeWrapper}>
            <ProductTangibleeControl type={tangibleeCta} imageUrl={imageUrl} onVpdCards />
          </Box>
        )}
      </Flex>
    </StylesProvider>
  )
}

ProductCard.Header = ProductCardHeader
ProductCard.Body = ProductCardBody
ProductCard.Image = ProductCardImage

export default ProductCard

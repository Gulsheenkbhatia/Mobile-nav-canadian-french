import { useStyles } from '@chakra-ui/react'
import { FC } from 'react'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import { ProductItem } from 'toro/types'

const ProductItemImage: FC<ProductItem['image']> = ({ src, alt, aspectRatio }) => {
  const styles: any = useStyles()
  return (
    <Box sx={styles.tileImageWrapper}>
      <Image src={src} alt={alt} aspectRatio={aspectRatio} lazy={false} />
    </Box>
  )
}

export default ProductItemImage

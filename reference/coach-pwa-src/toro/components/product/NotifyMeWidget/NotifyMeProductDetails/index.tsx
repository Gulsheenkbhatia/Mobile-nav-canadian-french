import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { notifyMeModalDataAtom } from 'store/notifyme.atom'
import Image from 'toro/components/Image'
import Box from 'toro/components/Box'
import { useAtomValue } from 'jotai/utils'
import { SystemStyleObject } from '@chakra-ui/react'

type Props = {
  styles: Record<string, SystemStyleObject | any>
  lazy?: boolean
}

const NotifyMeProductDetails = ({ styles, lazy = true }: Props) => {
  const notifyMeModalData = useAtomValue(notifyMeModalDataAtom)
  if (!notifyMeModalData) {
    return null
  }
  const { productName, productColor, productImageSrc, productSize, productPrice } =
    notifyMeModalData
  return (
    <Box sx={styles.productDetailsContainer}>
      <Box sx={styles.productImageContainer}>
        <Image sx={styles.productImage} src={productImageSrc} lazy={lazy} />
      </Box>
      <Box sx={styles.productDetails}>
        <Box sx={styles.productName}>{productName}</Box>
        <Box sx={styles.productColorAndSize}>
          {productColor}
          {productSize ? ` / Size ${productSize}` : ''}
        </Box>
        <Box sx={styles.productPrice}>{productPrice}</Box>
      </Box>
    </Box>
  )
}

export default withErrorBoundaryWrapper(NotifyMeProductDetails)

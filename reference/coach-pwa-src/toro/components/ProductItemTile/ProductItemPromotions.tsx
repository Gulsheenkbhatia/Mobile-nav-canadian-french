import { type SystemStyleObjectRecord, useStyles } from '@chakra-ui/react'
import { type FC } from 'react'
import Box from 'toro/components/Box'

const ProductItemPromotions: FC = ({ children }) => {
  const styles: SystemStyleObjectRecord = useStyles()
  return <Box sx={styles.tilePromotionsWrapper}>{children}</Box>
}

export default ProductItemPromotions

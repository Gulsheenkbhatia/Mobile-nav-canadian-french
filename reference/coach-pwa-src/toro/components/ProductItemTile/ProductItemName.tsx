import { useStyles } from '@chakra-ui/react'
import { FC } from 'react'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'

const ProductItemName: FC = ({ children }) => {
  const styles: any = useStyles()
  return (
    <Box sx={styles.tileNameWrapper} className="recommendation-tile-name-wrapper">
      <Text>{children}</Text>
    </Box>
  )
}

export default ProductItemName

import { SystemStyleObject } from '@chakra-ui/react'
import React from 'react'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'

type AccessoriesProductProps = {
  src: string
  id: string
  isSelected: boolean
  onChooseProduct: (productID: string) => void
  styles: Record<string, SystemStyleObject | any>
}

const AccessoriesProduct: React.FC<AccessoriesProductProps> = ({
  src,
  id,
  isSelected,
  onChooseProduct,
  styles,
}) => (
  <Box
    sx={styles.accessorizeItProduct}
    onClick={onChooseProduct}
    className={`accessorize-it-product ${isSelected ? 'accessorize-it-product-chosen' : ''}`}
    data-qa={isSelected ? 'swatch_selectedAccessory' : undefined}
  >
    <Image src={src} />
  </Box>
)

export default AccessoriesProduct

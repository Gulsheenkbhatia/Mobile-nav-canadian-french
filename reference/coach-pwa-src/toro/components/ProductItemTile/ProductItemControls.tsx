import { Children, cloneElement } from 'react'
import Box from 'toro/components/Box'

const ProductItemControls = ({ children, variants, selectedVariant, onVariantChange }) => {
  const child = Children.only(children)

  return <Box>{cloneElement(child, { variants, selectedVariant, onVariantChange })}</Box>
}

export default ProductItemControls

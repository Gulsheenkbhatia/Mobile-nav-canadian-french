import { SystemStyleObject } from '@chakra-ui/react'
import Box from 'toro/components/Box'
import type { ProductDetailItem } from 'toro/types/productTypes/detailedProduct'

interface StructuredCopyContentProps {
  items: ProductDetailItem[]
  sx?: SystemStyleObject
  id?: string
}

const styles = {
  container: {
    '& .product-props__details': {
      mb: 6,
    },
  },
}

const StructuredCopyContent: React.FC<StructuredCopyContentProps> = ({ items = [], sx, id }) => {
  return (
    <Box id={id} sx={{ ...styles.container, ...sx }}>
      {items?.map(({ label, values }) => (
        <div key={label} className="product-props__details" aria-label="child">
          <h2>{label}</h2>
          <ul>
            {Array.isArray(values) ? values.map((v) => <li key={v}>{v}</li>) : <li>{values}</li>}
          </ul>
        </div>
      ))}
    </Box>
  )
}

export default StructuredCopyContent

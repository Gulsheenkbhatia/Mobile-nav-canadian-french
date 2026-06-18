import React from 'react'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import useStyles from 'toro/hooks/useStyles'
import { type ProductImageGalleryProps } from 'toro/components/ShopAssistChat/types'

function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const styles = useStyles()
  if (!images || images.length === 0) {
    return null
  }

  const handleImageClick = (imageUrl: string) => {
    window.open(imageUrl, '_blank', 'noopener,noreferrer')
  }

  const handleKeyDown = (event: React.KeyboardEvent, imageUrl: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleImageClick(imageUrl)
    }
  }

  return (
    <Box role="list" sx={styles.productImageGallery}>
      {images.map((imageUrl, index) => (
        <Box
          key={index}
          role="listitem"
          tabIndex={0}
          sx={styles.productImageItem}
          onClick={() => handleImageClick(imageUrl)}
          onKeyDown={(event) => handleKeyDown(event, imageUrl)}
          aria-label={`Product image ${index + 1}. Click to view full size in new tab.`}
        >
          <Image
            src={imageUrl}
            sx={styles.productImage}
            alt={`Product image ${index + 1}`}
            lazy={true}
          />
        </Box>
      ))}
    </Box>
  )
}

export default ProductImageGallery

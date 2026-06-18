import React, { useMemo } from 'react'
import get from 'lodash/get'
import { useStyles } from '@chakra-ui/react'
import Image from 'toro/components/Image'
import { getProductImageSrc } from 'toro/helpers/productImages'
import useViewportType from 'toro/hooks/useViewportType'
import Box from 'toro/components/Box'
import { PlayCtaIcon as PlayIcon } from 'toro/icons'
import { CarouselMediaItem } from 'toro/components/product/mobile/ProductMediaThumbnails'

interface ThumbnailProps {
  item: CarouselMediaItem
  isVideo: boolean
  isActive: boolean
  onClick: () => void
}

const Thumbnail = ({ item, isVideo, isActive, onClick }: ThumbnailProps) => {
  const { viewport } = useViewportType()
  const styles = useStyles()

  const imageSrc = useMemo(() => {
    const originalSrc = isVideo ? item?.poster : item?.src
    return getProductImageSrc(originalSrc, viewport, 'pdp', { isSwatchImage: true })
  }, [item, viewport])

  return (
    <Box
      sx={get(styles, 'thumbnailWrapper', {})}
      className={isActive ? 'thumbnail-slide activeThumbnail' : 'thumbnail-slide'}
    >
      <Image
        src={imageSrc}
        alt={item?.alt}
        loading="lazy"
        w="100%"
        h="100%"
        objectFit="cover"
        onClick={onClick}
      />
      {isVideo && (
        <Box sx={styles.playButton}>
          <PlayIcon width="25" height="25" />
        </Box>
      )}
    </Box>
  )
}

export default Thumbnail

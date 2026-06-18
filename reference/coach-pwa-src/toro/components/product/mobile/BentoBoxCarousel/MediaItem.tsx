import { type FC, useEffect } from 'react'
import Box from 'toro/components/Box'
import CarouselVideo from 'toro/components/product/CarouselVideo'
import { MIN_MEDIA_ITEMS_REQUIRED } from 'toro/components/product/mobile/BentoBoxCarousel/constants'
import { type PlainChildrenProps, useInView } from 'react-intersection-observer'
import Image from 'toro/components/Image'
import useStyles from 'toro/hooks/useStyles'

interface MediaItemProps {
  index: number
  src: string
  alt: string
  resumeVideoPlayback: boolean
  inViewChangeHandler: PlainChildrenProps['onChange']
  onOpenModal: () => void
  type?: string
  poster?: string
}

const MediaItem: FC<MediaItemProps> = ({
  index,
  src,
  alt,
  resumeVideoPlayback,
  inViewChangeHandler,
  type,
  poster,
  onOpenModal,
}) => {
  const styles = useStyles()
  const { ref, inView, entry } = useInView({ threshold: 0.1 })

  useEffect(() => {
    inViewChangeHandler(inView, entry)
  }, [inViewChangeHandler, inView])

  return (
    <Box sx={styles.mediaItemWrapper}>
      {type === 'video' ? (
        <Box ref={ref} className="full-height">
          <CarouselVideo
            objectFit="cover"
            videoSrc={src}
            poster={poster}
            isActive={resumeVideoPlayback}
            isPlay
            muted
            isGallery
            variant="pdpv6"
            classes=""
            fullHeight
            onClick={onOpenModal}
          />
        </Box>
      ) : (
        <Image src={src} alt={alt} lazy={index >= MIN_MEDIA_ITEMS_REQUIRED} onClick={onOpenModal} />
      )}
    </Box>
  )
}

export default MediaItem

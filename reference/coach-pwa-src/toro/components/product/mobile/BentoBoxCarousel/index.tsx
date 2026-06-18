import { type FC, type UIEvent, useMemo, useState, useCallback, useRef } from 'react'
import type { RawMediaItemType } from 'toro/components/product/mobile/BentoBoxCarousel/types'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Box from 'toro/components/Box'
import { applyBentoMediaProps } from 'toro/components/product/mobile/BentoBoxCarousel/helpers'
import MediaItem from 'toro/components/product/mobile/BentoBoxCarousel/MediaItem'
import StylesProvider from 'toro/components/StylesProvider'
import dynamic from 'next/dynamic'
import useAnalytics from 'toro/analytics/useAnalytics'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import {
  getBentoBoxCarouselScrollEvent,
  getBentoBoxTileClickEvent,
} from 'toro/helpers/bentoBoxAnalytics'
import type { PlainChildrenProps } from 'react-intersection-observer'

const ZoomModal = dynamic(
  () => import('toro/components/product/mobile/BentoBoxCarousel/ZoomModal'),
  { ssr: false }
)

const SCROLL_THRESHOLD = 50

interface BentoBoxCarouselProps {
  data: RawMediaItemType[]
}

const BentoBoxCarousel: FC<BentoBoxCarouselProps> = ({ data }) => {
  const styles = useMultiStyleConfig('BentoBoxCarousel')
  const [modalState, setModalState] = useState({ isOpen: false, initialIndex: 0 })
  const [resumeVideoPlayback, setResumeVideoPlayback] = useState(false)
  const analytics = useAnalytics()
  const selectedVariantId = useSelectedVariantData('id')
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollPosition = useRef(0)

  const items = useMemo(() => data.map(applyBentoMediaProps), [data])

  const openModalHandler = (mediaItemIndex: number) => () => {
    const tileClickPayload = getBentoBoxTileClickEvent({
      mediaIndex: mediaItemIndex,
      mediaSrc: data[mediaItemIndex]?.src || '',
      selectedVariantId: selectedVariantId || '',
    })
    analytics.send(...tileClickPayload)

    setModalState({ isOpen: true, initialIndex: mediaItemIndex })
    setResumeVideoPlayback(false)
  }

  const closeModalHandler = () => {
    setModalState((prevState) => ({ ...prevState, isOpen: false }))
    setResumeVideoPlayback(true)
  }

  const inViewChangeHandler = useCallback<PlainChildrenProps['onChange']>((inView) => {
    setResumeVideoPlayback(inView)
  }, [])

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      if (modalState.isOpen) return

      const element = event.currentTarget
      const scrollLeft = element.scrollLeft

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      scrollTimeoutRef.current = setTimeout(() => {
        if (scrollLeft > lastScrollPosition.current + SCROLL_THRESHOLD) {
          const eventPayload = getBentoBoxCarouselScrollEvent({
            selectedVariantId: selectedVariantId || '',
          })
          analytics.send(...eventPayload)
        }

        lastScrollPosition.current = scrollLeft
      }, 150)
    },
    [analytics, selectedVariantId, modalState.isOpen]
  )

  return (
    <StylesProvider value={styles}>
      <Box sx={styles.carouselWrapper}>
        <Box sx={styles.carouselTrack} onScroll={handleScroll}>
          {items.map((item, index) => (
            <Box
              key={`${item.src}+${index}`}
              sx={styles.carouselItem}
              className={item.isLarge ? 'large' : 'small'}
            >
              <MediaItem
                index={index}
                src={item.src}
                alt={item.alt}
                resumeVideoPlayback={resumeVideoPlayback}
                inViewChangeHandler={inViewChangeHandler}
                poster={item.poster}
                type={item.type}
                onOpenModal={openModalHandler(index)}
              />
            </Box>
          ))}
        </Box>
      </Box>
      <ZoomModal
        isOpen={modalState.isOpen}
        onClose={closeModalHandler}
        initialIndex={modalState.initialIndex}
      />
    </StylesProvider>
  )
}

export default BentoBoxCarousel

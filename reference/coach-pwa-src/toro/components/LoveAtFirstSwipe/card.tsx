import { useCallback, useEffect, useMemo, useRef } from 'react'
import useSwipe, { SwipeDirection } from 'toro/hooks/useSwipe'
import Box from 'toro/components/Box'
import { SystemStyleObject } from '@chakra-ui/react'
import Image from 'toro/components/Image'
import { useAtomValue } from 'jotai/utils'
import { loveAtFirstSwipeProductsAtom } from 'store/love-at-first-swipe.atom'
import Link from 'toro/components/Link'
import getProductURLHref from 'helpers/getProductURLHref'
import { useIntl } from 'react-intl'
import {
  DEPTH_SHADOW,
  DEPTH_SCALE,
  DEPTH_TRANSLATE_Y,
  MAX_DEPTH,
  LIKE_BUTTONS_THRESHOLD,
} from 'toro/components/LoveAtFirstSwipe/constants'
import type { LoveAtFirstSwipeProduct } from 'toro/components/LoveAtFirstSwipe/types'

export type LoveAtFirstSwipeCardProps = {
  index: number
  position: number
  onSwiped: (direction: 'left' | 'right', index: number) => void
  product: LoveAtFirstSwipeProduct
  style: Record<string, SystemStyleObject>
  onClick: () => void
  onHighlightLikeButton: (data: { value: number; direction: SwipeDirection }) => void
}

const LoveAtFirstSwipeCard = ({
  index,
  position,
  product,
  onSwiped,
  style,
  onClick,
  onHighlightLikeButton,
}: LoveAtFirstSwipeCardProps) => {
  const depth = Math.min(position, MAX_DEPTH)
  const cssTranslateY = DEPTH_TRANSLATE_Y[depth]
  const cssScale = DEPTH_SCALE[depth]
  const isSwipingRef = useRef(false)
  const shadow = depth > 0 ? DEPTH_SHADOW[depth] : 0
  const hostRef = useRef<HTMLDivElement | undefined>()
  const productDirections = useAtomValue(loveAtFirstSwipeProductsAtom)
  const url = getProductURLHref(product?.detailURL)
  const { formatMessage } = useIntl()

  const directionModifier = useMemo(() => {
    if (position >= 0) return 0
    if (productDirections.left.includes(product.ID)) {
      return -1
    }
    return 1
  }, [position, productDirections])

  const handleSwipeBegin = useCallback(() => {
    if (!hostRef.current) {
      return
    }
    hostRef.current.style.transitionDuration = '0ms'
    isSwipingRef.current = true
  }, [])

  const handleSwiping = useCallback(
    (dx: number) => {
      if (!hostRef.current) {
        return
      }
      const cssRotate = dx * 0.1
      hostRef.current.style.transform = `translate3d(${-dx}px, 0, 0) scale(${cssScale}) rotate(${-cssRotate}deg)`
    },
    [cssScale]
  )

  const handleRebound = useCallback(() => {
    if (!hostRef.current) {
      return
    }
    hostRef.current.style.transitionDuration = '150ms'
    hostRef.current.style.transform = `translate3d(0, ${cssTranslateY}px, 0) scale(${cssScale})`
    isSwipingRef.current = false
  }, [cssScale, cssTranslateY])

  const handleSwipeEnd = useCallback(
    (direction: SwipeDirection) => {
      if (!hostRef.current) {
        return
      }
      hostRef.current.style.transitionDuration = '150ms'
      const withDirection = direction === 'left' ? -1 : 1
      const dx = window.innerWidth
      const cssRotate = dx * 0.1
      hostRef.current.style.transform = `translate3d(${
        dx * withDirection
      }px, 0, 0) scale(${cssScale}) rotate(${cssRotate * withDirection}deg)`

      onSwiped?.(direction, index)
      isSwipingRef.current = false
    },
    [cssScale, cssTranslateY, index, onSwiped]
  )

  const { onTouchStart, onTouchMove, onTouchEnd, swipeDirection } = useSwipe({
    onSwipeBegin: handleSwipeBegin,
    onSwipeEnd: handleSwipeEnd,
    onSwiping: handleSwiping,
    onSwipeRebound: handleRebound,
    swipeThreshold: 0.1,
  })

  useEffect(() => {
    const element = hostRef?.current
    if (!element) return

    let timerId: NodeJS.Timeout
    let prevRect = element.getBoundingClientRect()

    const observer = new IntersectionObserver(
      ([entry]) => {
        const currentRect = element.getBoundingClientRect()
        const deltaX = currentRect.left - prevRect.left
        const deltaY = currentRect.top - prevRect.top
        const isHorizontalMove = Math.abs(deltaX) > Math.abs(deltaY)

        const percentVisible = entry.isIntersecting ? 1 - entry.intersectionRatio : 0

        if (isHorizontalMove) {
          if (percentVisible > 0) {
            onHighlightLikeButton({ value: percentVisible, direction: swipeDirection })
          } else {
            timerId = setTimeout(
              () => onHighlightLikeButton({ value: percentVisible, direction: swipeDirection }),
              600
            )
          }
        }

        prevRect = currentRect
      },
      {
        root: null,
        threshold: LIKE_BUTTONS_THRESHOLD,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      clearTimeout(timerId)
    }
  }, [swipeDirection])

  useEffect(() => {
    if (directionModifier !== 0) {
      hostRef.current.style.transitionDuration = '150ms'
      const dx = window.innerWidth
      const cssRotate = dx * 0.1
      const withDirection = directionModifier
      hostRef.current.style.transform = `translate3d(${
        dx * withDirection
      }px, 0, 0) scale(${cssScale}) rotate(${cssRotate * withDirection}deg)`
    }
  }, [directionModifier])

  const outOfBoundsStyles = useMemo(() => {
    if (directionModifier === 0) {
      return {}
    }
    if (hostRef.current) {
      hostRef.current.style.transitionDuration = '150ms'
    }
    const dx = window.innerWidth
    let dr = dx * 0.1
    if (directionModifier === -1) {
      dr = 360 - dr
    }
    return {
      transitionDuration: '5s',
      transform: `translate3d(${dx * directionModifier}px, 0px, 0) rotate(${dr}deg) scale(1)`,
    }
  }, [directionModifier])

  return (
    <Box
      ref={hostRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        ...style.card,
        filter: `brightness(${1 - shadow})`,
        zIndex: 10 - position,
        transform: `translate3d(0, ${cssTranslateY}px, 0) scale(${cssScale})`,
        ...outOfBoundsStyles,
      }}
    >
      <Box sx={style.imageContainer}>
        <Image src={product.imageURL} alt={product.name} sx={style.image} />
        <Box sx={style.productName}>{product.name}</Box>
      </Box>
      <Link href={url} onClick={onClick} sx={style.productButton}>
        {formatMessage({
          id: 'loveAtFirstSwipe.buttonViewItem',
          defaultMessage: 'View item',
        })}
      </Link>
    </Box>
  )
}

export default LoveAtFirstSwipeCard

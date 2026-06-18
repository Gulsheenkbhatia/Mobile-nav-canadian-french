import React, { memo, useEffect, useRef, useState, useCallback } from 'react'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useAtomValue } from 'jotai/utils'
import { isPlpV3Atom } from 'store/plp.atom'
import NavArrow from 'toro/components/ScrollableContent/NavArrow'
import useAutoScrollToTarget from 'toro/hooks/useAutoScrollToTarget'

const ARROW_DEFAULTS = {
  variant: 'icon-only',
  p: '0',
  size: 'content',
  zIndex: 1,
}

const DEFAULT_SCROLL_ITEM_WIDTH = 100
const DEFAULT_PAGINATION_ARROWS_LIMIT = 6

interface ScrollableContentProps {
  fadeColor?: string
  wrapperStyles?: object
  wrapperClassNames?: string
  onKeyUp?: (e: any) => void
  onKeyDown?: (e: any) => void
  isScrollToStart?: boolean
  hideLeftFadeInitially?: boolean
  showArrows?: boolean
  boldArrows?: boolean
  fadedArrowOpacity?: number
  scrollItemWidth?: number
  arrowStyles?: object
  countOfItems?: number
  paginationArrowsLimit?: number
  scrollParentId?: string
  addScrollEvent?: boolean
  onArrowClick?: (direction: 'left' | 'right') => void
  autoScrollTargetSelector?: string
  autoScrollContainerRef?: React.RefObject<HTMLElement | null>
  autoScrollActiveSwatchTrigger?: unknown
  [key: string]: any
  dataQA?: string
}

const ScrollableContent: React.FC<ScrollableContentProps> = ({
  children,
  fadeColor,
  wrapperStyles,
  wrapperClassNames,
  onKeyUp,
  onKeyDown,
  isScrollToStart,
  hideLeftFadeInitially,
  showArrows,
  boldArrows = false,
  scrollItemWidth = DEFAULT_SCROLL_ITEM_WIDTH,
  paginationArrowsLimit = DEFAULT_PAGINATION_ARROWS_LIMIT,
  arrowStyles,
  countOfItems,
  setFadingChildClassNames,
  setScrollRef,
  sx,
  scrollParentId,
  addScrollEvent = true,
  variant,
  dataQA,
  onArrowClick,
  fadedArrowOpacity = 0.2,
  autoScrollTargetSelector,
  autoScrollContainerRef,
  autoScrollActiveSwatchTrigger,
  ...rest
}) => {
  const scrollRef = useRef(null)
  const hasFade = Boolean(fadeColor)
  const [fadingClassNames, setFadingClassNames] = useState(
    hideLeftFadeInitially ? 'leftFadeHidden' : ''
  )
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const styles = useMultiStyleConfig('ScrollableContent', {
    variant: variant || (isPlpV3 && 'plpV3'),
  })
  useAutoScrollToTarget({
    containerRef: autoScrollContainerRef,
    targetSelector: autoScrollTargetSelector,
    activeSwatchTrigger: autoScrollActiveSwatchTrigger,
  })
  const isDisplayPaginationArrows =
    showArrows && countOfItems && countOfItems > paginationArrowsLimit

  useEffect(() => {
    if (scrollRef.current && isScrollToStart) {
      scrollRef.current.scrollTo({
        behavior: 'smooth',
        left: 0,
      })
    }
  }, [isScrollToStart])

  useEffect(() => {
    // Set initial state
    if (scrollRef.current && (hasFade || isDisplayPaginationArrows)) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      const leftFadeStyle = scrollLeft > 0 ? '' : 'leftFadeHidden'
      const rightFadeStyle = scrollLeft + 1 < scrollWidth - clientWidth ? '' : 'rightFadeHidden'

      setFadingClassNames(`${leftFadeStyle} ${rightFadeStyle}`)
      setFadingChildClassNames?.(`${leftFadeStyle} ${rightFadeStyle}`)
      setScrollRef?.(scrollRef.current)
    }
  }, [children, hasFade, isDisplayPaginationArrows])

  function handleHostScroll() {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      const leftFadeStyle = scrollLeft > 0 ? '' : 'leftFadeHidden'
      const rightFadeStyle = scrollLeft + 1 < scrollWidth - clientWidth ? '' : 'rightFadeHidden'
      const newFadeClasses = `${leftFadeStyle} ${rightFadeStyle}`
      if (fadingClassNames !== newFadeClasses) {
        setFadingClassNames(newFadeClasses)
        setFadingChildClassNames?.(newFadeClasses)
      }
    }
  }

  const handleScrollByClick = useCallback(
    (direction: 'left' | 'right') => {
      const container = scrollRef.current
      if (!container) return
      const { scrollLeft } = container
      let targetScrollLeft = scrollLeft
      if (direction === 'left') {
        targetScrollLeft -= scrollItemWidth
      } else if (direction === 'right') {
        targetScrollLeft += scrollItemWidth
      }

      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
      })

      onArrowClick?.(direction)
    },
    [scrollItemWidth, onArrowClick]
  )

  const scrollableContentElement = (
    <Flex
      alignItems="center"
      whiteSpace="nowrap"
      className={`${hasFade ? fadingClassNames : ''} scrollable-container`}
      {...rest}
      sx={{ ...styles.mainWrapper(fadeColor), ...(sx || {}) }}
    >
      <Flex
        {...(scrollParentId && { id: scrollParentId })}
        className={`scrollableContent ${wrapperClassNames ? wrapperClassNames : ''}`}
        ref={scrollRef}
        sx={{ ...styles.wrapper, ...wrapperStyles }}
        onScroll={((hasFade && addScrollEvent) || isDisplayPaginationArrows) && handleHostScroll}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        dataQa={dataQA}
      >
        {children}
      </Flex>
    </Flex>
  )

  const leftFadeHidden = fadingClassNames?.includes('leftFadeHidden')
  const rightFadeHidden = fadingClassNames?.includes('rightFadeHidden')

  if (isDisplayPaginationArrows) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        position="relative"
        className="scrollable-container-with-arrows"
      >
        <Button
          {...ARROW_DEFAULTS}
          className="left-arrow"
          sx={arrowStyles}
          onClick={() => handleScrollByClick('left')}
          isDisabled={leftFadeHidden}
          opacity={leftFadeHidden ? `${fadedArrowOpacity} !important` : '1'}
          data-qa="btn_scrollable_left_arrow"
        >
          <NavArrow direction="left" bold={boldArrows} />
        </Button>
        {scrollableContentElement}
        <Button
          {...ARROW_DEFAULTS}
          className="right-arrow"
          sx={arrowStyles}
          right="0"
          onClick={() => handleScrollByClick('right')}
          isDisabled={rightFadeHidden}
          opacity={rightFadeHidden ? `${fadedArrowOpacity} !important` : '1'}
          data-qa="btn_scrollable_right_arrow"
        >
          <NavArrow direction="right" bold={boldArrows} />
        </Button>
      </Box>
    )
  }

  return scrollableContentElement
}

export default memo(ScrollableContent)

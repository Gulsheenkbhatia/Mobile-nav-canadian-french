import React, {
  useState,
  memo,
  ReactNode,
  Children,
  useCallback,
  ReactElement,
  ForwardedRef,
} from 'react'
import { Splide, SplideSlide, SplideProps, SplideTrack } from '@splidejs/react-splide'
import Box from 'toro/components/Box'
import isFunction from 'lodash/isFunction'
import type { SystemStyleObject } from '@chakra-ui/react'
import { NavChevronLeftBoldIcon, NavChevronRightBoldIcon } from 'toro/icons'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

type ArrowPropsObject = {
  'data-qa'?: string
  'aria-label'?: string
}

type SplideArrowProps = {
  isNext?: boolean
  isArrowVisible: boolean
  styles: {
    container?: SystemStyleObject
    arrows?: SystemStyleObject
    arrowNext?: SystemStyleObject
    arrowPrev?: SystemStyleObject
  }
  arrowProps?: {
    next?: ArrowPropsObject
    prev?: ArrowPropsObject
  }
  arrowsBold?: boolean
  leftArrowIcon?: () => JSX.Element
  rightArrowIcon?: () => JSX.Element
}

interface ISplideSlideProps extends SplideProps {
  children: ReactNode
  onIndexChange?: (x: number) => void
  modifiedThumbnailsArrows?: {
    nextCustomArrow?: ReactNode
    prevCustomArrow?: ReactNode
  }
  innerRef?: ForwardedRef<Splide>
  styles: {
    container?: SystemStyleObject
    arrows?: SystemStyleObject
    arrowNext?: SystemStyleObject
    arrowPrev?: SystemStyleObject
    splidePadding?: SystemStyleObject
  }
  arrowProps?: {
    next?: ArrowPropsObject
    prev?: ArrowPropsObject
  }
  arrowsTopMargin?: number
  arrowsBold?: boolean
  isPLPv3Desktop?: boolean
  initialIndex?: number
  dataQa?: string
}

export const Arrow = memo(
  ({
    isNext = false,
    styles = {},
    arrowProps,
    isArrowVisible,
    arrowsBold = false,
    leftArrowIcon,
    rightArrowIcon,
  }: SplideArrowProps) => {
    const { ChevronLeft: StyledChevronLeft, ChevronRight: StyledChevronRight } =
      useMultiStyleConfig('Icons')
    const ChevronRight =
      rightArrowIcon || (arrowsBold ? NavChevronRightBoldIcon : StyledChevronRight)
    const ChevronLeft = leftArrowIcon || (arrowsBold ? NavChevronLeftBoldIcon : StyledChevronLeft)
    return (
      <Box
        as="button"
        className={`splide__arrow splide__arrow--${isNext ? 'next' : 'prev'}`}
        display={isArrowVisible ? 'block' : 'none'}
        sx={{
          ...(styles?.arrows || {}),
          ...(styles?.[isNext ? 'arrowNext' : 'arrowPrev'] || {}),
        }}
        {...(arrowProps?.[isNext ? 'next' : 'prev'] || {})}
      >
        {isNext ? <ChevronRight /> : <ChevronLeft />}
      </Box>
    )
  }
)

const SplideSlider = ({
  children,
  onMove,
  options,
  styles = {},
  arrowProps,
  arrowsTopMargin,
  modifiedThumbnailsArrows = {},
  onIndexChange,
  innerRef,
  isPLPv3Desktop,
  initialIndex = 0,
  dataQa,
  arrowsBold = false,
  ...props
}: ISplideSlideProps) => {
  const [activeIdx, setActiveIdx] = useState(initialIndex)
  const { perPage, arrows } = options
  const maxIdx = Children.count(children) - 1 - (perPage ? perPage - 1 : 0)
  const leftArrowVisible = (arrows && activeIdx !== 0) || isPLPv3Desktop
  const rightArrowVisible = (arrows && activeIdx !== maxIdx) || isPLPv3Desktop

  const prevArrowMarkup = (
    <Arrow
      styles={styles}
      arrowProps={arrowProps}
      isArrowVisible={leftArrowVisible}
      arrowsBold={arrowsBold}
    />
  )

  const nextArrowMarkup = (
    <Arrow
      isNext
      styles={styles}
      arrowProps={arrowProps}
      isArrowVisible={rightArrowVisible}
      arrowsBold={arrowsBold}
    />
  )

  const { nextCustomArrow = nextArrowMarkup, prevCustomArrow = prevArrowMarkup } =
    modifiedThumbnailsArrows

  const handleOnMove = useCallback(
    (slider, idx, prev, dest) => {
      setActiveIdx(idx)
      isFunction(onIndexChange) && onIndexChange(idx)
      isFunction(onMove) && onMove(slider, idx, prev, dest)
    },
    [onIndexChange, onMove]
  )

  return (
    <Box sx={styles.container}>
      <Splide
        {...props}
        onMove={handleOnMove}
        hasTrack={false}
        ref={innerRef}
        options={{
          flickPower: 200,
          ...options,
          padding: {
            left: leftArrowVisible ? Number(styles?.splidePadding?.left || 0) : 0,
            right: rightArrowVisible ? Number(styles?.splidePadding?.right || 0) : 0,
          },
        }}
      >
        <SplideTrack>
          {Children.map(children, (child: ReactElement, index: number) => {
            return (
              <SplideSlide
                key={child.key || index}
                data-slide-index={index}
                data-qa={activeIdx === index ? dataQa : null}
              >
                {child}
              </SplideSlide>
            )
          })}
        </SplideTrack>
        {arrows !== false && (
          <Box className="splide__arrows" marginTop={arrowsTopMargin}>
            {prevCustomArrow}
            {nextCustomArrow}
          </Box>
        )}
      </Splide>
    </Box>
  )
}

export default SplideSlider

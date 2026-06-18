import React, {
  FC,
  Children,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { PropsOf } from '@emotion/react'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import get from 'lodash/get'
import isFunction from 'lodash/isFunction'
import { usePrevious } from '@chakra-ui/hooks'
import {
  NavChevronLeftIcon,
  NavChevronRightIcon,
  NavChevronLeftBoldIcon,
  NavChevronRightBoldIcon,
} from 'toro/icons'
import ImageSliderPagination from 'toro/components/ImageSliderPagination'
import { isOnModelPlp2UpAtom, isPlpV3Atom } from 'store/plp.atom'
import { useAtomValue } from 'jotai/utils'

export type ImageSliderProps = {
  id: string
  swipeable?: boolean
  arrows?: boolean
  dots?: boolean
  isInfinite?: boolean
  onSlideChange?: (index: number, isForcedScroll: boolean) => void
  onArrowClick?: (direction: 'left' | 'right', activeSlideIndex: number) => void
  children: ReactNode
  isDesktop?: boolean
  styles?: any
  arrowsDataQa?: {
    leftArrow: string
    rightArrow: string
  }
}

type ImageSliderType = typeof ImageSlider & {
  Slide: FC<PropsOf<typeof Box>>
}

type SliderRef = {
  slideForward: () => void
  scrollToSlide: (slideIndex: number, halfScrollRequired?: boolean) => void
}

const ImageSlider = forwardRef<SliderRef, ImageSliderProps>(
  (
    {
      id,
      swipeable,
      arrows,
      dots,
      onSlideChange,
      onArrowClick: onArrowClickProp,
      children,
      isDesktop,
      styles,
      isInfinite,
      arrowsDataQa,
      ...rest
    },
    ref
  ) => {
    const sliderRef = useRef<HTMLDivElement>()
    const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0)
    const prevIndex = usePrevious(activeSlideIndex)
    const isPlpV3 = useAtomValue(isPlpV3Atom)
    const isOnModelPlp2Up = useAtomValue(isOnModelPlp2UpAtom)
    const childrenArray = Children.toArray(children)
    const childrenArrayLength = childrenArray.length
    const isForcedScroll = useRef(false)

    useImperativeHandle(
      ref,
      () => {
        return {
          slideForward() {
            const slider = sliderRef.current
            if (slider) {
              isForcedScroll.current = true
              slider.scrollTo({ left: slider.clientWidth, behavior: 'smooth' })
            }
          },
          scrollToSlide(slideIndex, halfScrollRequired = false) {
            const slider = sliderRef.current
            if (slideIndex === -1 || !slider) return

            isForcedScroll.current = true
            const sliderWidth = slider.clientWidth
            const lastSlideScrollTarget = halfScrollRequired ? sliderWidth / 2 : sliderWidth
            const scrollTarget = sliderWidth * (slideIndex - 1)
            slider.scrollTo({
              left: scrollTarget + lastSlideScrollTarget,
              behavior: 'smooth',
            })
          },
        }
      },
      []
    )

    const handleScroll = useCallback(
      (e: UIEvent) => {
        const node = e.currentTarget
        if (Boolean(childrenArrayLength)) {
          const slideScrollThreshold = get(node, 'scrollWidth', 0) / childrenArrayLength
          const computedIndex = Boolean(slideScrollThreshold)
            ? Math.round(get(node, 'scrollLeft', 0) / slideScrollThreshold)
            : 0
          setActiveSlideIndex(computedIndex)
        }
      },
      [onSlideChange, childrenArrayLength]
    )

    const onArrowClick = useCallback(
      (direction: 'right' | 'left') => (event) => {
        event.preventDefault()
        event.stopPropagation()
        const slider = sliderRef.current
        if (Boolean(slider)) {
          const sliderScrollWidth = get(slider, 'scrollWidth', 0)
          const slideScrollThreshold = sliderScrollWidth / childrenArrayLength
          const isStartOfSlider = Math.round(slider.scrollLeft) === 0
          const isEndOfSlider =
            sliderScrollWidth - Math.round(slider.scrollLeft + slideScrollThreshold) <= 1

          const scrollStep = direction === 'right' ? slideScrollThreshold : -slideScrollThreshold

          if (isFunction(onArrowClickProp)) {
            const computedIndex = Boolean(slideScrollThreshold)
              ? Math.round(get(slider, 'scrollLeft', 0) / slideScrollThreshold)
              : 0

            onArrowClickProp(direction, computedIndex)
          }

          if (isInfinite && direction === 'left' && isStartOfSlider) {
            slider.scrollTo({ left: sliderScrollWidth })
            return
          }

          if (isInfinite && direction === 'right' && isEndOfSlider) {
            slider.scrollTo({ left: 0 })
            return
          }

          slider.scrollTo({ left: slider.scrollLeft + scrollStep, behavior: 'smooth' })
        }
      },
      [onArrowClickProp, childrenArrayLength]
    )

    useEffect(() => {
      if (
        isFunction(onSlideChange) &&
        Number.isSafeInteger(prevIndex) &&
        activeSlideIndex !== prevIndex
      ) {
        onSlideChange(activeSlideIndex, isForcedScroll.current)
        isForcedScroll.current = false
      }
    }, [activeSlideIndex])

    const displayDots = useMemo(() => childrenArrayLength > 1 && dots, [dots, childrenArrayLength])
    const { displayLeftArrow, displayRightArrow } = useMemo(() => {
      const commonDisplayCondition = childrenArrayLength > 1 && arrows
      return {
        displayLeftArrow: commonDisplayCondition && activeSlideIndex > 0,
        displayRightArrow: commonDisplayCondition && activeSlideIndex !== childrenArrayLength - 1,
      }
    }, [activeSlideIndex, arrows, childrenArrayLength])

    return (
      <Box
        width="100%"
        height="100%"
        overflow="hidden"
        position="relative"
        display="flex"
        flexDirection="column"
        {...rest}
      >
        {(displayLeftArrow || isInfinite) && (
          <ChevronLeft
            onClick={onArrowClick('left')}
            data-qa={arrowsDataQa?.leftArrow}
            isBold={isPlpV3 && isDesktop}
          />
        )}
        <Box
          ref={sliderRef}
          onScroll={handleScroll}
          display="flex"
          overflowX="scroll"
          position="relative"
          scrollSnapType="x mandatory"
          scrollSnapStop="always"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            'scrollbar-width': 'none',
          }}
        >
          {children}
        </Box>
        {(displayRightArrow || isInfinite) && (
          <ChevronRight
            onClick={onArrowClick('right')}
            data-qa={arrowsDataQa?.rightArrow}
            isBold={isPlpV3 && isDesktop}
          />
        )}
        {displayDots && (
          <ImageSliderPagination
            activeSlideIndex={activeSlideIndex}
            totalSlidesNum={isOnModelPlp2Up ? childrenArrayLength - 1 : childrenArrayLength}
            variant={isPlpV3 ? 'slide' : undefined}
            styles={styles}
          />
        )}
      </Box>
    )
  }
)

const Slide = ({ children, ...rest }) => {
  return (
    <Box
      display="flex"
      width="100%"
      justifyContent="center"
      alignItems="center"
      flexShrink="0"
      mr="0"
      boxSizing="border-box"
      transformOrigin="center center"
      transform="scale(1)"
      scrollSnapAlign="center"
      scrollSnapStop="always"
      overflow="hidden"
      {...rest}
    >
      {children}
    </Box>
  )
}

const arrowDefaults: PropsOf<typeof Button> = {
  variant: 'icon-only',
  p: '0',
  size: 'content',
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
}
interface ChevronProps {
  isBold: boolean
}

const ChevronLeft: FC<PropsOf<typeof Button> & ChevronProps> = ({ isBold, ...props }) => {
  const ChevronLeftComponent = isBold ? NavChevronLeftBoldIcon : NavChevronLeftIcon
  return (
    <Button className="swatch-slider-chevron-left" left="0" {...arrowDefaults} {...props}>
      <ChevronLeftComponent width="18" height="18" viewBox="0 0 24 24" />
    </Button>
  )
}

const ChevronRight: FC<PropsOf<typeof Button> & ChevronProps> = ({ isBold, ...props }) => {
  const ChevronRightComponent = isBold ? NavChevronRightBoldIcon : NavChevronRightIcon
  return (
    <Button className="swatch-slider-chevron-right" {...arrowDefaults} {...props}>
      <ChevronRightComponent width="18" height="18" viewBox="0 0 24 24" />
    </Button>
  )
}

const ImageSliderComponent = ImageSlider as ImageSliderType
ImageSliderComponent.Slide = Slide

export default ImageSliderComponent

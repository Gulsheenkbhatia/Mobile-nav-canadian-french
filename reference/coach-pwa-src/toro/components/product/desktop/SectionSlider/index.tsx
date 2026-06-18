import {
  Children,
  cloneElement,
  FC,
  useRef,
  useState,
  memo,
  useCallback,
  useEffect,
  ReactElement,
  useMemo,
  ReactNode,
} from 'react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { Splide, SplideSlide, SplideProps, SplideTrack } from '@splidejs/react-splide'
import CustomSliderPagination from 'toro/components/product/CustomSliderPagination'
import get from 'lodash/get'
import Box from 'toro/components/Box'
import {
  NavChevronLeftBoldIcon,
  NavChevronLeftIcon,
  NavChevronRightBoldIcon,
  NavChevronRightIcon,
} from 'toro/icons'
import { SystemStyleObject } from '@chakra-ui/react'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'

type SplideArrowProps = {
  isNext?: boolean
  isArrowVisible: boolean
  styles?: {
    container?: SystemStyleObject
    arrows?: SystemStyleObject
    arrowNext?: SystemStyleObject
    arrowPrev?: SystemStyleObject
  }
  isLastSlideVisible?: boolean
  dataQa?: string
  isBoldArrows: boolean
}

type SectionSliderProps = {
  perPage?: number
  loop?: boolean
  arrows?: boolean
  title?: string
  customStyles?: SystemStyleObject
  sliderOptions?: SplideProps['options']
  loadStrategy?: 'nearby' | 'sequential' | false
  customPagination?: boolean
  children: ReactNode | undefined
  customPaginationVariant?: string
  isSlider?: boolean
  maxContainerWidth?: number
  isRecommenderSlider?: boolean
  visibleSlideTreshhold?: number
  onMove?: (idx: number) => void | null
  dataQaTitle?: string
  dataQAWrapper?: string
  dataQaArrows?: { next?: string; prev?: string }
  variant?: string
}

const Arrow = memo(
  ({
    isNext = false,
    styles,
    isArrowVisible,
    isLastSlideVisible = false,
    dataQa,
    isBoldArrows,
  }: SplideArrowProps) => {
    const ChevronRight = isBoldArrows ? NavChevronRightBoldIcon : NavChevronRightIcon
    const ChevronLeft = isBoldArrows ? NavChevronLeftBoldIcon : NavChevronLeftIcon
    return (
      <Box
        as="button"
        className={`splide__arrow splide__arrow--${isNext ? 'next' : 'prev'}`}
        sx={{
          ...(styles?.arrows || {}),
          ...(styles?.[isNext ? 'arrowNext' : 'arrowPrev'] || {}),
          cursor: isLastSlideVisible && isNext ? 'not-allowed' : 'pointer',
          opacity: isLastSlideVisible && isNext ? 0.2 : 1,
          pointerEvents: isLastSlideVisible && isNext ? 'none' : 'auto',
        }}
        display={isArrowVisible ? 'flex' : 'none'}
        data-qa={dataQa}
      >
        {isNext ? <ChevronRight /> : <ChevronLeft />}
      </Box>
    )
  }
)

const SectionSlider: FC<SectionSliderProps> = ({
  loop = false,
  arrows = false,
  perPage = 0,
  title,
  sliderOptions = {},
  customPagination = true,
  customStyles = {},
  children,
  loadStrategy,
  customPaginationVariant = 'desktop',
  isSlider = true,
  maxContainerWidth,
  isRecommenderSlider = false,
  visibleSlideTreshhold = 0,
  onMove = null,
  dataQaTitle,
  dataQAWrapper,
  dataQaArrows,
  variant,
}) => {
  const sliderRef = useRef<Splide>()
  const [activeIdx, setActiveIdx] = useState(0)
  const numberOfSlides = Children.count(children)
  const maxIdx = numberOfSlides - 1 - (perPage ? perPage - 1 : 0)
  const leftArrowVisible = isSlider && ((!loop && activeIdx > 0) || loop)
  const rightArrowVisible =
    isSlider && ((!loop && activeIdx < maxIdx) || loop || isRecommenderSlider)
  const defaultStyles = useMultiStyleConfig('SectionSlider', { variant })
  const styles = { ...defaultStyles, ...customStyles }
  const isPDPv5_1 = useTemplate([TemplateName.pdpv5_1])
  const isLastSlideVisible =
    isRecommenderSlider && !!visibleSlideTreshhold
      ? activeIdx + visibleSlideTreshhold >= maxIdx
      : false

  const options = useMemo(
    () => ({
      type: loop ? 'loop' : 'slide',
      pagination: false,
      flickPower: 200,
      arrows,
      drag: isSlider,
      perPage: isSlider ? perPage : numberOfSlides,
      lazyLoad: loadStrategy,
      ...sliderOptions,
    }),
    [loop, arrows, isSlider, perPage, numberOfSlides, sliderOptions, loadStrategy]
  )

  const prevArrow = (
    <Arrow
      isBoldArrows={isPDPv5_1}
      styles={styles}
      isArrowVisible={leftArrowVisible}
      dataQa={dataQaArrows?.prev}
    />
  )
  const nextArrow = (
    <Arrow
      isBoldArrows={isPDPv5_1}
      isNext
      styles={styles}
      isArrowVisible={rightArrowVisible}
      isLastSlideVisible={isLastSlideVisible}
      dataQa={dataQaArrows?.next}
    />
  )

  const handleOnMove = useCallback(
    (_, idx) => {
      setActiveIdx(idx)
      onMove?.(idx)
    },
    [onMove]
  )

  useEffect(() => {
    sliderRef.current.go(0)
  }, [])

  const clickHandler = (splide, slide, e) => {
    if (slide?.isClone) {
      const dataActionValue = e?.target?.dataset?.action
      const targetInOriginalSlide = splide?.root?.querySelector(
        `li[data-index="${slide?.slideIndex}"]:not(.splide__slide--clone) [data-action="${dataActionValue}"]`
      )
      targetInOriginalSlide?.click()
    }
  }

  return (
    <Box as="section" style={styles.sectionSliderWrapper}>
      {title && (
        <Box as="h2" sx={styles.sectionSliderTitle} data-qa={dataQaTitle}>
          {title}
        </Box>
      )}
      <Box
        sx={styles.sectionSliderContainer}
        maxWidth={maxContainerWidth}
        className="section-slider-container"
        data-qa={dataQAWrapper}
      >
        <Splide
          onClick={clickHandler}
          onMove={handleOnMove}
          hasTrack={false}
          ref={sliderRef}
          options={options}
        >
          <SplideTrack>
            {Children.map(children, (child: ReactElement, index) => (
              <SplideSlide data-index={index} key={child.key}>
                {cloneElement(child, { loadStrategy })}
              </SplideSlide>
            ))}
          </SplideTrack>
          <Box className="splide__arrows">
            {prevArrow}
            {nextArrow}
          </Box>
        </Splide>
      </Box>
      {customPagination && isSlider && (
        <Box sx={styles.sectionSliderPagination} className="section-slider-custom-pagination">
          <CustomSliderPagination
            activeSlideIdx={activeIdx}
            lengthOfSlides={Children.count(children)}
            goToSlide={get(sliderRef, 'current.go')?.bind(sliderRef.current)}
            variant={customPaginationVariant}
            isLastSlideVisible={isLastSlideVisible}
          />
        </Box>
      )}
    </Box>
  )
}

export default SectionSlider

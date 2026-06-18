import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import SectionSlider from 'toro/components/product/desktop/SectionSlider'
import Flex from 'toro/components/Flex'
import { Children, FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { SplideProps } from '@splidejs/react-splide'
import { SystemStyleObject } from '@chakra-ui/react'

type FullWithSliderProps = {
  perPage?: number
  slideWidth?: number
  slidesGap?: number | string
  onSlideClick?: () => void
  children: ReactNode | undefined
  customStyles?: SystemStyleObject
  sliderOptions?: SplideProps['options']
}

const FullWidthSlider: FC<FullWithSliderProps> = ({
  perPage = 5,
  children,
  slideWidth,
  slidesGap,
  sliderOptions = {},
  customStyles = {},
}) => {
  const defaultStyles = useMultiStyleConfig('FullWidthSlider')
  const [isSlider, setIsSlider] = useState(true)
  const styles = { ...defaultStyles, ...customStyles }

  const numberOfSlides = Children.count(children)

  const maxContainerWidth = useMemo(() => {
    const gap = typeof slidesGap === 'string' ? parseFloat(slidesGap) : slidesGap
    return slideWidth && perPage && perPage * slideWidth + (gap ? gap : 0) * (perPage - 1)
  }, [slidesGap, slideWidth, perPage])

  useEffect(() => {
    const isSliderFunctionality = numberOfSlides > perPage || maxContainerWidth > window?.innerWidth
    setIsSlider(isSliderFunctionality)
  }, [])

  const options = useMemo(
    () => ({
      gap: slidesGap,
      focus: 'center',
      autoWidth: true,
      start: 0,
      ...sliderOptions,
    }),
    [sliderOptions, slidesGap]
  ) as SplideProps['options']

  return (
    <Flex sx={styles.fullWidthSliderWrapper}>
      <SectionSlider
        perPage={perPage}
        arrows={false}
        loop={true}
        maxContainerWidth={maxContainerWidth}
        isSlider={isSlider}
        sliderOptions={options}
      >
        {children}
      </SectionSlider>
    </Flex>
  )
}

export default FullWidthSlider

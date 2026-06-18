import ReactSlickSlider from 'react-slick'
import { forwardRef, ReactNode, Ref } from 'react'

export interface SliderProps {
  children?: ReactNode
  ref?: Ref<ReactSlickSlider>
  accessibility?: boolean
  speed?: number
  swipeToSlide?: boolean
  slidesToShow?: number
  slidesToScroll?: number | boolean
  initialSlide?: number
  infinite?: boolean
  centerMode?: boolean
  arrows?: boolean
  centerPadding?: string
  maxWidth?: string
  maxHeight?: string
  nextArrow?: ReactNode
  prevArrow?: ReactNode
  afterChange?: (currentSlide: number) => void
  onSwipe?: () => void
}

const Slider = forwardRef<ReactSlickSlider, SliderProps>((props, ref) => {
  return <ReactSlickSlider ref={ref} {...props} />
})

export default Slider

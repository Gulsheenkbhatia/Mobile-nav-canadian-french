import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { PrevArrowProps } from 'toro/components/Certona/Arrows/Left'

interface NextArrowProps extends PrevArrowProps {
  slidesToShow?: number
  recommendation?: boolean
  wyngSlider?: boolean
}

export default function NextArrow({ currentSlide, slideCount, variant, ...props }: NextArrowProps) {
  const { arrowProps, click, slidesToShow, recommendation, dataQa } = props
  const transformValue = recommendation ? 'translateX(140%)' : 'translateY(-50%)'
  const { ArrowRight } = useMultiStyleConfig('RecommendationArrows', { variant })
  const { formatMessage } = useIntl()

  const onArrowClick = useCallback(() => {
    click({ currentSlide, slideCount, type: 'next' })
  }, [currentSlide, slideCount])

  return (
    <Box
      as="button"
      type="button"
      onClick={onArrowClick}
      className="rightArrowStyle"
      sx={{
        mx: 'auto',
        right: arrowProps?.right || 25,
        transform: transformValue,
        display: currentSlide + slidesToShow === slideCount ? 'none' : 'initial',
        ...arrowProps,
        '& > svg': { outline: 'none' },
      }}
      data-qa={dataQa}
      aria-label={formatMessage({ id: 'carousel.next', defaultMessage: 'Next slide' })}
    >
      <ArrowRight width="48px" height="48px" viewBox="0 0 24 24" />
    </Box>
  )
}

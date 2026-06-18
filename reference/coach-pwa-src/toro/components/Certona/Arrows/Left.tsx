import { SystemStyleObject } from '@chakra-ui/react'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

export interface PrevArrowProps {
  currentSlide?: number
  slideCount?: number
  variant?: string
  arrowProps?: SystemStyleObject
  click: (params: { currentSlide: number; slideCount: number; type: string }) => void
  dataQa?: string
  promoDisplay?: boolean
  wyngModal?: boolean
}

function PrevArrow({ currentSlide, slideCount, variant, ...props }: PrevArrowProps) {
  const { arrowProps, click, promoDisplay, dataQa } = props
  const displayValue = promoDisplay || false
  const { ArrowLeft } = useMultiStyleConfig('RecommendationArrows', { variant })
  const { formatMessage } = useIntl()

  const onArrowClick = useCallback(() => {
    click({ currentSlide, slideCount, type: 'prev' })
  }, [currentSlide, slideCount])

  return (
    <Box
      as="button"
      type="button"
      onClick={onArrowClick}
      className="leftArrowStyle"
      sx={{
        mx: 'auto',
        pr: 0,
        left: 0,
        transform: 'translate(-160%, -50%)',
        display: currentSlide === 0 && !displayValue ? 'none' : 'initial',
        ...arrowProps,
        '& > svg': { outline: 'none' },
      }}
      data-qa={dataQa}
      aria-label={formatMessage({ id: 'carousel.prev', defaultMessage: 'Previous slide' })}
    >
      <ArrowLeft width="48px" height="48px" viewBox="0 0 24 24" />
    </Box>
  )
}

PrevArrow.defaultProps = {
  arrowProps: {},
  click: () => {},
}

export default PrevArrow

import { useMemo, useState } from 'react'
import Button, { ButtonProps } from 'toro/components/Button'
import Link from 'toro/components/Link'
import useTheme from 'toro/hooks/useTheme'
import get from 'lodash/get'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'

interface ReviewCTAProps extends Omit<ButtonProps, 'children' | 'onClick'> {
  link?: string
  target?: string
  prefetch?: boolean
  children?: React.ReactNode
  disableEffects?: boolean
  onClick?: () => void
}

function ReviewCTA({
  link = '',
  target = '',
  prefetch,
  children = null,
  disableEffects,
  ...props
}: ReviewCTAProps) {
  const theme = useTheme()
  const { colors } = theme
  const [isHover, setIsHover] = useState(false)
  const dataQA = get(props, 'data-qa', '')
  const isReviewSectionUnderProductImage = useExperiment(EXPERIMENTS.REVIEW_UNDER_PRODUCT_IMAGE)

  const hoverStateHandlers = useMemo(() => {
    return {
      onMouseOver: () => {
        setIsHover(true)
      },
      onMouseLeave: () => {
        setIsHover(false)
      },
    }
  }, [])

  const linkProps = {
    _hover: { textDecoration: isReviewSectionUnderProductImage ? 'underline' : 'none' },
    href: link,
    textDecoration: isReviewSectionUnderProductImage ? 'underline' : 'none',
    target,
    prefetch,
  }

  if (isReviewSectionUnderProductImage && dataQA !== 'rnr_btn_viewallrev') {
    return (
      <Link {...linkProps} onClick={props?.onClick}>
        Write a review
      </Link>
    )
  }

  const button = !isHover ? (
    <Button {...hoverStateHandlers} {...props} colorScheme="black" variant="outline">
      {children}
    </Button>
  ) : (
    <Button
      {...hoverStateHandlers}
      _hover={!disableEffects ? { bg: colors.main.black, color: colors.main.white } : {}}
      _active={!disableEffects ? { bg: colors.neutral.dark, color: colors.main.white } : {}}
      {...props}
      colorScheme="black"
      variant="outline"
    >
      {children}
    </Button>
  )

  return <>{link ? <Link {...linkProps}>{button}</Link> : button}</>
}

export default ReviewCTA

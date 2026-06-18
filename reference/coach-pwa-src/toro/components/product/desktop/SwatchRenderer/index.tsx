import type { SystemStyleObject } from '@chakra-ui/react'
import ColorSwatches from 'toro/components/product/mobile/ColorSwatches'
import ScrollableImageSwatchesPDP from 'toro/components/product/ScrollableSwatches'
import type { Color } from 'toro/components/Swatches'
import usePreference from 'toro/hooks/usePreference_new'

export type SwatchRendererScrollPassthrough = {
  styles: Record<string, SystemStyleObject>
  fadeColor: string
  openFullScreenLoading: () => void
  showTooltip?: boolean
  setScrollRef?: (obj: object) => void
  setFadingChildClassNames?: (str: string) => void
  tooltipProps?: object
  lazy?: boolean
  autoScrollContainerRef?: React.RefObject<HTMLElement | null>
}

export type SwatchRendererProps = {
  isMegaPDPEligible: boolean
  colors: Color[]
  onChange: (color: Color) => void
  activeColorId: string | undefined
} & SwatchRendererScrollPassthrough

const SwatchRenderer = ({
  isMegaPDPEligible,
  colors,
  onChange,
  activeColorId,
  ...rest
}: SwatchRendererProps) => {
  const {
    pdpPreferences: { enableThumbnailCarouselOnPDP = false },
  } = usePreference({
    PDPPreferences: ['enableThumbnailCarouselOnPDP'],
  })

  if (enableThumbnailCarouselOnPDP && !isMegaPDPEligible) {
    return <ColorSwatches activeColorId={activeColorId} colors={colors} onChange={onChange} />
  }

  return (
    <ScrollableImageSwatchesPDP minHeight="24px" colors={colors} onChange={onChange} {...rest} />
  )
}

export default SwatchRenderer

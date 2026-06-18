import React, { memo, useMemo } from 'react'
import type { SystemStyleObject } from '@chakra-ui/react'
import Swatch from 'toro/components/Swatches/Swatch'
import SwatchWithMobileTooltip from 'toro/components/Swatches/SwatchWithMobileTooltip'
import { Color } from 'toro/components/Swatches'
import ScrollableContent from 'toro/components/ScrollableContent'
import Link from 'toro/components/Link'
import getAPIURL from 'helpers/getAPIURL'
import get from 'lodash/get'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useAtomValue } from 'jotai/utils'
import { isTabbedAdaptivePDPEligibleAtom } from 'store/pdp.atom'
import useViewportType from 'toro/hooks/useViewportType'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import SwatchWithHoverTooltip from 'toro/components/Swatches/SwatchWithHoverTooltip'

type SwatchesProps = {
  colors: Color[]
  onChange: (color: Color) => void
  styles: Record<string, SystemStyleObject>
  minHeight: string
  fadeColor: string
  showTooltip?: boolean
  setScrollRef?: (obj: object) => void
  setFadingChildClassNames?: (str: string) => void
  tooltipProps?: object
  lazy?: boolean
  openFullScreenLoading: () => void
  autoScrollContainerRef?: React.RefObject<HTMLElement | null>
}

const ScrollableSwatchesPDP = ({
  colors,
  styles,
  onChange,
  fadeColor = 'var(--color-product-image-bg, #f0f0f0)',
  showTooltip = false,
  tooltipProps,
  lazy = true,
  openFullScreenLoading,
  ...rest
}: SwatchesProps) => {
  const analytics = useAnalytics()
  const { isMobile } = useViewportType()
  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const isPdpV41Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)

  const activeColorKey = useMemo(() => {
    const activeColor = colors.find((color) => color.isActiveColor)
    return activeColor?.id || activeColor?.vgId
  }, [colors])

  const onColorChange = (color) => {
    analytics.send('swatchInteraction', {
      eventLocation: 'product',
      eventAction: 'swatch click',
      eventLabel: get(color, 'vgId', 'undefined'),
      swatchType: 'color',
      swatchValue: get(color, 'text'),
      swatchVariant: get(color, 'vgId', 'undefined'),
    })
    openFullScreenLoading()
  }

  return (
    <ScrollableContent
      className={showTooltip ? 'color-variants' : undefined}
      fadeColor={fadeColor}
      wrapperStyles={styles?.wrapper}
      autoScrollTargetSelector=".activeColorSwatch"
      autoScrollContainerRef={rest.autoScrollContainerRef}
      autoScrollActiveSwatchTrigger={activeColorKey}
      {...rest}
    >
      {colors.map((color, index) => {
        // Use consistent key based on vgId or id, prioritizing vgId for uniqueness
        const colorKey = color.vgId || color.id || `color-${index}`
        const commonSwatchProps = {
          key: colorKey,
          color,
          isActive: color.isActiveColor,
          styles,
          onChange: () => !color.shouldNavigateToAnotherProduct && onChange(color),
        }

        const SwatchComponent = showTooltip ? (
          !isMobile ? (
            <SwatchWithHoverTooltip
              {...commonSwatchProps}
              productIdAttr={`${get(color, 'masterId')?.split('-')?.[0]} ${get(color, 'id')}`}
              lazy={index < 5 ? false : lazy}
            />
          ) : (
            <SwatchWithMobileTooltip
              {...commonSwatchProps}
              showTooltip={showTooltip}
              tooltipProps={tooltipProps}
              productIdAttr={`${get(color, 'masterId')?.split('-')?.[0]} ${get(color, 'id')}`}
              lazy={isTabbedAdaptivePDPEligible && index < (isPdpV41Enabled ? 4 : 7) ? false : lazy}
            />
          )
        ) : (
          <Swatch
            {...commonSwatchProps}
            lazy={isTabbedAdaptivePDPEligible && index < (isPdpV41Enabled ? 4 : 7) ? false : lazy}
          />
        )

        if (color.shouldNavigateToAnotherProduct && color.url) {
          return (
            <Link
              key={color.vgId}
              href={color.url}
              variant="unstyled"
              prefetch={true}
              prefetchUrl={getAPIURL(color.url)}
              onClick={() => onColorChange(color)}
            >
              {SwatchComponent}
            </Link>
          )
        }

        return SwatchComponent
      })}
    </ScrollableContent>
  )
}

export default memo(ScrollableSwatchesPDP)

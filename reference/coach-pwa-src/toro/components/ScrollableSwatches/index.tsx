import React, { memo } from 'react'
import { type SystemStyleObject } from '@chakra-ui/react'
import get from 'lodash/get'
import Swatch from 'toro/components/Swatches/Swatch'
import SwatchWithMobileTooltip from 'toro/components/Swatches/SwatchWithMobileTooltip'
import { Color } from 'toro/components/Swatches'
import ScrollableContent from 'toro/components/ScrollableContent'
import useViewportType from 'toro/hooks/useViewportType'
import DesktopScrollableSwatches from './DesktopScrollableSwatches'

type SwatchesProps = {
  colors: Color[]
  onChange: (color: Color) => void
  activeColorId: string | undefined
  styles: Record<string, SystemStyleObject>
  minHeight: string
  fadeColor?: string
  showTooltip?: boolean
  setScrollRef?: (obj: object) => void
  setFadingChildClassNames?: (str: string) => void
  tooltipProps?: object
  lazy?: boolean
  sx?: SystemStyleObject
  className?: string
  variant?: string | undefined
}

const ScrollableSwatches = ({
  colors,
  styles,
  onChange,
  activeColorId,
  fadeColor = '#F0F0F0',
  showTooltip = false,
  tooltipProps,
  lazy = true,
  variant,
  ...rest
}: SwatchesProps) => {
  const { isDesktop } = useViewportType()

  const swatches = colors.map((color) =>
    showTooltip ? (
      <SwatchWithMobileTooltip
        color={color}
        styles={styles}
        key={`color-${color.id}`}
        onChange={() => onChange(color)}
        isActive={get(color, 'id', null) === activeColorId}
        showTooltip={showTooltip}
        tooltipProps={tooltipProps}
        productIdAttr={`${get(color, 'masterId')?.split('-')?.[0]} ${get(color, 'id')}`}
        lazy={lazy}
        pageType="plp"
      />
    ) : (
      <Swatch
        color={color}
        styles={styles}
        key={`color-${color.id}`}
        onChange={() => onChange(color)}
        isActive={get(color, 'id', null) === activeColorId}
        lazy={lazy}
      />
    )
  )

  if (isDesktop) {
    return (
      <DesktopScrollableSwatches
        addScrollEvent={swatches?.length > 4}
        colors={colors}
        styles={styles}
        fadeColor={fadeColor}
      >
        {swatches}
      </DesktopScrollableSwatches>
    )
  }

  return (
    <ScrollableContent
      fadeColor={fadeColor}
      wrapperStyles={styles?.wrapper}
      className={showTooltip ? 'color-variants' : undefined}
      addScrollEvent={swatches?.length > 4}
      variant={variant}
      {...rest}
    >
      {swatches}
    </ScrollableContent>
  )
}

export default memo(ScrollableSwatches)

import React, { memo, useState } from 'react'
import { type SystemStyleObject } from '@chakra-ui/react'
import { Color } from 'toro/components/Swatches'
import ScrollableContent from 'toro/components/ScrollableContent'
import useScrollToSelectedColorSwatch from 'toro/hooks/useScrollToSelectedColorSwatch'
import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import { NavChevronLeftIcon, NavChevronRightIcon } from 'toro/icons'

const PAGE_SPACING_BORDER = 4

type SwatchesProps = {
  colors?: Color[]
  styles?: Record<string, SystemStyleObject>
  fadeColor?: string
  children: React.ReactNode
  showArrows?: boolean
  addScrollEvent?: boolean
  variant?: 'size' | 'color'
}

const COLOR_SWATCH_WIDTH = 40 // 24px is swatch size, it is static, 16px is margin between the elements
const PAGINATION_ARROWS_LIMIT = 4
const SIZE_SWATCH_WIDTH = 60

const ARROW_DEFAULTS = {
  variant: 'icon-only',
  p: '0',
  size: 'content',
  zIndex: 1,
}

const DesktopScrollableSwatches = ({
  colors = [],
  styles,
  fadeColor = '#F0F0F0',
  children,
  showArrows,
  variant = 'color',
  addScrollEvent = true,
  ...rest
}: SwatchesProps) => {
  const activeIndex = colors.findIndex((item) => item.isActiveColor)
  const countOfColorSwatches = colors?.length
  const isDisplayPaginationArrows =
    typeof showArrows === 'undefined' ? countOfColorSwatches > PAGINATION_ARROWS_LIMIT : showArrows
  const [fadingChildClassNames, setFadingChildClassNames] = useState('')

  const { containerRef, setContainerRef } = useScrollToSelectedColorSwatch({
    activeIndex,
    pageSpacingBorder: PAGE_SPACING_BORDER,
  })

  const handleScrollByClick = (direction: 'left' | 'right') => {
    const container = containerRef

    if (!container) return
    const { scrollLeft } = container
    let targetScrollLeft = scrollLeft
    if (direction === 'left') {
      targetScrollLeft -= variant === 'size' ? SIZE_SWATCH_WIDTH : COLOR_SWATCH_WIDTH
    } else if (direction === 'right') {
      targetScrollLeft += variant === 'size' ? SIZE_SWATCH_WIDTH : COLOR_SWATCH_WIDTH
    }

    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    })
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      position="relative"
      p="0 var(--spacing-6)"
      className="scrollable-container"
    >
      {isDisplayPaginationArrows && (
        <Button
          {...ARROW_DEFAULTS}
          sx={styles?.arrows}
          onClick={() => handleScrollByClick('left')}
          isDisabled={fadingChildClassNames?.includes('leftFadeHidden')}
          opacity={fadingChildClassNames?.includes('leftFadeHidden') ? '0.2 !important' : '1'}
          data-qa="d_plp_left_arrow_swatch"
        >
          <NavChevronLeftIcon width="24" height="24" viewBox="0 0 24 24" />
        </Button>
      )}
      <ScrollableContent
        fadeColor={fadeColor}
        wrapperStyles={styles?.wrapper}
        setFadingChildClassNames={setFadingChildClassNames}
        setScrollRef={setContainerRef}
        sx={styles?.mainSwatchesWrapper}
        addScrollEvent={addScrollEvent}
        {...rest}
      >
        {children}
      </ScrollableContent>
      {isDisplayPaginationArrows && (
        <Button
          {...ARROW_DEFAULTS}
          sx={styles?.arrows}
          right="0"
          onClick={() => handleScrollByClick('right')}
          isDisabled={fadingChildClassNames?.includes('rightFadeHidden')}
          opacity={fadingChildClassNames?.includes('rightFadeHidden') ? '0.2 !important' : '1'}
          data-qa="d_plp_right_arrow_swatch"
        >
          <NavChevronRightIcon width="24" height="24" viewBox="0 0 24 24" />
        </Button>
      )}
    </Box>
  )
}

export default memo(DesktopScrollableSwatches)

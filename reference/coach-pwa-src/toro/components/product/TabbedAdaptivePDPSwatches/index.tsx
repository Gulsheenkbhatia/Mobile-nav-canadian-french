import { useRef, useState } from 'react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Box from 'toro/components/Box'
import ScrollableSwatchesPDP from 'toro/components/product/ScrollableSwatches'
import Button from 'toro/components/Button'
import { NavChevronLeftIcon, NavChevronRightIcon } from 'toro/icons'
import { useUpdateAtom } from 'jotai/utils'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import useScrollToSelectedColorSwatch from 'toro/hooks/useScrollToSelectedColorSwatch'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Text from 'toro/components/Text'
import { useIntl } from 'react-intl'

const PAGINATION_ARROWS_LIMIT = 6
const PAGINATION_ARROWS_LIMIT_V_4_1 = 4

const ARROW_DEFAULTS = {
  variant: 'icon-only',
  p: '0',
  size: 'content',
  zIndex: 1,
}

const COLOR_SWATCH_WIDTH = 48 // 30px is swatch size, it is static, 18px is margin between the elements
const COLOR_SWATCH_WIDTH_V_4_1 = 58 // 42px is swatch size, it is static, 16px is margin between the elements
const PAGE_SPACING_BORDER = 38
const PAGE_SPACING_BORDER_V_4_2 = 16

const TabbedAdaptivePDPColorSwatches = ({ items, onChange, hslColor, activeColor }) => {
  const isPdpV41Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)
  const isPdpV42Enabled = useExperiment(EXPERIMENTS.PDP_V4_2)
  const parentRef = useRef(null)
  const [fadingChildClassNames, setFadingChildClassNames] = useState('')
  const styles = useMultiStyleConfig('TabbedAdaptivePDPSwatches', {
    variant: isPdpV41Enabled || isPdpV42Enabled ? 'pdpV4Enhanced' : null,
  })
  const countOfColorSwatches = items?.length
  const paginationArrowsLimit = isPdpV41Enabled
    ? PAGINATION_ARROWS_LIMIT_V_4_1
    : PAGINATION_ARROWS_LIMIT
  const isDisplayPaginationArrows = countOfColorSwatches > paginationArrowsLimit
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)

  const handleScrollByClick = (direction) => {
    const container = containerRef
    if (!container) return
    const { scrollLeft } = container
    let targetScrollLeft = scrollLeft
    const colorSwatchWidth =
      isPdpV41Enabled || isPdpV42Enabled ? COLOR_SWATCH_WIDTH_V_4_1 : COLOR_SWATCH_WIDTH
    if (direction === 'left') {
      targetScrollLeft -= colorSwatchWidth
    } else if (direction === 'right') {
      targetScrollLeft += colorSwatchWidth
    }

    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    })
  }

  const openFullScreenLoading = () => setFullscreenLoading(true)

  const activeIndex = items.findIndex((item) => item.isActiveColor)

  const { containerRef, setContainerRef } = useScrollToSelectedColorSwatch({
    activeIndex,
    pageSpacingBorder: isPdpV42Enabled ? PAGE_SPACING_BORDER_V_4_2 : PAGE_SPACING_BORDER,
  })

  const tooltipProps = {
    portalProps: { containerRef: parentRef },
  }
  const { formatMessage } = useIntl()

  const colorLabel = formatMessage({ id: 'pdp.product.colorText', defaultMessage: 'Color' })

  return (
    <Box
      display="flex"
      justifyContent="center"
      className="scroll-parent"
      ref={parentRef}
      position="relative"
      sx={styles.mainWrapper}
    >
      {isPdpV42Enabled && (
        <Text
          sx={styles.activeColorLabel}
          data-qa="cm_txt_pdt_label_color"
        >{`${colorLabel}: ${activeColor}`}</Text>
      )}
      {isDisplayPaginationArrows && (
        <Button
          {...ARROW_DEFAULTS}
          onClick={() => handleScrollByClick('left')}
          isDisabled={fadingChildClassNames?.includes('leftFadeHidden')}
          opacity={fadingChildClassNames?.includes('leftFadeHidden') ? '0.2 !important' : '1'}
          data-qa="pdp_pagination_arrow_left"
        >
          <NavChevronLeftIcon width="26" height="26" viewBox="0 0 24 24" />
        </Button>
      )}
      <ScrollableSwatchesPDP
        minHeight="24px"
        colors={items}
        onChange={onChange}
        styles={styles}
        fadeColor={hslColor}
        setScrollRef={setContainerRef}
        setFadingChildClassNames={setFadingChildClassNames}
        showTooltip
        tooltipProps={tooltipProps}
        openFullScreenLoading={openFullScreenLoading}
      />
      {isDisplayPaginationArrows && (
        <Button
          {...ARROW_DEFAULTS}
          right="0"
          onClick={() => handleScrollByClick('right')}
          isDisabled={fadingChildClassNames?.includes('rightFadeHidden')}
          opacity={fadingChildClassNames?.includes('rightFadeHidden') ? '0.2 !important' : '1'}
          data-qa="pdp_pagination_arrow_right"
        >
          <NavChevronRightIcon width="26" height="26" viewBox="0 0 24 24" />
        </Button>
      )}
    </Box>
  )
}

export default TabbedAdaptivePDPColorSwatches

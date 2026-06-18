import { useRef, useState, useMemo, useContext } from 'react'
import { useRouter } from 'next/router'
import get from 'lodash/get'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'

import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useProductData from 'toro/hooks/useProductData'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import usePreference from 'toro/hooks/usePreference_new'
import useScrollToSelectedColorSwatch from 'toro/hooks/useScrollToSelectedColorSwatch'
import { filteredItemsWithSrc } from 'helpers/getColorSwatches'

import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Button from 'toro/components/Button'
import SwatchRenderer from 'toro/components/product/desktop/SwatchRenderer'
import ColorSwatchesSkeleton from 'toro/components/product/desktop/PDPColorSwatches/ColorSwatchesSkeleton'

import { NavChevronLeftIcon, NavChevronRightIcon } from 'toro/icons'

import SessionContext from 'toro/components/SessionContext'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import {
  displayedColorsAtom,
  isMegaPDPEligibleAtom,
  appLoadingAtom,
  dropAtbErrorsAtom,
  selectedSizeAtom,
  isSizedProductAtom,
} from 'store/pdp.atom'
import useSelectColor from 'toro/hooks/useSelectColor'
import SizeSelectorInventoryBadge from 'toro/components/product/desktop/StickyBar/SizeSelector/SizeSelectorInventoryBadge'
import useAnalytics from 'toro/analytics/useAnalytics'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'

const ARROW_DEFAULTS = {
  variant: 'icon-only',
  p: '0',
  size: 'content',
  zIndex: 1,
}
const PAGINATION_ARROWS_LIMIT = 6
const COLOR_SWATCH_WIDTH = 48 // 48px is swatch size, it is static
const SWATCHES_GAP = 8 // 8px is gap between the elements
const SWATCHES_GAP_V_5_1 = 11 // 11px is gap between the elements
const PAGE_SPACING_BORDER = 18

const PDPColorSwatches = ({
  variant: variantTheme = null,
  fadeColor = 'var(--color-white-base)',
  showInventoryBadge = false,
  hideArrows = false,
}) => {
  const [variationGroup, requestedId, variant] = useProductData([
    'variationGroup',
    'requestedId',
    'variant',
  ])
  const [selectedColorId, selectedColorMasterId, selectedColorText] = useSelectedColorData([
    'id',
    'masterId',
    'text',
  ])
  const initialItems = useAtomValue(displayedColorsAtom)
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const isAppLoading = useAtomValue(appLoadingAtom)
  const parentRef = useRef(null)
  const [fadingChildClassNames, setFadingChildClassNames] = useState('')
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)
  const router = useRouter()
  const { query: routerQuery } = router
  const { session } = useContext(SessionContext)
  const selectColor = useSelectColor()
  const dropAtbErrors = useUpdateAtom(dropAtbErrorsAtom)
  const selectedSize = useAtomValue(selectedSizeAtom)
  const isSizedProduct = useAtomValue(isSizedProductAtom)
  const isInventoryBadgeVisible = showInventoryBadge && !selectedSize
  const analytics = useAnalytics()
  const isPDPv6 = useTemplate([TemplateName.pdpv6])
  const isPDPv5_1 = useTemplate([TemplateName.pdpv5_1])

  const sourceCodeGroupId = useMemo(
    () => get(session, 'user.sourceCodeGroupID', get(routerQuery, 'src')),
    [session]
  )

  const {
    toggleSiteFeatures: { sourceCodeGroupAttributeMapping = {} },
    salePreferences: { enablePdpSwatchSuppression: isEnableSaleSuppression = false },
    storefrontConfigs: { displayOosSwatch: isDisplayOosSwatch },
  } = usePreference({
    ToggleSiteFeatures: ['sourceCodeGroupAttributeMapping'],
    salePreferences: ['enablePdpSwatchSuppression'],
    'Storefront Configs': ['displayOosSwatch'],
  })

  const displayedItems = useMemo(() => {
    let displayedItems = initialItems
    if (variationGroup?.length > 0) {
      const filteredItems = filteredItemsWithSrc({
        items: initialItems,
        variationSrc: variationGroup,
        sourceCodeGroupId,
        sourceCodeGroupAttributeMapping,
        isCheckForCustomizedVariant: true,
        isEnableSaleSuppression,
        requestedId,
      })
      displayedItems = filteredItems?.length ? filteredItems : initialItems
    }
    const colorSwatches = displayedItems
      .map((item) => {
        const hasSameMasterId = selectedColorMasterId === get(item, 'masterId')
        const isActiveColor = get(item, 'id') === selectedColorId && hasSameMasterId
        const shouldNavigateToAnotherProduct = isMegaPDPEligible && !hasSameMasterId
        return {
          ...item,
          isActiveColor,
          shouldNavigateToAnotherProduct,
        }
      })
      .filter((item) => {
        const hasSameMasterId = selectedColorMasterId === get(item, 'masterId')
        const isCustomized = get(item, 'isCustomized') || get(item, 'isMonogrammed')
        return !isCustomized || hasSameMasterId
      })

    if (!isDisplayOosSwatch) {
      return colorSwatches.filter(
        (item) => item.isActiveColor || item.orderable || item.displayIfOOS
      )
    }

    return colorSwatches
  }, [initialItems, variationGroup, selectedColorId, sourceCodeGroupId, selectedColorMasterId])

  const onChange = (color) => {
    const cIsCustomized = get(color, 'isCustomized', false)
    const cIisMonogrammed = get(color, 'isMonogrammed', false)
    const isCustomized = cIsCustomized || cIisMonogrammed
    const customizedColorId = color?.baseProductColor || color?.id
    const colorIdForVariant = isCustomized ? customizedColorId : color?.id

    selectColor({ id: color?.id, masterId: color?.masterId })
    dropAtbErrors()

    const swatchVariant = variant?.find((variant) => {
      if (isSizedProduct) {
        return (
          variant?.masterId === color?.masterId &&
          variant?.variationValues?.color === colorIdForVariant &&
          variant?.variationValues?.size === selectedSize
        )
      }

      return (
        variant?.masterId === color?.masterId &&
        variant?.variationValues?.color === colorIdForVariant
      )
    })?.id

    analytics.send('swatchInteraction', {
      eventAction: 'swatch click',
      eventLabel: swatchVariant,
      item_id: selectedColorMasterId,
      eventLocation: 'product',
      swatchType: 'color',
      swatchValue: color?.text,
      swatchVariant: swatchVariant,
    })
  }

  const countOfColorSwatches = displayedItems?.length
  const scrollable = useMemo(() => {
    if (!parentRef?.current || countOfColorSwatches <= PAGINATION_ARROWS_LIMIT) return false
    const swatchesGap = isPDPv5_1 ? SWATCHES_GAP_V_5_1 : SWATCHES_GAP
    return (
      parentRef?.current?.clientWidth <
      countOfColorSwatches * COLOR_SWATCH_WIDTH + (countOfColorSwatches - 1) * swatchesGap
    )
  }, [countOfColorSwatches, parentRef?.current?.clientWidth])
  const shouldShowPaginationArrows = !hideArrows && scrollable
  const styles = useMultiStyleConfig('PDPColorSwatches', {
    variant: variantTheme,
    scrollable,
  })

  const handleScrollByClick = (direction) => {
    const container = containerRef
    if (!container) return
    const { scrollLeft } = container
    let targetScrollLeft = scrollLeft
    const colorSwatchWidth = isPDPv5_1
      ? COLOR_SWATCH_WIDTH + SWATCHES_GAP_V_5_1
      : COLOR_SWATCH_WIDTH
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

  const activeIndex = displayedItems.findIndex((item) => item.isActiveColor)

  const { containerRef, setContainerRef } = useScrollToSelectedColorSwatch({
    activeIndex,
    pageSpacingBorder: PAGE_SPACING_BORDER,
    isDesktop: true,
    gap: isPDPv5_1 ? SWATCHES_GAP_V_5_1 : undefined,
  })

  const tooltipProps = {
    portalProps: { containerRef: parentRef },
  }

  if (isAppLoading) {
    return <ColorSwatchesSkeleton styles={styles} />
  }

  if (!displayedItems?.length) {
    return null
  }
  return (
    <Box sx={styles.containerWrapper} className="color-swatches-wrapper">
      <Box sx={styles.colorLabel} data-qa="cm_txt_pdt_label_color">
        {isPDPv6 ? selectedColorText : `Color: ${selectedColorText}`}
        {isInventoryBadgeVisible && <SizeSelectorInventoryBadge />}
      </Box>
      <Box
        className="scroll-parent color-swatches-container"
        ref={parentRef}
        sx={styles.mainWrapper}
      >
        <Flex justifyContent="space-between">
          {shouldShowPaginationArrows && (
            <Button
              {...ARROW_DEFAULTS}
              onClick={() => handleScrollByClick('left')}
              isDisabled={fadingChildClassNames?.includes('leftFadeHidden')}
              opacity={fadingChildClassNames?.includes('leftFadeHidden') ? '0.2 !important' : '1'}
              className="left-arrow"
            >
              <NavChevronLeftIcon width="26" height="26" viewBox="0 0 24 24" />
            </Button>
          )}
          <SwatchRenderer
            isMegaPDPEligible={isMegaPDPEligible}
            activeColorId={selectedColorId}
            colors={displayedItems}
            onChange={onChange}
            styles={styles}
            fadeColor={shouldShowPaginationArrows && !isPDPv5_1 ? fadeColor : 'none'}
            setScrollRef={setContainerRef}
            setFadingChildClassNames={setFadingChildClassNames}
            autoScrollContainerRef={parentRef}
            showTooltip
            tooltipProps={tooltipProps}
            openFullScreenLoading={openFullScreenLoading}
          />
          {shouldShowPaginationArrows && (
            <Button
              {...ARROW_DEFAULTS}
              right="0"
              onClick={() => handleScrollByClick('right')}
              isDisabled={fadingChildClassNames?.includes('rightFadeHidden')}
              opacity={fadingChildClassNames?.includes('rightFadeHidden') ? '0.2 !important' : '1'}
              className="right-arrow"
            >
              <NavChevronRightIcon width="26" height="26" viewBox="0 0 24 24" />
            </Button>
          )}
        </Flex>
      </Box>
    </Box>
  )
}

export default PDPColorSwatches

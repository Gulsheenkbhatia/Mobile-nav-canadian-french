import { useCallback, useEffect, useMemo, useRef } from 'react'
import get from 'lodash/get'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import useSelectColor from 'toro/hooks/useSelectColor'
import useProductData from 'toro/hooks/useProductData'
import useAnalytics from 'toro/analytics/useAnalytics'

import getAPIURL from 'helpers/getAPIURL'
import getPdpPathKeyFromHref from 'toro/helpers/getPdpPathKeyFromHref'
import { displayedColorsAtom, dropAtbErrorsAtom, isMegaPDPEligibleAtom } from 'store/pdp.atom'
import { pdpV7SuppressEntranceForPathKeyAtom } from 'store/pdpv7.atom'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'

import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Link from 'toro/components/Link'
import ProductImageSwatchesV7 from 'toro/components/product/mobile/v7/ProductImageSwatchesV7Container/ProductImageSwatchesV7'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import StylesProvider from 'toro/components/StylesProvider'

const ProductImageSwatchesV7Container = () => {
  const styles = useMultiStyleConfig('ProductImageSwatchesV7')

  const analytics = useAnalytics()
  const initialItems = useAtomValue(displayedColorsAtom)
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)
  const [masterNotifyMeAvailable, customNotifyMeAvailable] = useProductData([
    'master.customAttributes.c_isNotifyMeAvailable',
    'custom.c_isNotifyMeAvailable',
  ])
  const dropAtbErrors = useUpdateAtom(dropAtbErrorsAtom)
  const setSuppressPdpV7EntranceForPath = useUpdateAtom(pdpV7SuppressEntranceForPathKeyAtom)

  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLDivElement>(null)

  const [selectedColorId, selectedColorMasterId] = useSelectedColorData(['id', 'masterId'])

  const selectColor = useSelectColor()

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }, [selectedColorId])

  const notifyMeAtProductLevel = Boolean(masterNotifyMeAvailable || customNotifyMeAvailable)

  const displayedItems = useMemo(() => {
    if (!initialItems?.length) return []

    return initialItems
      .filter((item) => {
        if (!item?.id) return false

        const isCustomized = item?.isCustomized || item?.isMonogrammed
        if (isCustomized && item.masterId !== selectedColorMasterId) return false

        return true
      })
      .map((item) => {
        const hasSameMasterId = selectedColorMasterId === item.masterId
        const shouldNavigateToAnotherProduct = isMegaPDPEligible && !hasSameMasterId
        const isOutOfStock = !item.orderable
        const notifyMeForSwatch = notifyMeAtProductLevel
        const isInteractionDisabled =
          !shouldNavigateToAnotherProduct && isOutOfStock && !notifyMeForSwatch

        return {
          ...item,
          isActiveColor: item.id === selectedColorId && hasSameMasterId,
          isOutOfStock,
          isInteractionDisabled,
          shouldNavigateToAnotherProduct,
        }
      })
  }, [
    initialItems,
    isMegaPDPEligible,
    notifyMeAtProductLevel,
    selectedColorId,
    selectedColorMasterId,
  ])

  const handleMegaPdpNavigate = useCallback(
    (color) => {
      analytics.send('swatchInteraction', {
        eventLocation: 'product',
        eventAction: 'swatch click',
        eventLabel: get(color, 'vgId', 'undefined'),
        swatchType: 'color',
        swatchValue: get(color, 'text'),
        swatchVariant: get(color, 'vgId', 'undefined'),
      })
      const targetPath = getPdpPathKeyFromHref(String(color?.url ?? ''))
      if (targetPath) {
        setSuppressPdpV7EntranceForPath(targetPath)
      }
      setFullscreenLoading(true)
    },
    [analytics, setFullscreenLoading, setSuppressPdpV7EntranceForPath]
  )

  const handleChange = (color) => {
    selectColor({ id: color?.id, masterId: color?.masterId })
    dropAtbErrors()

    analytics.send('swatchInteraction', {
      eventLocation: 'product',
      eventAction: 'swatch click',
      swatchType: 'color',
      swatchValue: color?.text,
    })
  }

  if (!displayedItems?.length) return null

  return (
    <StylesProvider value={styles}>
      <Box sx={styles.swatchesOuter}>
        <Flex ref={scrollRef} sx={styles.swatchesScroll}>
          {displayedItems.map((color) => {
            const isActive = color.isActiveColor
            const navigateToProduct = color.shouldNavigateToAnotherProduct && color.url

            const swatch = (
              <ProductImageSwatchesV7
                color={color}
                isActive={isActive}
                onChange={
                  navigateToProduct
                    ? () => {}
                    : () => {
                        handleChange(color)
                      }
                }
                productIdAttr={`${color.masterId} ${color.id}`}
                isOutOfStock={color.isOutOfStock}
                isInteractionDisabled={color.isInteractionDisabled}
                isNavigationLinkChild={Boolean(navigateToProduct)}
              />
            )

            return (
              <Box
                key={`${color.masterId}-${color.id}`}
                sx={styles.swatchItem}
                data-active={isActive ? 'true' : 'false'}
                ref={isActive ? activeRef : null}
              >
                {navigateToProduct ? (
                  <Link
                    href={color.url}
                    variant="unstyled"
                    prefetch
                    prefetchUrl={getAPIURL(color.url)}
                    sx={styles.swatchLink}
                    onClick={() => handleMegaPdpNavigate(color)}
                  >
                    {swatch}
                  </Link>
                ) : (
                  swatch
                )}
              </Box>
            )
          })}
        </Flex>

        <Box sx={styles.swatchFadeLeftWhite} />
        <Box sx={styles.swatchFadeRightWhite} />
      </Box>
    </StylesProvider>
  )
}

export default ProductImageSwatchesV7Container

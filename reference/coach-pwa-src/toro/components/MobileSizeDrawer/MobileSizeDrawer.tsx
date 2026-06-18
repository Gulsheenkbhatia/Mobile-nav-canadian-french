import React, { useCallback, useState, useEffect, memo } from 'react'
import StickyContainer from 'toro/components/StickyContainer'
import PlpSizeDrawerContent from 'toro/components/list/PlpSizeDrawer/PlpSizeDrawerContent'
import useAnalytics from 'toro/analytics/useAnalytics'
import toggleBodyScroll from 'toro/helpers/toggleBodyScroll'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { addToBagSizesAtom, sizeDrawerVgIdAtom, sizeDrawerAnalyticsDataAtom } from 'store/plp.atom'
import { sizeDrawerMobileAtom } from 'store/global.atom'
import useAddToCart from 'toro/hooks/useAddToCart'
import { MAX_Z_INDEX } from 'toro/constants/appConstants'

const MobileSizeDrawer = function (): JSX.Element {
  const [selectedSizeValue, setSelectedSizeValue] = useState('')
  const [selectedSize, setSelectedSize] = useState<any>(null)
  const analytics = useAnalytics()
  const sizes = useAtomValue(addToBagSizesAtom)
  const variationGroupId = useAtomValue(sizeDrawerVgIdAtom)
  const setSizeDrawerMobile = useUpdateAtom(sizeDrawerMobileAtom)
  const analyticsData = useAtomValue(sizeDrawerAnalyticsDataAtom)

  const { addToCart } = useAddToCart({
    variantId: selectedSize?.variantId,
    analyticsData,
  })
  const setFlyoutOpen = useCallback(
    (value) => {
      setSizeDrawerMobile(value)
      if (!value) {
        analytics.send('listInteraction', {
          eventAction: 'quick add to bag drawer close',
          eventLocation: 'quick add to cart drawer',
          eventLabel: variationGroupId,
        })
      }
    },
    [variationGroupId]
  )

  const onClose = useCallback(() => {
    setFlyoutOpen?.(false)
  }, [setFlyoutOpen])

  const onSizeControlClick = useCallback(
    (value: string) => {
      setSelectedSizeValue(value)
      const selectedSize = sizes.find((size) => value === size.value)
      setSelectedSize(selectedSize)

      analytics.send('swatchInteraction', {
        eventAction: 'swatch click',
        eventLabel: variationGroupId,
        eventLocation: 'quick add to cart drawer',
        swatchType: 'size',
        swatchValue: selectedSize.name,
        swatchVariant: selectedSize.variantId,
      })
    },
    [variationGroupId]
  )

  const onAddToBagClickHandler = useCallback(async () => {
    if (!selectedSize) {
      return
    }
    await addToCart()
  }, [sizes, selectedSizeValue])

  useEffect(() => {
    toggleBodyScroll(false)
    analytics.send('listInteraction', {
      eventAction: 'quick add to bag drawer open',
      eventLocation: 'quick add to cart drawer',
      eventLabel: variationGroupId,
    })
    return () => {
      toggleBodyScroll(true)
    }
  }, [])

  return (
    <StickyContainer
      setFlyoutOpen={setFlyoutOpen}
      isFlyoutOpen
      variant="plpSizeGuide"
      isPlp
      zIndex={MAX_Z_INDEX - 1}
      position="relative"
    >
      <PlpSizeDrawerContent
        onClose={onClose}
        sizes={sizes}
        selectedSizeValue={selectedSizeValue}
        onSizeControlClick={onSizeControlClick}
        onAddToBagClick={onAddToBagClickHandler}
      />
    </StickyContainer>
  )
}

export default memo(MobileSizeDrawer)

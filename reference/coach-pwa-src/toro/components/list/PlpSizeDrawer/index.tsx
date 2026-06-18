import React, { useCallback, useState, useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import StickyContainer from 'toro/components/StickyContainer'
import PlpSizeDrawerContent from 'toro/components/list/PlpSizeDrawer/PlpSizeDrawerContent'
import useAnalytics from 'toro/analytics/useAnalytics'
import toggleBodyScroll from 'toro/helpers/toggleBodyScroll'
import { useAtomValue } from 'jotai/utils'
import { addToBagSizesAtom, sizeDrawerVgIdAtom } from 'store/plp.atom'

type PlpSizeDrawerProps = {
  setIsOpen: (open: boolean) => void
  onAddToBagClick: (variant: string) => void | Promise<void>
}

const PlpSizeDrawer = function ({ setIsOpen, onAddToBagClick }: PlpSizeDrawerProps): JSX.Element {
  const [selectedSizeValue, setSelectedSizeValue] = useState('')
  const analytics = useAnalytics()
  const sizes = useAtomValue(addToBagSizesAtom)
  const variationGroupId = useAtomValue(sizeDrawerVgIdAtom)

  const setFlyoutOpen = useCallback(
    (value) => {
      setIsOpen?.(value)
      if (!value) {
        analytics.send('listInteraction', {
          eventAction: 'quick add to bag drawer close',
          eventLocation: 'quick add to cart drawer',
          eventLabel: variationGroupId,
        })
      }
    },
    [setIsOpen, variationGroupId]
  )

  const onClose = useCallback(() => {
    setFlyoutOpen?.(false)
  }, [setFlyoutOpen])

  const onSizeControlClick = useCallback(
    (value: string) => {
      setSelectedSizeValue(value)
      const selectedSize = sizes.find((size) => value === size.value)

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
    if (!selectedSizeValue) {
      return
    }
    const selectedSize = sizes.find((size) => selectedSizeValue === size.value)
    await onAddToBagClick(selectedSize?.variantId)
  }, [sizes, onAddToBagClick, selectedSizeValue])

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
    <StickyContainer setFlyoutOpen={setFlyoutOpen} isFlyoutOpen variant="plpSizeGuide" isPlp>
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

PlpSizeDrawer.propTypes = {
  setIsOpen: PropTypes.func,
  sizes: PropTypes.array,
  onAddToBagClick: PropTypes.func,
  variationGroupId: PropTypes.string,
}

PlpSizeDrawer.defaultProps = {
  setIsOpen: () => {},
  sizes: [],
  onAddToBagClick: () => {},
  variationGroupId: '',
}

export default memo(PlpSizeDrawer)

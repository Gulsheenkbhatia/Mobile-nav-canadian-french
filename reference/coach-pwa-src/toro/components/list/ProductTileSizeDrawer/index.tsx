import React, { useCallback, memo, useRef } from 'react'
import ProductTileSizeDrawerContent from 'toro/components/list/ProductTileSizeDrawer/ProductTileSizeDrawerContent'
import { useAtomValue } from 'jotai/utils'
import { addToBagSizesAtom, sizeDrawerVgIdAtom } from 'store/plp.atom'
import Box from 'toro/components/Box'
import useOutsideClick from 'toro/hooks/useOutsideClick'
import useAnalytics from 'toro/analytics/useAnalytics'
import { type SystemStyleObject } from '@chakra-ui/react'

type ProductTileSizeDrawerProps = {
  closeDrawer: () => void
  onAddToBagClick: (string) => void | Promise<void>
  styles?: Record<string, SystemStyleObject>
  isCMSTile?: boolean
  maxColumns?: number
}

const ProductTileSizeDrawer = function ({
  closeDrawer,
  onAddToBagClick,
  styles,
  isCMSTile,
  maxColumns,
}: ProductTileSizeDrawerProps): JSX.Element {
  const analytics = useAnalytics()
  const sizes = useAtomValue(addToBagSizesAtom)
  const containerRef = useRef(null)
  const variationGroupId = useAtomValue(sizeDrawerVgIdAtom)

  const onAddToBagClickHandler = useCallback(
    async (id) => {
      const selectedSize = sizes.find((size) => id === size.value)
      analytics.send('swatchInteraction', {
        eventAction: 'swatch click',
        eventLabel: variationGroupId,
        eventLocation: 'quick add to cart drawer',
        swatchType: 'size',
        swatchValue: selectedSize.name,
        swatchVariant: selectedSize.variantId,
      })
      await onAddToBagClick(selectedSize?.variantId)
      closeDrawer()
    },
    [sizes, onAddToBagClick]
  )

  useOutsideClick({
    ref: containerRef,
    handler: () => closeDrawer(),
  })

  return (
    <Box
      backgroundColor="rgba(255,255,255,0.9)"
      padding="0 var(--spacing-2) var(--spacing-1) var(--spacing-4)"
      ref={containerRef}
      data-qa="Size_drawer"
      className="size-drawer"
      sx={styles?.sizeDrawerBox}
    >
      <ProductTileSizeDrawerContent
        styles={styles}
        sizes={sizes}
        onAddToBagClick={onAddToBagClickHandler}
        isCMSTile={isCMSTile}
        maxColumns={maxColumns}
      />
    </Box>
  )
}

export default memo(ProductTileSizeDrawer)

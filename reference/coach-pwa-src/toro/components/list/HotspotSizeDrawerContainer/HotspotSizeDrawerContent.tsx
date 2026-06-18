import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import AlignedControlsContainer from 'toro/components/product/ProductVariationControls/AlignedControlsContainer'
import { PlpSizeDrawerSize } from 'toro/components/list/PlpSizeDrawer/types'
import Button from 'toro/components/Button'
import QuickAddToBag from 'toro/components/list/QuickAddToBag'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { addToBagSizesAtom, sizeDrawerVgIdAtom } from 'store/plp.atom'
import { closeHotspotSizeDrawerAtom } from 'store/global.atom'
import useAddToCart from 'toro/hooks/useAddToCart'

const HotspotSizeDrawerContent = (): JSX.Element => {
  const { formatMessage } = useIntl()
  const label = formatMessage({
    id: 'plp.tileSizeDrawer.callout',
    defaultMessage: 'Select Size',
  })
  const [activeSize, setActiveSize] = useState<PlpSizeDrawerSize | null>(null)

  const { addToCartVariant } = useAddToCart({ isSizedProduct: true })
  const closeSizeDrawer = useUpdateAtom(closeHotspotSizeDrawerAtom)

  const analytics = useAnalytics()
  const sizes = useAtomValue(addToBagSizesAtom)
  const variationGroupId = useAtomValue(sizeDrawerVgIdAtom)

  const onAddToBagClickHandler = async () => {
    if (!activeSize?.variantId) return
    await addToCartVariant(activeSize.variantId)
    closeSizeDrawer()
  }

  const maxItemsInRow = useMemo(() => {
    return sizes.some((size) => size.name?.length > 5) ? 2 : 4
  }, [sizes])

  const onSizeClick = (size: PlpSizeDrawerSize) => {
    if (activeSize?.value === size.value) {
      setActiveSize(null)
    } else {
      analytics.send('swatchInteraction', {
        eventAction: 'swatch click',
        eventLabel: variationGroupId,
        eventLocation: 'quick add to cart drawer',
        swatchType: 'size',
        swatchValue: size.name,
        swatchVariant: size.variantId,
      })
      setActiveSize(size)
    }
  }

  return (
    <>
      <Text
        variant="body-primary"
        padding="0 0 var(--spacing-4)"
        fontFamily="var(--font-face1-extended-normal)"
        lineHeight="var(--line-height-xxs)"
        textAlign="center"
        size="sm"
        className="drawer-label"
      >
        {label}
      </Text>

      <Box margin="0 0 var(--spacing-2)">
        <AlignedControlsContainer
          maxItemsInRow={maxItemsInRow}
          itemsMargin="var(--spacing-2)"
          variantType="size"
        >
          {sizes.map((size) => (
            <Button
              backgroundColor={
                activeSize?.value === size.value
                  ? 'var(--color-black-base)'
                  : 'var(--color-white-base)'
              }
              borderRadius={'var(--border-radius-m)'}
              variant="plp-variation-option"
              disabled={!size.orderable}
              onClick={() => onSizeClick(size)}
              padding="var(--spacing-1)"
              key={size.value}
            >
              <Text
                color={
                  activeSize?.value === size.value
                    ? 'var(--color-white-base)'
                    : 'var(--color-black-base)'
                }
                variant="body-primary-md"
                size="sm"
                className="truncated drawer-size-text"
              >
                {size.name.toLowerCase()}
              </Text>
            </Button>
          ))}
        </AlignedControlsContainer>
      </Box>
      <QuickAddToBag
        onClick={onAddToBagClickHandler}
        isProductSet={false}
        disabled={!activeSize}
        variant="hotspotSizeDrawer"
        showOnLegacy
      />
    </>
  )
}

export default HotspotSizeDrawerContent

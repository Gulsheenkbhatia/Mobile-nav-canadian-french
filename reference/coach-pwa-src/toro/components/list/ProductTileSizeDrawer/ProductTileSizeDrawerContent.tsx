import { memo } from 'react'
import { useIntl } from 'react-intl'
import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import AlignedControlsContainer from 'toro/components/product/ProductVariationControls/AlignedControlsContainer'
import { PlpSizeDrawerSizes } from 'toro/components/list/PlpSizeDrawer/types'
import Button from 'toro/components/Button'
import { type SystemStyleObject } from '@chakra-ui/react'

type ProductTileSizeDrawerContentProps = {
  sizes: PlpSizeDrawerSizes
  onAddToBagClick: (id: string) => void | Promise<void>
  styles?: Record<string, SystemStyleObject>
  isCMSTile?: boolean
  maxColumns?: number
}

const ProductTileSizeDrawerContent = function ({
  sizes,
  onAddToBagClick,
  styles,
  isCMSTile,
  maxColumns,
}: ProductTileSizeDrawerContentProps): JSX.Element {
  const { formatMessage } = useIntl()
  const label = formatMessage({
    id: 'plp.tileSizeDrawer.callout',
    defaultMessage: 'Choose size',
  })
  const isLongNameSizes = sizes.find((size) => size.name?.length > 5)
  const maxItemsInRow = maxColumns ?? (isLongNameSizes ? 2 : isCMSTile ? 3 : 4)

  return (
    <>
      <Text
        variant="body-primary"
        padding="var(--spacing-3) 0 var(--spacing-2)"
        fontFamily="var(--font-face1-extended-normal)"
        lineHeight="var(--line-height-xxs)"
        textAlign="center"
        size="lg"
        className="drawer-label"
        sx={styles?.sizeDrawerLabel}
      >
        {label}
      </Text>
      <Box className={`size-pill ${isLongNameSizes ? 'long-size' : ''}`}>
        <AlignedControlsContainer
          maxItemsInRow={maxItemsInRow}
          itemsMargin="var(--spacing-2)"
          variantType="size"
        >
          {sizes.map((size) => (
            <Button
              variant="plp-variation-option"
              disabled={!size.orderable}
              onClick={() => onAddToBagClick(size.value)}
              padding="var(--spacing-1)"
              key={size.value}
              sx={styles?.sizeDrawerBtn}
            >
              <Text variant="body-primary-md" size="sm" className="truncated drawer-size-text">
                {size.name.toLowerCase()}
              </Text>
            </Button>
          ))}
        </AlignedControlsContainer>
      </Box>
    </>
  )
}

export default memo(ProductTileSizeDrawerContent)

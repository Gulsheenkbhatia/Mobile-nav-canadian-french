import { memo } from 'react'
import { useIntl } from 'react-intl'
import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import Flex from 'toro/components/Flex'
import { CloseIcon } from 'toro/icons'
import AlignedControlsContainer from 'toro/components/product/ProductVariationControls/AlignedControlsContainer'
import PlpSizeDrawerOption from 'toro/components/list/PlpSizeDrawer/PlpSizeDrawerOption'
import { PlpSizeDrawerSizes } from 'toro/components/list/PlpSizeDrawer/types'

type PlpSizeDrawerContentProps = {
  onClose: () => void
  sizes: PlpSizeDrawerSizes
  selectedSizeValue: string
  onSizeControlClick: (id: string) => void | Promise<void>
  onAddToBagClick: () => void | Promise<void>
}

const PlpSizeDrawerContent = function ({
  onClose = () => {},
  sizes = [],
  selectedSizeValue = '',
  onSizeControlClick = () => {},
  onAddToBagClick = () => {},
}: PlpSizeDrawerContentProps): JSX.Element {
  const { formatMessage } = useIntl()
  const selectedSize = sizes.find((size) => selectedSizeValue === size.value)
  const attributeLabel = formatMessage({
    id: 'pdp.product.sizeReviewLabel',
    defaultMessage: 'Size',
  })
  const label = selectedSize
    ? `${attributeLabel}: ${selectedSize.name}`
    : formatMessage({
        id: 'plp.sizeDrawer.callout',
        defaultMessage: 'Please select a size',
      })
  const title = formatMessage({
    id: 'plp.sizeDrawer.title',
    defaultMessage: 'Select a size',
  })
  const atbCaption = formatMessage({
    id: 'plp.addToBagText',
    defaultMessage: 'Add to Bag',
  })
  const isLongNameSizes = sizes.find((size) => size.name?.length > 5)
  const maxItemsInRow = isLongNameSizes ? 2 : 5

  return (
    <>
      <Flex mb="22px">
        <Text
          variant="primary"
          size="sm"
          lineHeight="32px"
          flexGrow="1"
          data-qa="sizeDrawerHeading"
        >
          {title}
        </Text>
        <CloseIcon
          height="32px"
          width="32px"
          viewBox="0 0 26 26"
          onClick={onClose}
          data-qa="sizeDrawerClose"
        />
      </Flex>
      <Text variant="body-primary-sm" mb="var(--spacing-2)" data-qa="sizeDrawerLabel">
        {label}
      </Text>
      <Box pb="10px">
        <AlignedControlsContainer
          maxItemsInRow={maxItemsInRow}
          itemsMargin="var(--spacing-2)"
          variantType="size"
        >
          {sizes.map((size) => (
            <PlpSizeDrawerOption
              key={size.value}
              text={size.name}
              selected={selectedSizeValue === size.value}
              disabled={!size.orderable}
              clickHandler={onSizeControlClick}
              id={size.value}
            />
          ))}
        </AlignedControlsContainer>
      </Box>
      <Box borderBottom="1px solid var(--color-black-10)" position="absolute" left="0" right="0" />
      <PlpSizeDrawerAddToBagButton onClick={onAddToBagClick} caption={atbCaption} />
    </>
  )
}

type PlpSizeDrawerAddToBagButtonProps = {
  onClick: () => void | Promise<void>
  caption: string
}

const PlpSizeDrawerAddToBagButton = function ({
  onClick = () => {},
  caption = '',
}: PlpSizeDrawerAddToBagButtonProps): JSX.Element {
  return (
    <Button
      w="100%"
      variant="primary"
      h="57px"
      borderRadius="var(--border-radius-s)"
      my="var(--spacing-3)"
      sx={{
        '&:hover:not(:disabled)': {
          backgroundColor: 'var(--color-primary)',
        },
      }}
      onClick={onClick}
      data-qa="sizeDrawerSubmit"
    >
      {caption}
    </Button>
  )
}

export default memo(PlpSizeDrawerContent)

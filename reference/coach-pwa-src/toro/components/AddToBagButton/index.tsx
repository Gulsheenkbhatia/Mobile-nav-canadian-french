import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import useAddToCart, { type UseAddToCartProps } from 'toro/hooks/useAddToCart'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import Text from 'toro/components/Text'
import { AddToBagIcon } from 'toro/icons'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import type { SystemStyleObject } from '@chakra-ui/react'
import useViewportType from 'toro/hooks/useViewportType'
import { recAITypes } from 'toro/analytics/useRecommAnalytics'
import { NormalizedAccessorizeItProduct } from 'toro/types/productTypes'

const ProductTileSizeDrawer = dynamic(() => import('toro/components/list/ProductTileSizeDrawer'), {
  ssr: false,
})

export type AddToBagButtonVariant =
  | 'recomCarouselThink'
  | 'collapsibleRVOverlay'
  | 'recommendationsOnThinkPage'
  | 'visuallySimilarGrid'
  | 'lookbookRecommendations'
  | 'metaPLP'
  | 'recommendationsStack'

interface AnalyticsData {
  eventLocation?: string
  recAIType?: keyof typeof recAITypes
  experienceId?: string
  containerLabel?: string
  sendSelectItemFirst?: boolean
  index?: string
}

interface AddToBagButtonProps {
  variantId: string
  variantGroupId?: string
  isSizedProduct?: boolean
  disabled?: boolean
  styles?: Partial<Record<'wrapper' | 'button' | 'icon' | 'buttonText', SystemStyleObject>>
  isMobileOnly?: boolean
  isDesktopOnly?: boolean
  analyticsData?: AnalyticsData
  setIsATBButtonDisabled?: (isDisabled: boolean) => void
  buttonCaption?: string
  hideIcon?: boolean
  isAccessorizeItBundleProduct?: boolean
  isStandaloneAccessory?: boolean
  dataQA?: string
  onClick?: () => void
  onAddToCartSuccess?: UseAddToCartProps['onAddToCartSuccess']
  accessorizeItSelectedProduct?: NormalizedAccessorizeItProduct | null
  styleVariant?: AddToBagButtonVariant
  isSizeAlreadySelected?: boolean
}

const AddToBagButton = ({
  variantId,
  variantGroupId,
  isSizedProduct = false,
  disabled: disabledProp = false,
  styles,
  isMobileOnly = false,
  isDesktopOnly = false,
  analyticsData,
  setIsATBButtonDisabled,
  buttonCaption,
  hideIcon = false,
  isAccessorizeItBundleProduct = false,
  isStandaloneAccessory = false,
  dataQA,
  onClick = () => {},
  onAddToCartSuccess = () => {},
  accessorizeItSelectedProduct = null,
  styleVariant,
  isSizeAlreadySelected = false,
}: AddToBagButtonProps) => {
  const {
    addToCart,
    isMaxQuantityReached,
    isDisabled,
    showSizesSelectionDesktop,
    onCloseSizeDrawer,
    addToCartVariant,
  } = useAddToCart({
    variantId,
    variantGroupId,
    isSizedProduct,
    analyticsData,
    isAccessorizeItBundleProduct,
    isStandaloneAccessory,
    onAddToCartSuccess,
    accessorizeItSelectedProduct,
    isSizeAlreadySelected,
  })
  const { formatMessage } = useIntl()
  const { wrapper, button, icon, buttonText } = useMultiStyleConfig('AddToCartButton', {
    variant: styleVariant,
  })
  const { isMobile, isDesktop } = useViewportType()

  const disabled = isDisabled || isMaxQuantityReached || disabledProp

  useEffect(() => {
    setIsATBButtonDisabled?.(isDisabled)
  }, [isDisabled])

  if (isMobileOnly && !isMobile) {
    return null
  }

  if (isDesktopOnly && !isDesktop) {
    return null
  }

  const handleAddToBagClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart()
    onClick()
  }

  const isIconOnlyVariant = styleVariant === 'collapsibleRVOverlay'

  return (
    <Box sx={{ ...wrapper, ...styles?.wrapper }}>
      <Button
        disabled={disabled}
        onClick={handleAddToBagClick}
        sx={{ ...button, ...styles?.button }}
        data-qa={dataQA}
        aria-label={
          isIconOnlyVariant
            ? formatMessage({
                id: 'plp.addToBagText',
                defaultMessage: 'Add to Bag',
              })
            : undefined
        }
      >
        {!isMaxQuantityReached && !hideIcon && (
          <AddToBagIcon
            fill={disabled ? 'var(--color-neutral-base)' : 'var(--color-black-base)'}
            {...{ ...icon, ...styles?.icon }}
          />
        )}
        {!isIconOnlyVariant && (
          <Text sx={{ ...buttonText, ...styles?.buttonText }}>
            {isMaxQuantityReached
              ? formatMessage({
                  id: 'plp.itemLimitReachedText',
                  defaultMessage: 'Item Limit Reached',
                })
              : buttonCaption ||
                formatMessage({
                  id: 'plp.addToBagText',
                  defaultMessage: 'Add to Bag',
                })}
          </Text>
        )}
      </Button>
      {showSizesSelectionDesktop && (
        <Box position="absolute" left="0" right="0" bottom="0" height="auto">
          <ProductTileSizeDrawer
            closeDrawer={onCloseSizeDrawer}
            onAddToBagClick={(variantId) => {
              addToCartVariant(variantId)
            }}
          />
        </Box>
      )}
    </Box>
  )
}

export default AddToBagButton

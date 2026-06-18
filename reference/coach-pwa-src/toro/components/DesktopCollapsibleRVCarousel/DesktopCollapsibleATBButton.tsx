import { memo, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import Popover from 'toro/components/Popover'
import PopoverTrigger from 'toro/components/PopoverTrigger'
import PopoverContent from 'toro/components/PopoverContent'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import Text from 'toro/components/Text'
import useAddToCart, { type AnalyticsData } from 'toro/hooks/useAddToCart'
import type { SystemStyleObject } from '@chakra-ui/react'

const ProductTileSizeDrawer = dynamic(() => import('toro/components/list/ProductTileSizeDrawer'), {
  ssr: false,
})

type DesktopCollapsibleATBButtonProps = {
  variantId: string
  variantGroupId?: string
  isSizedProduct?: boolean
  analyticsData?: AnalyticsData
  styles?: Record<string, SystemStyleObject>
  setIsATBButtonDisabled?: (v: boolean) => void
}

const DesktopCollapsibleATBButton = memo(
  ({
    variantId,
    variantGroupId,
    isSizedProduct,
    analyticsData,
    styles,
    setIsATBButtonDisabled,
  }: DesktopCollapsibleATBButtonProps) => {
    const { formatMessage } = useIntl()
    const [openDown, setOpenDown] = useState(true)

    const {
      addToCart,
      addToCartVariant,
      isDisabled,
      isMaxQuantityReached,
      showSizesSelectionDesktop,
      onCloseSizeDrawer,
    } = useAddToCart({ variantId, variantGroupId, isSizedProduct, analyticsData })

    useEffect(() => {
      setIsATBButtonDisabled?.(isDisabled)
    }, [isDisabled, setIsATBButtonDisabled])

    useEffect(() => {
      if (!showSizesSelectionDesktop) return
      const bodyEl = document.getElementById('rv_desktop_collapsible_body')
      bodyEl?.addEventListener('scroll', onCloseSizeDrawer)
      return () => bodyEl?.removeEventListener('scroll', onCloseSizeDrawer)
    }, [showSizesSelectionDesktop, onCloseSizeDrawer])

    const popoverModifiers = useMemo(
      () => [
        {
          name: 'flip',
          options: { rootBoundary: 'viewport', fallbackPlacements: ['top'] },
        },
        {
          name: 'placementObserver',
          enabled: true,
          phase: 'write' as const,
          fn: ({ state }: { state: { placement: string } }) => {
            setOpenDown(state.placement.startsWith('bottom'))
          },
        },
      ],
      []
    )

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      addToCart()
    }

    return (
      <Box sx={styles?.wrapper}>
        <Popover
          isOpen={showSizesSelectionDesktop}
          onClose={onCloseSizeDrawer}
          placement="bottom"
          strategy="fixed"
          modifiers={popoverModifiers}
          isLazy
          closeOnBlur={false}
          gutter={0}
        >
          <PopoverTrigger>
            <Button
              disabled={isDisabled || isMaxQuantityReached}
              onClick={handleClick}
              sx={{
                ...styles?.button,
                ...(showSizesSelectionDesktop && openDown && styles?.buttonBorderBottom),
                ...(showSizesSelectionDesktop && !openDown && styles?.buttonBorderTop),
              }}
            >
              <Text sx={styles?.buttonText}>
                {showSizesSelectionDesktop
                  ? formatMessage({
                      id: 'plp.tileSizeDrawer.callout',
                      defaultMessage: 'Choose Size',
                    })
                  : formatMessage({ id: 'plp.addToBagText', defaultMessage: 'Add to Bag' })}
              </Text>
            </Button>
          </PopoverTrigger>
          <PopoverContent sx={styles?.sizeDrawerContainer}>
            <ProductTileSizeDrawer
              closeDrawer={onCloseSizeDrawer}
              onAddToBagClick={addToCartVariant}
              styles={{
                ...styles,
                sizeDrawerBox: {
                  ...styles?.sizeDrawerBox,
                  ...(openDown ? styles?.sizeDrawerBoxOpenDown : styles?.sizeDrawerBoxOpenUp),
                },
              }}
              maxColumns={2}
            />
          </PopoverContent>
        </Popover>
      </Box>
    )
  }
)

DesktopCollapsibleATBButton.displayName = 'DesktopCollapsibleATBButton'

export default DesktopCollapsibleATBButton

import React, { useEffect, FC, useMemo } from 'react'
import { IconButton, useBreakpointValue, Spinner, useMultiStyleConfig } from '@chakra-ui/react'
import get from 'lodash/get'
import { useAtomValue } from 'jotai/utils'
import DrawerContent from 'toro/components/DrawerContent'
import Drawer from 'toro/components/Drawer'
import DrawerOverlay from 'toro/components/DrawerOverlay'
import DrawerBody from 'toro/components/DrawerBody'
import { CloseIcon } from 'toro/icons'
import HtmlContent from 'toro/components/HtmlContent'
import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import { isProductDrawerOpenAtom, productDrawerContentAtom } from 'store/global.atom'
import { useProductDrawer } from 'toro/cms/hooks/useProductDrawer'
import useFetchContentAssetsForDrawer from 'toro/hooks/useFetchContentAssetsForDrawer'

interface CustomDrawerProps {
  variant?: string
  size?: string | object
  placement?: string
  [key: string]: any
}

interface ProductDrawerProps extends Omit<CustomDrawerProps, 'children' | 'onClose' | 'isOpen'> {
  children?: React.ReactNode
  onClose?: () => void
  triggerSelector?: string
}

const ProductDrawer: FC<ProductDrawerProps> = ({
  children,
  onClose,
  placement,
  variant = 'default',
  size = 'md',
  triggerSelector = '[data-drawer-trigger]',
  ...props
}) => {
  const styles = useMultiStyleConfig('ProductDrawer')
  const responsivePlacement = useBreakpointValue({ base: 'bottom', md: 'end' }) || 'end'

  const isOpen = useAtomValue(isProductDrawerOpenAtom)
  const dynamicContent = useAtomValue(productDrawerContentAtom)

  const { closeDrawer } = useProductDrawer()
  const { contentAssets, isLoadingAssets, handleContentAssetRequest, getCacheKey } =
    useFetchContentAssetsForDrawer()

  const cacheKey = useMemo(
    () => (dynamicContent ? getCacheKey(dynamicContent) : ''),
    [dynamicContent, getCacheKey]
  )

  const handleClose = () => {
    closeDrawer()
    onClose?.()
  }

  useEffect(() => {
    if (dynamicContent && handleContentAssetRequest) {
      handleContentAssetRequest(dynamicContent)
    }
  }, [dynamicContent, handleContentAssetRequest])

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      placement={responsivePlacement as any}
      variant={variant}
      size={size}
      {...props}
    >
      <DrawerOverlay sx={styles.overlay} />
      <DrawerContent sx={styles.content}>
        <Box sx={styles.closeButtonContainer}>
          <IconButton
            aria-label="Close drawer"
            icon={<CloseIcon width="24px" height="24px" viewBox="0 0 24 24" />}
            onClick={handleClose}
            sx={styles.closeButton}
            boxShadow="md"
          />
        </Box>

        <DrawerBody flex="1" overflowY="auto" padding={0}>
          {dynamicContent ? (
            <>
              {isLoadingAssets ? (
                <Box sx={styles.loadingContainer}>
                  <Spinner size="lg" />
                </Box>
              ) : contentAssets[cacheKey]?.status === '404' ? (
                <Box sx={styles.notFoundContainer}>
                  <Text size="lg" variant="body-primary">
                    Content not found
                  </Text>
                </Box>
              ) : (
                <HtmlContent
                  content={get(contentAssets[cacheKey], 'c_body.default.markup')}
                  lazyLoadVideos
                />
              )}
            </>
          ) : (
            children
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default ProductDrawer

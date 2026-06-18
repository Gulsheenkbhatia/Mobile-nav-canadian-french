import { memo, useCallback } from 'react'
import Drawer from 'toro/components/Drawer'
import { useAtom } from 'jotai'
import { isShowingSignUpDisclaimerModalAtom } from 'store/pdp.atom'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import DrawerOverlay from 'toro/components/DrawerOverlay'
import DrawerContent from 'toro/components/DrawerContent'
import DrawerCloseButton from 'toro/components/DrawerCloseButton'
import HtmlContent from 'toro/components/HtmlContent'

const SignUpDisclaimerModal = ({ content }) => {
  const [isShowShippingAndReturnModal, setShowShippingAndReturnModal] = useAtom(
    isShowingSignUpDisclaimerModalAtom
  )
  const styles = useMultiStyleConfig('SignUpDisclaimerModal')

  const onClose = useCallback(
    () => setShowShippingAndReturnModal(false),
    [setShowShippingAndReturnModal]
  )

  return (
    <Drawer
      isOpen={isShowShippingAndReturnModal}
      onClose={onClose}
      variant="flyout"
      size="lg"
      placement="bottom"
    >
      <DrawerOverlay />
      <DrawerContent sx={styles.drawerContent}>
        <DrawerCloseButton />
        <HtmlContent content={content} />
      </DrawerContent>
    </Drawer>
  )
}

export default memo(SignUpDisclaimerModal)

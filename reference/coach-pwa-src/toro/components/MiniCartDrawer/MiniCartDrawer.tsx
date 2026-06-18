import DrawerContent from 'toro/components/DrawerContent'
import Drawer from 'toro/components/Drawer'
import DrawerBody from 'toro/components/DrawerBody'
import DrawerOverlay from 'toro/components/DrawerOverlay'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import MiniCartPopover from 'toro/components/header/MiniCart/MiniCartPopover'
import { miniCartOpenReasonAtom } from 'store/global.atom'
import { useAtomValue, useResetAtom } from 'jotai/utils'

function MiniCartDrawer(miniCartProps) {
  const miniCartOpenReason = useAtomValue(miniCartOpenReasonAtom)
  const hideMiniCart = useResetAtom(miniCartOpenReasonAtom)

  const styles = useMultiStyleConfig('MiniCartDrawer')

  const isOpen = !!miniCartOpenReason

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      variant="mini-cart"
      size="lg"
      onClose={() => {
        hideMiniCart()
      }}
    >
      <DrawerOverlay sx={styles.drawerOverlay} />
      <DrawerContent sx={styles.drawerContent}>
        <DrawerBody sx={styles.drawerBody}>
          <MiniCartPopover {...miniCartProps} renderOnlyContent={true} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default MiniCartDrawer

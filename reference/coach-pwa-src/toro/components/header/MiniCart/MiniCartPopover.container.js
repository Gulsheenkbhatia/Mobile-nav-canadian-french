import get from 'lodash/get'
import { useContext, useEffect } from 'react'
import { useAtom } from 'jotai'
import SessionContext from 'toro/components/SessionContext'
import useViewportType from 'toro/hooks/useViewportType'
import { isLoadMiniCartPopoverAtom } from 'store/miniCartPopover.atom'
import MiniCartPopover from 'toro/components/header/MiniCart/MiniCartPopover'
import { useAtomValue } from 'jotai/utils'
import MiniCartDrawer from 'toro/components/MiniCartDrawer/MiniCartDrawer'
import { aeDrawerConfigAtom } from 'store/ae-drawer.atom'

export default function MiniCartPopoverContainer({ ...props }) {
  const { session } = useContext(SessionContext)
  const { isDesktop } = useViewportType()
  const cart = get(session, 'cart', {})
  const [isLoadMiniCartPopover, setLoadMiniCartPopover] = useAtom(isLoadMiniCartPopoverAtom)
  const { showDrawer } = useAtomValue(aeDrawerConfigAtom)

  /*
   * Load popover if the user already has some products in the cart
   * */
  useEffect(() => {
    if (isLoadMiniCartPopover) return

    if (get(cart, 'product_items', []).length) {
      setLoadMiniCartPopover(true)
    }
  }, [cart, isLoadMiniCartPopover, setLoadMiniCartPopover])

  if (!isLoadMiniCartPopover) {
    return null
  }

  if (showDrawer && isDesktop) {
    return <MiniCartDrawer {...props} />
  }

  return <MiniCartPopover {...props} />
}

import dynamic from 'next/dynamic'
import type { PrimitiveAtom } from 'jotai'

import useDisclosure from 'toro/hooks/useDisclosure'
import Drawer from 'toro/components/Drawer'
import { useAtom } from 'jotai'
import { isShowingShippingAndReturnsModal } from 'store/pdp.atom'

const ShippingAndReturnsContent = dynamic(
  () => import('toro/components/ShippingAndReturnsModal/ShippingAndReturnsContent'),
  {
    ssr: false,
  }
)

export type ShippingAndReturnsModalProps = {
  title: string
  shippingBody: unknown
  /** Defaults to shared free-shipping modal; pass a custom atom for Fast Shipping or payment-variety drawers */
  openStateAtom?: PrimitiveAtom<boolean>
}

const ShippingAndReturnsModal = ({
  title,
  shippingBody,
  openStateAtom = isShowingShippingAndReturnsModal,
}: ShippingAndReturnsModalProps) => {
  const [isOpenState, setOpenState] = useAtom(openStateAtom)

  const { isOpen, onClose } = useDisclosure({
    isOpen: isOpenState,
    onClose: () => setOpenState(false),
  })

  return (
    <Drawer isOpen={isOpen} onClose={onClose} variant="flyout" size="lg" placement="bottom">
      <ShippingAndReturnsContent title={title} shippingBody={shippingBody} />
    </Drawer>
  )
}

export default ShippingAndReturnsModal

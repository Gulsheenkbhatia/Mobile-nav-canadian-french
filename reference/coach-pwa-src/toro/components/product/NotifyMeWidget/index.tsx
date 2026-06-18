import { memo } from 'react'
import dynamic from 'next/dynamic'
import {
  notifyMeChosenProductIdAtom,
  notifyMeModalDataAtom,
  isNotifyMeModalRenderedAtom,
} from 'store/notifyme.atom'
import { useAtomValue } from 'jotai/utils'

const NotifyMePopUp = dynamic(
  () => import('toro/components/product/NotifyMeWidget/NotifyMePopUp'),
  {
    ssr: false,
  }
)

const NotifyMePopUpWrapper = () => {
  const isNotifyMeModalRendered = useAtomValue(isNotifyMeModalRenderedAtom)
  const notifyMeChosenProductId = useAtomValue(notifyMeChosenProductIdAtom)
  const notifyMeModalData = useAtomValue(notifyMeModalDataAtom)

  if (!isNotifyMeModalRendered || !notifyMeChosenProductId || !notifyMeModalData) {
    return null
  }

  return <NotifyMePopUp />
}

export default memo(NotifyMePopUpWrapper)

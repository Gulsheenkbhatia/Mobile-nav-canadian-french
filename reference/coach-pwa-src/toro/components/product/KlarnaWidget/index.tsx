import { PropsOf, useDisclosure } from '@chakra-ui/react'
import { useAtomValue } from 'jotai/utils'
import { appLoadingAtom, isKlarnaEnabledAtom, klarnaDetailsAtom } from 'store/pdp.atom'
import get from 'lodash/get'
import KlarnaLabel from 'toro/components/product/KlarnaWidget/KlarnaLabel'
import withOffload from 'toro/hocs/withOffload'
import dynamic from 'next/dynamic'
import Skeleton from 'toro/components/Skeleton'

const KlarnaModal = dynamic(() => import('toro/components/product/KlarnaWidget/KlarnaModal'), {
  ssr: false,
})

type KlarnaWidgetProps = {
  skeletonProps: PropsOf<typeof Skeleton>
}

const KlarnaWidget = ({ skeletonProps }: KlarnaWidgetProps) => {
  const apploading = useAtomValue(appLoadingAtom)
  const isKlarnaEnabled = useAtomValue(isKlarnaEnabledAtom)
  const klarnaDetails = useAtomValue(klarnaDetailsAtom)
  const [loadKlarnaModal, OffloadedKlarnaModal] = withOffload(KlarnaModal)
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (apploading) {
    return <Skeleton bg="var(--neutrals-color-neutral-light)" {...skeletonProps} />
  }

  if (!isKlarnaEnabled) {
    return null
  }

  return (
    <>
      <KlarnaLabel onClick={onOpen} onMouseEnter={loadKlarnaModal} {...klarnaDetails} />
      <OffloadedKlarnaModal
        url={get(klarnaDetails, 'learnMoreLabel.url', '')}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  )
}

export default KlarnaWidget

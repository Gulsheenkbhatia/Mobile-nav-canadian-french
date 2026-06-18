import React, { forwardRef, ReactElement, ComponentType, MouseEvent } from 'react'
import dynamic from 'next/dynamic'
import useDisclosure from 'toro/hooks/useDisclosure'

const PromoModal = dynamic(() => import('toro/components/PromoModal'), {
  ssr: false,
})

export interface IWithPromoModalProps {
  onClick?: (e?: MouseEvent) => void
  isPromoModal: boolean
  scriptContent: string
  content: string
  masterId: string
  shouldInjectJquery: boolean
}

const withPromoModal = <P extends object>(Component: ComponentType<P>) =>
  forwardRef<HTMLElement, P & IWithPromoModalProps>((props, ref) => {
    const { isPromoModal = false, onClick, ...rest } = props as P & IWithPromoModalProps
    if (!isPromoModal) {
      return <Component ref={ref} onClick={onClick} {...(rest as P)} />
    }

    return (
      <ModalInjector onClick={onClick as (() => void) | undefined}>
        {(onOpen: () => void) => <Component ref={ref} onClick={onOpen} {...(rest as P)} />}
      </ModalInjector>
    )
  })

const ModalInjector: React.FC<{
  onClick?: () => void
  children: (onOpen: () => void) => ReactElement
}> = ({ onClick: onClickProp, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ onOpen: onClickProp })

  return (
    <>
      {children(onOpen)}
      <PromoModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default withPromoModal

import React, { useCallback, useContext, useEffect, useRef } from 'react'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import useTheme from 'toro/hooks/useTheme'
import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'
import useViewportType from 'toro/hooks/useViewportType'
import HtmlContent from 'toro/components/HtmlContent'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'
import { isThreadUpModalVisibleAtom } from 'store/global.atom'
import { useAtom } from 'jotai'

const ThreadUpModal = () => {
  const { appData } = useContext(PWAContext)
  const { isDesktop } = useViewportType()
  const thredUpModalContent = get(appData, 'thredUpModalContent.contentSlots.html', '')
  const theme = useTheme()
  const { space } = theme
  const threadUpModalRef = useRef(null)
  const { contentUpdated, onClick: onThreadUpCTAClick } = useCmsAnalytics(threadUpModalRef)
  const [isThreadUpModalVisible, setIsThreadUpModalVisible] = useAtom(isThreadUpModalVisibleAtom)

  useEffect(() => {
    contentUpdated()
  }, [])

  const onClose = useCallback(() => {
    setIsThreadUpModalVisible(false)
  }, [])

  return (
    <Modal onClose={onClose} isOpen={isThreadUpModalVisible} isCentered>
      <ModalOverlay />
      <ModalContent
        sx={
          isDesktop
            ? {
                maxWidth: 'none',
                minHeight: '300px',
                padding: '24px',
                width: '600px',
              }
            : {
                minHeight: '300px',
                margin: 'auto 10px',
              }
        }
      >
        <ModalCloseButton
          top={space.l}
          right={space.l}
          sx={{
            '&:focus': {
              boxShadow: 'none',
            },
            '& svg': { width: space.m, height: space.m },
            zIndex: 100,
          }}
        />

        <HtmlContent
          content={thredUpModalContent}
          ref={threadUpModalRef}
          onClick={onThreadUpCTAClick}
        />
      </ModalContent>
    </Modal>
  )
}

export default ThreadUpModal

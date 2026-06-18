import React, { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  openShopAssistChatRequestAtom,
  setOpenShopAssistChatRequestAtom,
  stickyAiChatAtom,
} from 'store/shop-assist-chat.atom'
import ChatLauncher from 'toro/components/ShopAssistChat/ChatLauncher'
import StylesProvider from 'toro/components/StylesProvider'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

const ShopAssistChatContent = dynamic(
  () => import('toro/components/ShopAssistChat/ShopAssistChatContent'),
  { ssr: false }
)

export default function ShopAssistChat() {
  const eventLocation = useAtomValue(openShopAssistChatRequestAtom)
  const setEventLocation = useUpdateAtom(setOpenShopAssistChatRequestAtom)
  const setStickyAiChat = useUpdateAtom(stickyAiChatAtom)
  const [isClosing, setIsClosing] = useState(false)

  const styles = useMultiStyleConfig('AIShopAssistChat')
  const isOpen = eventLocation !== null

  const handleLauncherOpen = useCallback(() => {
    setEventLocation('sticky icon')
    setStickyAiChat(true)
  }, [setEventLocation, setStickyAiChat])

  const handleClose = useCallback(() => {
    setIsClosing(true)
  }, [])

  const handleCloseComplete = useCallback(() => {
    setEventLocation(null)
    setIsClosing(false)
  }, [setEventLocation])

  return (
    <StylesProvider value={styles}>
      {!isOpen && !isClosing ? (
        <ChatLauncher onOpen={handleLauncherOpen} />
      ) : (
        <ShopAssistChatContent
          disclosure={{
            isOpen,
            onOpen: setEventLocation,
            onClose: handleClose,
          }}
          isClosing={isClosing}
          onCloseComplete={handleCloseComplete}
        />
      )}
    </StylesProvider>
  )
}

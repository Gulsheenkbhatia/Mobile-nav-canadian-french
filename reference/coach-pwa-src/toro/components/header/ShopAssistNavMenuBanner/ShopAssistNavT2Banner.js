import React, { useCallback } from 'react'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import Button from 'toro/components/Button'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useUpdateAtom } from 'jotai/utils'
import { setOpenShopAssistChatRequestAtom } from 'store/shop-assist-chat.atom'
import { isMobileMenuVisibleAtom } from 'store/global.atom'
import { useIntl } from 'react-intl'

const ShopAssistNavT2Banner = () => {
  const { formatMessage } = useIntl()
  const setIsMobileMenuVisible = useUpdateAtom(isMobileMenuVisibleAtom)
  const setOpenShopAssistChat = useUpdateAtom(setOpenShopAssistChatRequestAtom)

  const handleOpenChat = useCallback(() => {
    setIsMobileMenuVisible(false)
    setOpenShopAssistChat('nav')
  }, [setIsMobileMenuVisible, setOpenShopAssistChat])

  const backgroundImage = formatMessage({
    id: 'shopAssistChat.chatLauncher.aiT2BannerBackgroundImage',
    defaultMessage:
      'https://katespade.scene7.com/is/image/KateSpade/ol_mar_promo1_oas_bkg?$navImage-4-7-m$',
  })

  const styles = useMultiStyleConfig('ShopAssistNavMenuBanner')

  return (
    <Flex className="shop-assist-nav-t2-banner" sx={styles.t2container} bgImage={backgroundImage}>
      <Box className="shop-assist-nav-t2-banner-content" sx={styles.t2content}>
        <Text className="shop-assist-nav-t2-banner-title" sx={styles.t2title}>
          {formatMessage({
            id: 'shopAssistChat.chatLauncher.aiT2BannerText',
            defaultMessage: "Let's Find the Perfect Gift",
          })}
        </Text>
        <Text className="shop-assist-nav-t2-banner-description" sx={styles.t2description}>
          {formatMessage({
            id: 'shopAssistChat.chatLauncher.aiT2BannerDescription',
            defaultMessage:
              "Your personal AI gifting expert — ready to help you find something they'll truly love.",
          })}
        </Text>
        <Button
          className="shop-assist-nav-t2-banner-button"
          sx={styles.t2button}
          onClick={handleOpenChat}
        >
          {formatMessage({
            id: 'shopAssistChat.chatLauncher.aiT2BannerButtonText',
            defaultMessage: "Find a gift they'll love",
          })}
        </Button>
      </Box>
    </Flex>
  )
}

export default ShopAssistNavT2Banner

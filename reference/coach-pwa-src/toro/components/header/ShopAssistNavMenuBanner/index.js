import { memo, useCallback } from 'react'
import { useUpdateAtom } from 'jotai/utils'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { setOpenShopAssistChatRequestAtom } from 'store/shop-assist-chat.atom'
import { isMobileMenuVisibleAtom } from 'store/global.atom'
import usePreference from 'toro/hooks/usePreference_new'
import { useIntl } from 'react-intl'

const ShopAssistNavMenuBanner = () => {
  const {
    aiGiftConcierge: {
      aiGiftConciergeData: { T1EntryPointsCategory = '', isGiftConciergeEnabled = false } = {},
    } = {},
  } = usePreference({ aiGiftConcierge: ['aiGiftConciergeData'] })
  const { formatMessage } = useIntl()
  const { MagicIcon } = useMultiStyleConfig('Icons')
  const styles = useMultiStyleConfig('ShopAssistNavMenuBanner')
  const setIsMobileMenuVisible = useUpdateAtom(isMobileMenuVisibleAtom)
  const setOpenShopAssistChat = useUpdateAtom(setOpenShopAssistChatRequestAtom)

  const isT1enable = !!(isGiftConciergeEnabled && T1EntryPointsCategory)

  const handleOpenChat = useCallback(() => {
    setIsMobileMenuVisible(false)
    setOpenShopAssistChat('nav')
  }, [setIsMobileMenuVisible, setOpenShopAssistChat])

  return (
    <Box
      as="button"
      type="button"
      className="shop-assist-nav-t1-banner"
      sx={{
        ...styles.bannerWrapper,
        ...(!isT1enable && styles.mt),
      }}
      onClick={handleOpenChat}
      data-qa="open-ai-concierge-mobile-menu"
    >
      <Text className="shop-assist-nav-t1-banner-title" sx={styles.bannerWrapperText}>
        {formatMessage({
          id: 'shopAssistChat.chatLauncher.aiCtaNavMenuLabel',
          defaultMessage: 'AI Gift Assistant',
        }).toUpperCase()}
      </Text>
      <Box className="shop-assist-nav-t1-banner-icon" sx={styles.iconWrapper}>
        <MagicIcon />
      </Box>
    </Box>
  )
}

export default memo(ShopAssistNavMenuBanner)

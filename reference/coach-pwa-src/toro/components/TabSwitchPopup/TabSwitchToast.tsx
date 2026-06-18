import React, { useRef } from 'react'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useOutsideClick from 'toro/hooks/useOutsideClick'
import ImageCoach from '@tapestry-inc/design-tokens/coach/logo/primary-black.svg'
import ImageOutlet from '@tapestry-inc/design-tokens/coach-outlet/logo/primary-black.svg'
import CloseIcon from '@tapestry-inc/design-tokens/coach/icon/utility/m-close.svg'
import { ONE_SITE_BRAND_TABS, OneSiteBrandTabs } from 'lib/oneSite/config'

interface TabSwitchToastProps {
  description: string
  onClose: () => void
  activeTab: OneSiteBrandTabs
  sendCloseEvent: () => void
}

const BRAND_CONFIG = {
  [ONE_SITE_BRAND_TABS.COACH]: {
    Logo: ImageCoach,
    width: 114,
    height: 13,
  },
  [ONE_SITE_BRAND_TABS.OUTLET]: {
    Logo: ImageOutlet,
    width: 185,
    height: 12,
  },
} as const

const TabSwitchToast: React.FC<TabSwitchToastProps> = ({
  description,
  onClose,
  activeTab,
  sendCloseEvent,
}) => {
  const styles = useMultiStyleConfig('TabSwitchPopup')
  const brandConfig = BRAND_CONFIG[activeTab] || BRAND_CONFIG[ONE_SITE_BRAND_TABS.COACH]
  const { Logo, width, height } = brandConfig
  const containerRef = useRef<HTMLDivElement>(null)

  const handleCloseWithAnalytics = () => {
    sendCloseEvent()
    onClose()
  }

  useOutsideClick({
    ref: containerRef,
    handler: onClose,
  })

  return (
    <Flex ref={containerRef} sx={styles.container} data-qa="tab_switch_popup_container">
      <Box
        as="button"
        onClick={handleCloseWithAnalytics}
        sx={styles.closeButton}
        data-qa="tab_switch_popup_close"
        aria-label="Close"
      >
        <CloseIcon aria-hidden width="16px" height="16px" />
      </Box>
      <Flex sx={styles.content}>
        <Text sx={styles.message} data-qa="tab_switch_popup_message">
          {description}
        </Text>
        <Box>
          <Logo width={width} height={height} data-qa="tab_switch_popup_logo" />
        </Box>
      </Flex>
    </Flex>
  )
}

const renderToast = (activeTab: OneSiteBrandTabs, message: string, sendCloseEvent: () => void) => {
  return (props: { onClose: () => void }) => (
    <TabSwitchToast
      description={message}
      activeTab={activeTab}
      onClose={props.onClose}
      sendCloseEvent={sendCloseEvent}
    />
  )
}

export default renderToast

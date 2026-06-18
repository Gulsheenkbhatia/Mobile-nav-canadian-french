import { memo, useCallback } from 'react'
import useAnalytics from 'toro/analytics/useAnalytics'
import useStyleConfig from 'toro/hooks/useStyleConfig'

import Box from 'toro/components/Box'
import initTulipLiveChat from 'toro/helpers/initTulipLiveChat'

const StylingAdvice = ({ productId, markup, isMobile, tulipConfigData }) => {
  const analytics = useAnalytics()
  const stylingAdviceTheme = useStyleConfig('StylingAdviceTheme')

  const onClick = useCallback(
    ({ target }) => {
      analytics.send('productInteraction', {
        eventLocation: 'product',
        eventAction: 'need stylists advice',
        eventLabel: productId,
      })
      if (
        target?.matches('.btn.btn-link.btn-medium.styling-advice__action') &&
        window.tuliplivechat
      ) {
        initTulipLiveChat(tulipConfigData)
      }
    },
    [productId, analytics.send, tulipConfigData]
  )

  return (
    <Box
      dangerouslySetInnerHTML={{ __html: markup }}
      className={!markup ? 'pdp-styling-advice' : ''}
      sx={stylingAdviceTheme}
      w="100%"
      minH={isMobile ? '103px' : ''}
      onClick={onClick}
      marginBottom="30px"
    />
  )
}

export default memo(StylingAdvice)

import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import useTheme from 'toro/hooks/useTheme'
import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import { SHOW_UNDER_Y, INSTANT_BEH_UNDER_Y } from 'helpers/variables'
import useAnalytics from 'toro/analytics/useAnalytics'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleComponent, { MultiStyleComponent } from 'toro/hooks/useMultiStyleComponent'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useStickyAiEntryPoint from 'toro/components/ShopAssistChat/hooks/useStickyAiEntryPoint'

const BackToTopButton = () => {
  const theme = useTheme()
  const { formatMessage } = useIntl()
  const [visible, setVisible] = useState(false)
  const analytics = useAnalytics()
  const { BackToTop } = useMultiStyleComponent(MultiStyleComponent.icons)
  const backToTopStyles = useMultiStyleConfig('BackToTop')
  const isStickyAiChatAllowed = useStickyAiEntryPoint()

  const onClickScrollToTop = () => {
    const behavior = getScrollY() > INSTANT_BEH_UNDER_Y ? 'auto' : 'smooth'
    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
    })

    analytics.send('listInteraction', {
      eventAction: 'go to top',
      eventLocation: 'icon',
    })
  }

  useEffect(() => {
    if (visible) {
      document.body.classList.add('backtotop-visible')
    } else {
      document.body.classList.remove('backtotop-visible')
    }
  }, [visible])

  useEffect(() => {
    const remove = window.scrollListener.add(() => setVisible(getScrollY() > SHOW_UNDER_Y))
    return remove
  }, [])

  if (isStickyAiChatAllowed) return null

  return (
    <Box display={visible ? 'block' : 'none'} sx={backToTopStyles.parentContainer}>
      <Button
        onClick={onClickScrollToTop}
        sx={{
          position: 'fixed',
          right: '12px',
          bottom: '12px',
          zIndex: 199,
          borderRadius: '50%',
          height: '38px',
          width: '38px',
          padding: '0',
          backgroundColor: theme.colors.main.white,
          '&:hover': {
            backgroundColor: theme.colors.main.white + '!important',
          },
          '&:focus': {
            boxShadow: theme.boxShadow.button,
            outline: 'none',
          },
          boxShadow: theme.boxShadow.button,
          '& path': {
            fill: 'var(--border-color-primary)',
          },
        }}
        data-qa="cm_btn_backtotop"
        id="backToTopBtn"
        title={formatMessage({ id: 'footer.backToTop.toolTip', defaultMessage: 'top' })}
      >
        <BackToTop />
      </Button>
    </Box>
  )
}

function getScrollY() {
  return window.scrollY || window.pageYOffset
}

export default withErrorBoundaryWrapper(BackToTopButton)

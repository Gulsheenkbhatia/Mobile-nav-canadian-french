export default function initTulipLiveChat(tulipConfigData) {
  if (window.tuliplivechat.initializedGloballyAndDirty) {
    window.tuliplivechat.openChatWindow(true)
  } else {
    const config = {
      ...(tulipConfigData?.tulipConfig || {}),
      ...{
        integrationId: tulipConfigData?.tulipPref?.tulipIntegrationID,
        cssOverwritePath: tulipConfigData?.tulipPref?.customCSSForTulip,
        buttonIconUrl: tulipConfigData?.tulipPref?.tulipChatBubbleIcon,
        businessIconUrl: null,
      },
    }
    window.tuliplivechat
      ?.init(config)
      .then(() => {
        window.tuliplivechat.openChatWindow(true)
        window.tuliplivechat.showChatBubble(true)
        // THIS IS NEEDED BECAUSE WE DON'T WANT TO
        // BE SUBSCRIBING TO 'WIDGET:OPENED|CLOSED' EACH TIME WE ENTER PDP
        // AND APPARENTLY TULIPLIVECHAT DOESN'T PROVIDE A WAY TO UNSUBSCRIBE
        window.tuliplivechat.initializedGloballyAndDirty = true
      })
      .catch(() => {
        console.error('FIXME: Unable to initialize tuliplivechat')
      })

    const addOpened = () => {
      document.querySelector('#web-messenger-container')?.classList.add('opened')
    }
    const addClosed = () => {
      document.querySelector('#web-messenger-container')?.classList.remove('opened')
    }
    window.tuliplivechat.on('widget:opened', addOpened)
    window.tuliplivechat.on('widget:closed', addClosed)
  }
}

import { FormattedMessage, useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Image from 'toro/components/Image'
import Link from 'toro/components/Link'

import useStyles from 'toro/hooks/useStyles'
import { InfoOutlinedIcon } from 'toro/icons'
import PromptSlider from 'toro/components/ShopAssistChat/PromptSlider'
import usePreference from 'toro/hooks/usePreference_new'
import { getChatStarterMessages } from 'toro/components/ShopAssistChat/utils'

interface Props {
  onSelectPrompt: (message: string) => void
}

export default function ChatStarter({ onSelectPrompt }: Props) {
  const styles = useStyles()
  const { formatMessage } = useIntl()

  const messages = getChatStarterMessages(formatMessage)

  const {
    aiGiftConcierge: { aiGiftConciergeData: { kateSpadeStarterAnimationUrl = '' } = {} } = {},
  } = usePreference({
    aiGiftConcierge: ['aiGiftConciergeData'],
  })

  return (
    <Box className="shop-assist-chat-starter" sx={styles.chatStarterContainer}>
      <Box className="shop-assist-chat-starter-center-content" sx={styles.centerContent}>
        <Box sx={styles.chatStarterIllustration}>
          {kateSpadeStarterAnimationUrl && (
            <Image src={kateSpadeStarterAnimationUrl} alt="Starter animation" />
          )}
        </Box>
        <Box className="shop-assist-chat-starter-text-wrapper" sx={styles.chatStarterTextWrapper}>
          <Text sx={styles.chatStarterHeading}>{messages.heading}</Text>

          <Text
            className="shop-assist-chat-starter-sub-text"
            sx={styles.chatStarterSubText}
            dangerouslySetInnerHTML={{
              __html: messages.subText,
            }}
          />
        </Box>
        <PromptSlider onSelectPrompt={onSelectPrompt} />
      </Box>

      <Box className="shop-assist-chat-starter-info-disclaimer" sx={styles.infoDisclaimer}>
        <Box sx={styles.infoRow}>
          <InfoOutlinedIcon
            width={14}
            height={14}
            style={{
              stroke: 'rgba(71, 3, 20, 0.8)',
              transform: 'scale(0.85)',
            }}
          />

          <Text className="shop-assist-chat-starter-info-text" sx={styles.infoText}>
            <FormattedMessage
              id={`shopAssistChat.chatStarterScreen.${messages.contactCustomerCare.key}`}
              defaultMessage={messages.contactCustomerCare.defaultMessage}
              values={{
                link: (
                  <Link
                    href={messages.contactCustomerCareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {messages.contactUsHere}
                  </Link>
                ),
              }}
            />
          </Text>
        </Box>

        <Link
          href={messages.privacyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shop-assist-chat-starter-privacy-link"
          sx={styles.privacyLink}
        >
          {messages.privacyDetails}
        </Link>
      </Box>
    </Box>
  )
}

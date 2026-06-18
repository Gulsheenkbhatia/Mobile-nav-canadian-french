import Box from 'toro/components/Box'
import PromptTile from 'toro/components/ShopAssistChat/PromptTile'
import useStyles from 'toro/hooks/useStyles'
import { getWelcomePrompts } from 'toro/components/ShopAssistChat/utils'
import { useIntl } from 'react-intl'
import usePreference from 'toro/hooks/usePreference_new'

interface Props {
  onSelectPrompt: (value: string) => void
}

const PromptSlider = ({ onSelectPrompt }: Props) => {
  const styles = useStyles()
  const { formatMessage } = useIntl()
  const {
    aiGiftConcierge: { aiGiftConciergeData: { giftingAssistantPromptLabels = [] } = {} } = {},
  } = usePreference({
    aiGiftConcierge: ['aiGiftConciergeData'],
  })

  const welcomePrompts = getWelcomePrompts(formatMessage, giftingAssistantPromptLabels)

  const mid = Math.ceil(welcomePrompts.length / 2)
  const row1 = welcomePrompts.slice(0, mid)
  const row2 = welcomePrompts.slice(mid)

  return (
    <Box sx={styles.promptRow}>
      <Box sx={styles.promptRowTop}>
        {row1.map((prompt) => (
          <PromptTile
            key={`row1-${prompt}`}
            label={prompt}
            onClick={() => onSelectPrompt(prompt)}
          />
        ))}
      </Box>

      <Box sx={styles.promptRowBottom}>
        {row2.map((prompt) => (
          <PromptTile
            key={`row2-${prompt}`}
            label={prompt}
            onClick={() => onSelectPrompt(prompt)}
          />
        ))}
      </Box>
    </Box>
  )
}

export default PromptSlider

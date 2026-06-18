import PromptArrowIcon from 'toro/icons/promptArrowIcon.svg'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import useStyles from 'toro/hooks/useStyles'

interface PromptProps {
  label: string
  onClick: () => void
}

export default function PromptTile({ label, onClick }: PromptProps) {
  const styles = useStyles()

  return (
    <Box as="button" type="button" sx={styles.promptTile} onClick={onClick}>
      <Box sx={styles.promptTileIconWrapper} aria-hidden="true">
        <PromptArrowIcon width="10px" height="8px" />
      </Box>

      <Text sx={styles.promptTileText}>{label}</Text>
    </Box>
  )
}

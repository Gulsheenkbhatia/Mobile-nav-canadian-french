import Box from 'toro/components/Box'
import { PlayCtaIcon as PlayIcon } from 'toro/icons'

/**
 * Renders overlay icon over media that can be played
 */
const MediaPlayOverlay = (props) => {
  return (
    <Box
      position="absolute"
      transform="translate(-50%, -50%)"
      top="50%"
      left="50%"
      zIndex="1"
      pointerEvents="none"
      {...props}
    >
      <PlayIcon width="44px" height="44px" />
    </Box>
  )
}

export default MediaPlayOverlay

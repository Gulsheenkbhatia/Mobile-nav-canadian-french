import Box from 'toro/components/Box'
import { BlueStar, RedStar } from 'toro/icons'
import { SystemStyleObject } from '@chakra-ui/react'

type InlineSearchStarsIconsProps = {
  styles: Record<string, SystemStyleObject | any>
}

function InlineSearchStarsIcons({ styles }: InlineSearchStarsIconsProps) {
  return (
    <>
      <Box sx={styles.redStar}>
        <RedStar width="24px" height="24px" />
      </Box>
      <Box sx={styles.blueStar}>
        <BlueStar width="35px" height="35px" />
      </Box>
    </>
  )
}

export default InlineSearchStarsIcons

import { useCallback, useEffect, useState } from 'react'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'
import { SystemStyleObject } from '@chakra-ui/react'

type InlineSearchPlaceholderProps = {
  styles: Record<string, SystemStyleObject | any>
}

function InlineSearchPlaceholder({ styles }: InlineSearchPlaceholderProps) {
  const {
    adaptiveExperience: { inlineSearchPlaceholders: inlineSearchPlaceholdersPreference },
  } = usePreference({
    adaptiveExperience: ['inlineSearchPlaceholders'],
  })
  const inlineSearchPlaceholders = get(
    inlineSearchPlaceholdersPreference,
    'inlineSearchPlaceholders'
  )

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % inlineSearchPlaceholders?.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [inlineSearchPlaceholders?.length])

  const itemStatus = useCallback(
    (idx: number) => {
      if (idx < currentIndex) {
        return 'prev'
      }

      if (idx > currentIndex) {
        return 'next'
      }

      return 'active'
    },
    [currentIndex]
  )

  if (!inlineSearchPlaceholders) {
    return null
  }

  return (
    <Box sx={styles.verticalSliderContainer}>
      <Box sx={styles.verticalSlider}>
        {inlineSearchPlaceholders.map((placeHolder: string, idx: number) => (
          <Text key={`${placeHolder}-${idx}`} sx={styles.sliderItem} className={itemStatus(idx)}>
            {placeHolder}
          </Text>
        ))}
      </Box>
    </Box>
  )
}

export default InlineSearchPlaceholder

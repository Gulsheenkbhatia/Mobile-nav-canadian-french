import { useStyles } from '@chakra-ui/react'
import { FC, useEffect, useRef } from 'react'

import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import type { RecommendationsBlockProps } from 'toro/components/RecommendationsContainer/types'

const MobileRecommendations: FC<RecommendationsBlockProps> = ({ children }) => {
  const styles: any = useStyles()
  const recommendationRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (recommendationRef.current) {
      recommendationRef.current?.scrollTo({ left: 0 })
    }
  }, [])

  return (
    <Box maxW="100vw" className="mob-recommend" sx={styles.baseRecommendationMobileWrapper}>
      <Flex
        maxWidth="100vw"
        ref={recommendationRef}
        className="mob-recommend-items"
        sx={styles.baseRecommendationMobileItems}
      >
        {children}
      </Flex>
    </Box>
  )
}

export default MobileRecommendations

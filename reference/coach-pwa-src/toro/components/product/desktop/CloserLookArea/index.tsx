import React from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Image from 'toro/components/Image'
import Heading from 'toro/components/Heading'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useProductData from 'toro/hooks/useProductData'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import { isSpecificAssetTypeSrc } from 'toro/components/product/ProductMediaArea/helpers'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import useHeaderHeight from 'toro/hooks/useHeaderHeight'

function CloserLookArea() {
  const headerHeight = useHeaderHeight()
  const styles = useMultiStyleConfig('CloserLookArea', { headerHeight })

  const [closerLookHeader, closerLookText] = useProductData([
    'custom.c_closerLookHeader',
    'custom.c_closerLookText',
  ])

  const {
    closerLookAttributes: { closerLookImageSuffix },
  } = usePreferenceNew({
    closerLookAttributes: ['closerLookImageSuffix'],
  })

  const selectedColorMediaFull = useSelectedColorData('media.full') || []
  const closerLookImageSrc = selectedColorMediaFull.find((item) =>
    isSpecificAssetTypeSrc(item?.src, closerLookImageSuffix)
  )?.src

  const isCloserLookEnable = closerLookHeader && closerLookText && !!closerLookImageSrc

  if (!isCloserLookEnable) return null

  return (
    <Box id="closerlook-section" sx={styles.closerLookSection}>
      <Flex sx={styles.gridWrapperContainer}>
        <Flex sx={styles.gridContainer}>
          <Box sx={styles.column}>
            <Image src={closerLookImageSrc} lazy sx={styles.image} />
          </Box>
          <Box sx={{ ...styles.column, ...styles.rightColumn }}>
            <Box>
              <Heading as="h2" sx={styles.closerLookHeading}>
                {closerLookHeader}
              </Heading>
              <Box sx={styles.closerLookText}>{closerLookText}</Box>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}

export default withErrorBoundaryWrapper(CloserLookArea)

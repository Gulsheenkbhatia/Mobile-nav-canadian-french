import { type FC } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Skeleton from 'toro/components/Skeleton'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

type DesktopSkeletonProps = {
  accessorizeItRef?: (node: any) => void
}

const DesktopSkeleton: FC<DesktopSkeletonProps> = ({ accessorizeItRef }) => {
  const styles = useMultiStyleConfig('AccessorizeIt')

  return (
    <>
      <Box height="2px" />
      <Flex ref={accessorizeItRef} sx={styles.rootSkeleton} id="accessorize-it-container">
        {/* Image container skeleton */}
        <Box sx={styles.imageContainerSkeleton()}>
          <Skeleton sx={styles.imageSkeleton} />
        </Box>
        {/* Container wrapper skeleton */}
        <Box sx={styles.containerWrapperSkeleton}>
          {/* Title skeleton */}
          <Skeleton sx={styles.titleSkeleton} />

          {/* Subtitle skeleton */}
          <Skeleton sx={styles.subtitleSkeleton} />

          {/* Tabs skeleton */}
          <Box sx={styles.tabsSectionSkeleton}>
            <Flex sx={styles.tabsSectionInnerSkeleton}>
              {/* Tab list skeleton */}
              <Flex sx={styles.tabsListSkeleton}>
                <Skeleton sx={styles.tabsListItemSkeleton} />
                <Skeleton sx={styles.tabsListItemSkeleton} />
              </Flex>

              {/* Products row skeleton */}
              <Skeleton sx={styles.productsRowSkeleton} />

              {/* Add to bag button skeleton */}
              <Flex sx={styles.addToBagButtonsSkeleton}>
                <Skeleton sx={styles.addToBagButtonSkeleton} />
                <Skeleton sx={styles.addToBagButtonSkeleton} />
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </>
  )
}

export default DesktopSkeleton

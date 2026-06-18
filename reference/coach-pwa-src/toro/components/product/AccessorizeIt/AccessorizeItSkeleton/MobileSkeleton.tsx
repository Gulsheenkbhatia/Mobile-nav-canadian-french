import { type FC } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Skeleton from 'toro/components/Skeleton'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

type MobileSkeletonProps = {
  accessorizeItRef?: (node: any) => void
  isPdpV6?: boolean
}

const MobileSkeleton: FC<MobileSkeletonProps> = ({ accessorizeItRef, isPdpV6 }) => {
  const styles = useMultiStyleConfig('AccessorizeIt')

  return (
    <>
      <Box height="2px" />
      <Box
        ref={accessorizeItRef}
        id="accessorize-it-container"
        sx={styles?.accessorizeItScrollTarget ?? {}}
      >
        {/* Background skeleton */}
        <Skeleton sx={styles.rootSkeleton}>
          {/* Main content wrapper */}
          <Box sx={styles.contentSkeleton}>
            <Flex sx={styles.topSectionSkeleton}>
              {/* Title skeleton */}
              <Skeleton sx={styles.titleSkeleton} />

              {/* Subtitle skeleton */}
              <Skeleton sx={styles.subtitleSkeleton} />

              {/* Image container skeleton */}
              <Box sx={styles.imageContainerSkeleton(isPdpV6)}>
                <Skeleton sx={styles.imageSkeleton} />
              </Box>
            </Flex>

            {/* Tabs section */}
            <Box sx={styles.tabsSectionSkeleton}>
              <Flex sx={styles.tabsSectionInnerSkeleton}>
                {/* Tab list skeleton */}
                <Flex sx={styles.tabsListSkeleton}>
                  <Skeleton sx={styles.tabsListItemSkeleton} />
                  <Skeleton sx={styles.tabsListItemSkeleton} />
                </Flex>

                {/* Products row skeleton */}
                <Flex sx={styles.productsRowSkeleton}>
                  {Array.from({ length: 6 }, (_, index) => (
                    <Skeleton key={index} sx={styles.productSkeleton} />
                  ))}
                </Flex>

                {/* Add to bag button skeleton */}
                <Flex sx={styles.addToBagButtonsSkeleton}>
                  <Skeleton sx={styles.addToBagButtonSkeleton} />
                  <Skeleton sx={styles.addToBagButtonSkeleton} />
                </Flex>
              </Flex>
            </Box>
          </Box>
        </Skeleton>
      </Box>
    </>
  )
}

export default MobileSkeleton
